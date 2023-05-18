import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {Global} from '../../providers/global/global';
import {RestService} from '../../providers/rest-service/rest-service';
import {User} from '../../model/user';
import {Template} from "../../model/template";
import {SQLite, SQLiteObject} from '@ionic-native/sqlite';
import {Survey} from '../../model/survey';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  user: User = new User();
  templates: Template = new Template();
  showLoginError = false;
  showLoginOffline = false;

  loading: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public loadingController: LoadingController,
              public global: Global,
              public service: RestService,
              public sqlite: SQLite) {

    this.user.companyCode = 'KTI';
    this.global.currentView = 'Login';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  login() {
    console.log('login attempt...');

    this.showLoginError = false;
    this.showLoginOffline = false;
    this.loading = this.loadingController.create({ content: "Logging in, please wait..." });

    try {

      if (this.global.networkStatus === 'ONLINE') {

        this.loading.present();

        this.service.login(this.user).subscribe(data => {
            this.user = data;
            console.log('username => ' + this.user.userId);
            console.log('msg => ' + this.user.msg);

            if (this.user && this.user.msg === 'SUCCESS') {
              this.global.username = this.user.userId;
              this.global.company_code = this.user.companyCode;
              this.global.fullname = this.user.firstName + ' ' + this.user.lastName;
              this.global.location = this.user.divloc.substr(3);
              this.global.jobTitle = this.user.jobTitle;
              this.global.email = this.user.email;
              this.global.phone = this.user.phone;
              this.global.period = this.user.period;

              this.global.updateTables();

              for (let i = 0; i < this.user.restrictList.length; i++) {
                this.global.restrictList.push(this.user.restrictList[i]);
              }

              const offlineRestrictList: string[] = this.global.getOfflineRestrictList();
              for (let i = 0; i < offlineRestrictList.length; i++) {
                this.global.restrictList.push(offlineRestrictList[i]);
              }

              this.global.setPeriodInfo();


              this.global.print();

              if (this.global.networkStatus === 'ONLINE') {

                this.global.removeTemplates();

                this.service.getTemplates(this.global.location).subscribe(t => {
                  this.templates = t;
                  this.global.updateTemplates(this.templates);
                });

                console.log('*********************');
                console.log('* sync offline data *');
                console.log('*********************');
                this.sqlite.create({
                  name: 'field-user.db',
                  location: 'default'
                }).then((db: SQLiteObject) => {

                  db.executeSql('SELECT response FROM response ', [])
                    .then(res => {

                      if (res.rows.length == 0) {
                        console.log('no offline surveys found in response table');
                      }

                      for (let i = 0; i < res.rows.length; i++) {

                        console.log('adding offline restrictkey => ' + res.rows.item(i).restrictkey);
                        this.global.restrictList.push(res.rows.item(i).restrictkey);

                        const cached = new Survey(JSON.parse(res.rows.item(i).response));

                        if (cached.survey_stat === 'F') {

                          this.service.postSurvey(cached).subscribe(data => {
                              console.log(JSON.stringify(data, null, 2));

                              db.executeSql('DELETE FROM response WHERE survey_id = ?', [data.survey_id])
                                .then(del => console.log('delete offline survey_id => ' + data.survey_id))
                                .catch(e => console.log(e));
                            },
                            err => {
                              return console.error(err.message);
                            });
                        }

                      }

                    })
                    .catch(e => {
                      console.log(JSON.stringify(e, Object.getOwnPropertyNames(e)));
                    });


                }).catch(e => console.log(e));

              }
              this.loading.dismissAll();

              this.navCtrl.push('HomePage');
            } else {
              this.loading.dismissAll();
              this.showLoginError = true;
            }
          },
          err => {
            return console.error(err.message);
          });
      } else {
        this.loading.dismissAll();
        this.showLoginError = false;
        this.showLoginOffline = true;
      }
    } catch(e) {
      console.error(e.message);
    }
    finally {
      this.loading.dismissAll();
    }
  }

}

import { Component } from '@angular/core';
import { AlertController, IonicPage, MenuController, NavController, NavParams } from 'ionic-angular';
import {Global} from '../../providers/global/global';
import {Search} from '../../model/search';
import {RestService} from '../../providers/rest-service/rest-service';
import {Survey} from '../../model/survey';
import {SQLite, SQLiteObject} from '@ionic-native/sqlite';
import {HttpClient} from "@angular/common/http";

/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  offlineSurveyList: Survey[] = new Array();
  search: Search = new Search();
  message: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public alertCtrl: AlertController,
              public menuCtrl: MenuController,
              public global: Global,
              public service: RestService,
              public sqlite: SQLite,
              public http: HttpClient) {

    this.global.currentView = 'Home';
    this.global.print();

  }

  ionViewDidLoad() {

    console.log('*********************');
    console.log('* initializing home *');
    console.log('*********************');

    this.search.msg = '';
    this.search.location = this.global.location;

    console.log('***************************');
    console.log('* get surveys from server *');
    console.log('***************************');
    if(this.global.networkStatus === 'ONLINE') {

      this.service.getInProgress(this.search).subscribe(data => {
          this.search = data;
        },
        err => {
          return console.error(err.message);
        });

    }

    console.log('***************************');
    console.log('* checking response table *');
    console.log('***************************');
    this.sqlite.create({
      name: 'field-user.db',
      location: 'default'
    }).then((db: SQLiteObject) => {

      db.executeSql('SELECT response FROM response ',[])
        .then(res => {

          if(res.rows.length == 0) {
            console.log('no offline surveys found in response table');
          }

          for(let i=0; i<res.rows.length; i++) {
            this.offlineSurveyList.push(new Survey(JSON.parse(res.rows.item(i).response)));
            console.log('added survey_id => ' + this.offlineSurveyList[i].survey_id);
          }

        })
        .catch(e => {
          console.log(JSON.stringify(e, Object.getOwnPropertyNames(e)));
        });

    }).catch(e => console.log(e));

    this.menuCtrl.toggle();

  }

  onSearch() {

  }

  view(id) {
    console.log('selected existing survey_resp_id => ' + id);
    this.navCtrl.push('SurveyPage',{id: id});
  }

  getStatusDesc(code: string) : string {
    if (code === 'H') {
      return 'IN PROGRESS'
    } else if (code === 'F') {
      return 'FINISHED'
    } else if (code === 'O') {
      return 'OPEN'
    } else if (code === 'C') {
      return 'CLOSED'
    }
    else{
      return code;
    }
  }

  print(url: string) {

    console.log('url => ' + url);

    this.http.get(url, { responseType: 'text' as 'text' }).subscribe(res => {

      console.log(res);

      if(res.indexOf('SUCCESS') > -1 ) {
        let alert = this.alertCtrl.create({
          title: 'Print Confirmation',
          message: 'Print request successfully sent to server',
          buttons: ['OK']
        });
        alert.present();
      }
      else {
        let alert = this.alertCtrl.create({
          title: 'Print Failure',
          message: 'Print request was unsuccessful. Please contact the system administrator.',
          buttons: ['OK']
        });
        alert.present();
      }

    });


    /*
    this.service.print(url).subscribe(data => {

        console.log(data);


        let alert = this.alertCtrl.create({
          title: 'Print Confirmation',
          message: 'Print request successfully sent to server.',
          buttons: ['OK']
        });
        alert.present();


      },
      err => {

        let alert = this.alertCtrl.create({
          title: 'Print Failure',
          message: 'Print request was unsuccessful. Please contact the system administrator.',
          buttons: ['OK']
        });
        alert.present();

        return console.error(err.message);
      });
      */

  }

}

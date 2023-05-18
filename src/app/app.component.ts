import { Component, ViewChild  } from '@angular/core';
import { AlertController, NavController, Platform, Events, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { NetworkProvider } from '../providers/network/network';
import { Global } from '../providers/global/global';
import {RestService} from '../providers/rest-service/rest-service';
import {SQLite, SQLiteObject} from '@ionic-native/sqlite';
import {Survey} from "../model/survey";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  rootPage:any = 'LoginPage';

  showMenuOption: boolean =  false;

  @ViewChild('content') _NAV : NavController;

  constructor(platform: Platform,
              statusBar: StatusBar,
              splashScreen: SplashScreen,
              public alertCtrl: AlertController,
              public menuCtrl: MenuController,
              public networkStatus: NetworkProvider,
              public events: Events,
              public global: Global,
              public service: RestService,
              public sqlite: SQLite) {

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      /* Check networkStatus */

      this.networkStatus.initializeNetworkEvents();

      this.events.subscribe('network:offline', () => {

        this.global.networkStatus = 'OFFLINE';

        console.log('network:offline ==> ' + this.networkStatus.getNetworkType());

        let alert = this.alertCtrl.create({
          title: 'Connection Failed!',
          subTitle: 'Your internet connection is currently not available. You can continue working in OFFLINE mode.',
          buttons: [{
            text: ('OK')
          }]
        });

        alert.present();

      });

      this.events.subscribe('network:online', () => {

        this.global.networkStatus = 'ONLINE';

        console.log('*********************');
        console.log('* sync offline data *');
        console.log('*********************');
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

                const survey: Survey = new Survey(JSON.parse(res.rows.item(i).response));
                if(survey.survey_stat === 'F') {

                  this.service.postSurvey(survey).subscribe(data => {
                      console.log("synced offline survey...");
                      db.executeSql('DELETE FROM response WHERE survey_id = ?', [data.survey_id])
                        .then(res => console.log('delete survey_id => ' + data.survey_id))
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

        console.log('network:online ==> ' + this.networkStatus.getNetworkType());

        let alert = this.alertCtrl.create({
          title: 'Internet Connection Success',
          subTitle: 'You are now online!',
          buttons: [{
            text: ('OK')
          }]
        });

        alert.present();

      });

      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  navigateHome() {
    this._NAV.setRoot('HomePage');
    this.menuCtrl.close();
  }

  navigateSurvey() {
    this._NAV.setRoot('SurveyPage');
    this.menuCtrl.close();
  }

  navigateIllnessLog() {
    this._NAV.setRoot('IllnessLogPage');
    this.menuCtrl.close();
  }

  navigateInjury() {
    this._NAV.setRoot('InjuryPage');
    this.menuCtrl.close();
  }

  navigateRestrictions() {
    this._NAV.setRoot('RestrictionsPage');
    this.menuCtrl.close();
  }

  navigatePropertyDamage() {
    this._NAV.setRoot('PropertyDamagePage');
    this.menuCtrl.close();
  }

  navigateGuest() {
    this._NAV.setRoot('GuestPage');
    this.menuCtrl.close();
  }

  navigateCarWash() {
    this._NAV.setRoot('CarWashPage');
    this.menuCtrl.close();
  }

  navigateProduct() {
    this._NAV.setRoot('ProductPage');
    this.menuCtrl.close();
  }

  navigateFuel() {
    this._NAV.setRoot('FuelPage');
    this.menuCtrl.close();
  }

  navigateAuto() {
    this._NAV.setRoot('AutoPage');
    this.menuCtrl.close();
  }

  navigateLogout() {
    this._NAV.setRoot(this.rootPage);
    this.menuCtrl.close();
  }
}


import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the InfoPopupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-info-popup',
  templateUrl: 'info-popup.html',
})
export class InfoPopupPage {

  msg: string = '';
  isImage: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    this.msg = navParams.get('msg');
    this.isImage = navParams.get('isImage');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InfoPopupPage');
  }

  close() {
    this.viewCtrl.dismiss();
  }

}

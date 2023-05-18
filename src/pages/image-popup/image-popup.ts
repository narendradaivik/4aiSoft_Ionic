import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';

/**
 * Generated class for the ImagePopupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-image-popup',
  templateUrl: 'image-popup.html',
})
export class ImagePopupPage {

  imageURL: string = '';

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    this.imageURL = navParams.get('imageURL');
    console.log('ImagePopupPage setting imageURL => ' + this.imageURL);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ImagePopupPage');
  }

  close() {
    this.viewCtrl.dismiss();
  }

}

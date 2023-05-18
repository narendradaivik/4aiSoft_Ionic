import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Global} from '../../providers/global/global';
import {RestService} from '../../providers/rest-service/rest-service';
import {Intake} from "../../model/intake";
import {IntakeDetail} from "../../model/intake-detail";

/**
 * Generated class for the InjuryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-injury',
  templateUrl: 'injury.html',
})
export class InjuryPage {

  intake: Intake = new Intake();
  intakeDetail: IntakeDetail;

  dateOfLoss: string;
  timeOfLoss: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public global: Global,
              public service: RestService) {
    this.global.currentView = 'Injury';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InjuryPage');

    this.intake.currentStep = '1';
    this.intake.company_cd = this.global.company_code;
    this.intake.location_cd = this.global.location;

    this.service.postIntake(this.intake).subscribe(data => {
        this.intake = data;
        this.intakeDetail = data.intakeDetailList[0];
      },
      err => {
        return console.error(err.message);
      });
  }

  selectEmployee(employeeId) {
    console.log('selected employee id => ' + employeeId);
    this.intake.currentStep = '2';

  }

}

import {Component, Inject, ViewChild} from '@angular/core';
import {
  IonicPage,
  NavController,
  ModalController,
  NavParams,
  PopoverController,
  Content,
  AlertController,
  LoadingController
} from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import {Global} from '../../providers/global/global';
import {RestService} from '../../providers/rest-service/rest-service';
import {Survey} from '../../model/survey';
import {SurveyImage} from '../../model/survey-image';
//import {ImagePopupPage} from '../image-popup/image-popup';
import {InfoPopupPage} from '../info-popup/info-popup';
import {environment} from '../../environments/environment';
import {SurveyDetailChoice} from '../../model/survey-detail-choice';
import {SQLite, SQLiteObject} from '@ionic-native/sqlite';


/**
 * Generated class for the SurveyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-survey',
  providers: [
    { provide: 'Window', useValue: window }
  ],
  templateUrl: 'survey.html',
})
export class SurveyPage {

  @ViewChild('top') pageTop: Content;


  validationMsg = [];

  saveMsg: string = null;

  survey: Survey = new Survey();
  offlineSurvey: Survey = new Survey();
  categoryName: string = null;
  categoryNumber: number = 0;
  url = environment.WSUrl;

  isOfflineMode: boolean = false;
  disableSurveySelection: boolean = false;
  showCompleteButton: boolean = false;
  disableButton: boolean = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public popoverCtrl: PopoverController,
              public modalCtrl: ModalController,
              public alertCtrl: AlertController,
              public loadingController: LoadingController,
              private camera: Camera,
              public global: Global,
              public service: RestService,
              public sqlite: SQLite,
              @Inject('Window') private window: Window, ) {


  }

  ionViewDidLoad() {

    this.disableButton = false;
    this.global.currentView = 'Survey';

    this.global.setPeriodInfo();

    this.global.print();

    console.log('****************************');
    console.log('* initializing survey data *');
    console.log('****************************');

    let id = this.navParams.get('id');
    let val= 'EXISTING';

    if(!id) {
      console.log('parameter id was not passed, setting to -1');
      id = '-1';
      val = 'NEW';
    }

    if(id !== '-1') {

      console.log('retrieving offline survey id => ' + id);

      this.sqlite.create({
        name: 'field-user.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('SELECT response FROM response WHERE survey_id = ?', [parseInt(id)])
          .then(res => {

            if(res.rows.length == 0) {
              this.isOfflineMode = false;
            }
            else {
              this.survey = new Survey(JSON.parse(res.rows.item(0).response));
              this.offlineSurvey = new Survey(JSON.parse(res.rows.item(0).response));

              this.isOfflineMode = true;

              if (this.survey.surveyDetailList.length > 0) {
                this.offlineSurvey.surveyDetailList.length = 0;
                for (let i = 0; i < this.survey.surveyDetailList.length; i++) {
                  if (this.survey.display_type === 'CATEGORY') {
                    if (this.survey.surveyDetailList[i].quest_catnum === 0) {
                      console.log('setting category name to => ' + this.survey.surveyDetailList[i].question_cat);
                      console.log('category => ' + this.survey.surveyDetailList[i].quest_catnum);
                      console.log('question => ' + this.survey.surveyDetailList[i].question_no);
                      this.categoryName = this.survey.surveyDetailList[i].question_cat;
                      this.categoryNumber = this.survey.surveyDetailList[i].quest_catnum;
                      this.offlineSurvey.surveyDetailList.push(this.survey.surveyDetailList[i]);
                    }
                  }
                  else{
                    this.offlineSurvey.surveyDetailList.push(this.survey.surveyDetailList[i]);
                  }
                }
              }

              this.sync();

              if (this.survey.display_type !== 'CATEGORY') {
                this.showCompleteButton = true;
              } else {
                this.showCompleteButton = false;
              }

              this.survey.progress.goTo = '0';
              this.setOfflineProgress();
            }
          })
          .catch(e => console.log(e));

      }).catch(e => console.log(e));
    } else if(id !== '-1' && this.isOfflineMode === false && this.global.networkStatus === 'ONLINE') {

      this.service.getSurvey(id, val).subscribe(data => {

          this.survey = data;
          console.log('# of rows received from survey data => ' + this.survey.surveyDetailList.length)

          this.disableSurveySelection = true;

          if (this.survey.display_type !== 'CATEGORY') {
            this.showCompleteButton = true;
          }
          else {
            this.showCompleteButton = false;
            this.categoryName = this.survey.surveyDetailList[0].question_cat;
            this.categoryNumber = this.survey.surveyDetailList[0].quest_catnum;
          }

        },
        err => {
          return console.error(err.message);
        });
    }
    else if(id === '-1') {
      console.log('getting survey from local db');

      this.sqlite.create({
        name: 'field-user.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('SELECT template FROM template WHERE survey_id = ?', [parseInt(id)])
          .then(res => {
            //console.log(res.rows.item(0).template);
            this.survey = new Survey(JSON.parse(res.rows.item(0).template));
            console.log('returning template => ' + this.survey.survey_id);
            console.log('# of surveys in dropdown => ' + this.survey.surveyDropDownList.length);
          })
          .catch(e => console.log(e));

      }).catch(e => console.log(e));

      this.isOfflineMode      = true;
      this.survey.company_cd  = this.global.company_code;
      this.survey.location_cd = this.global.location.toUpperCase();
      this.survey.survey_stat = 'H';
      this.survey.inspct_by   = this.global.fullname;
      this.survey.inspct_byid = this.global.username;
      this.survey.inspct_eml  = this.global.email;
      this.survey.inspct_ph1  = this.global.phone;
      this.survey.entry_by    = this.global.username;
      this.survey.modify_by   = this.global.username;
      this.survey.inspct_date = new Date(this.getNowTimestamp()).getUTCDate();
    }
    else{
      let alert = this.alertCtrl.create({
        title: 'Connection Failed!',
        subTitle: 'Your internet connection is currently not available. You are not able to view existing audits at this time.',
        buttons: [{
          text: ('OK')
        }]
      });

      alert.present().then( a => this.navCtrl.push('HomePage'));
    }
  }

  onFieldChange(index, choice){

    console.log('in onFieldChange(index, choice)');

    if (!choice) {
      console.log('HOUSTON WE HAVE A PROBLEM!!!!');
    }
    console.log('index => ' + index);
    console.log('qst_com_req => ' + choice.qstval_rqcom);
    console.log('quest_fldscr => ' + choice.quest_fldscr);
    console.log('quest_fldwgt => ' + choice.quest_fldwgt);

    if(this.isOfflineMode){
      this.offlineSurvey.surveyDetailList[index].qst_com_req = choice.qstval_rqcom;
      this.offlineSurvey.surveyDetailList[index].quest_fldscr = choice.quest_fldscr;
      this.offlineSurvey.surveyDetailList[index].quest_fldwgt = choice.quest_fldwgt;
    }
    else {
      this.survey.surveyDetailList[index].qst_com_req = choice.qstval_rqcom;
      this.survey.surveyDetailList[index].quest_fldscr = choice.quest_fldscr;
      this.survey.surveyDetailList[index].quest_fldwgt = choice.quest_fldwgt;
    }
  }


  onFieldChange2(index, val){
    console.log('in onFieldChange(index, choice)');
    console.log('index => ' +   index);
    console.log('val => '   +   val);

    let choice = new SurveyDetailChoice();

    if(this.isOfflineMode) {
      for(let i = 0; i < this.offlineSurvey.surveyDetailList[index].surveyDetailChoiceList.length; i++) {
        if(this.offlineSurvey.surveyDetailList[index].surveyDetailChoiceList[i].quest_fldval === val) {
          choice = this.offlineSurvey.surveyDetailList[index].surveyDetailChoiceList[i];
        }
      }

      this.offlineSurvey.surveyDetailList[index].qst_com_req = choice.qstval_rqcom;
      this.offlineSurvey.surveyDetailList[index].quest_fldscr = choice.quest_fldscr;
      this.offlineSurvey.surveyDetailList[index].quest_fldwgt = choice.quest_fldwgt;
    }
    else {

      for (let i = 0; i < this.survey.surveyDetailList[index].surveyDetailChoiceList.length; i++) {
        if (this.survey.surveyDetailList[index].surveyDetailChoiceList[i].quest_fldval === val) {
          choice = this.survey.surveyDetailList[index].surveyDetailChoiceList[i];
        }
      }

      this.survey.surveyDetailList[index].qst_com_req = choice.qstval_rqcom;
      this.survey.surveyDetailList[index].quest_fldscr = choice.quest_fldscr;
      this.survey.surveyDetailList[index].quest_fldwgt = choice.quest_fldwgt;
    }
  }


  onPopover(popupEvent, message) {
    let popover = this.popoverCtrl.create(InfoPopupPage,{msg: message, isImage: false});
    popover.present({
      ev: popupEvent
    });
  }

  onImagePopover(popupEvent, surveyImage) {
    console.log('show popup for survey image id => ' + surveyImage.survey_resp_img_id);
    const imageUrl = this.url + 'download?id=' + surveyImage.survey_resp_img_id;
    console.log('url for survey image => ' + imageUrl);

    let popover = this.popoverCtrl.create(InfoPopupPage,{msg: imageUrl, isImage: true});
    popover.present({
      ev: popupEvent
    });

    /*
    let imageModal = this.modalCtrl.create(ImagePopupPage, { url: imageUrl });
    imageModal.present();
    */
  }

  onChangeSurvey(surveyId) {

    this.global.setPeriodInfo();

    this.global.print();

    let isRestricted: boolean = false;
    const restrictId1 = this.global.location.toUpperCase() + ':' + surveyId + ':' + this.global.year + '-' + this.global.month;
    const restrictId2 = this.global.location.toUpperCase() + ':' + surveyId + ':' + this.global.year + '-' + this.global.quarter;

    for(let r = 0; r < this.global.restrictList.length; r++) {

      console.log('comparing ' + restrictId1 + '|' + restrictId2 + ' to ' + this.global.restrictList[r]);
      if(this.global.restrictList[r] === restrictId1 || this.global.restrictList[r] === restrictId2) {
        console.log('is restricted');
        isRestricted = true;
      }
    }

    if(isRestricted){
      let alert = this.alertCtrl.create({
        title: 'Duplicate Audit',
        subTitle: 'You have tried to select a duplicate audit. Please select the existing audit from the home page.',
        buttons: [{
          text: ('OK')
        }]
      });

      alert.present();
    }
    else {
      console.log('new survey =>' + surveyId);

      if (this.isOfflineMode === true) {
        this.sqlite.create({
          name: 'field-user.db',
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql('SELECT template FROM template WHERE survey_id = ?', [surveyId])
            .then(res => {
              console.log('============================================');
              console.log(res.rows.item(0).template);
              console.log('============================================');
              this.survey = new Survey(JSON.parse(res.rows.item(0).template));
              this.survey.company_cd = this.global.company_code;
              this.survey.location_cd = this.global.location.toUpperCase();
              this.survey.survey_stat = 'H';
              this.survey.inspct_by = this.global.fullname;
              this.survey.inspct_byid = this.global.username;
              this.survey.inspct_eml = this.global.email;
              this.survey.inspct_ph1 = this.global.phone;
              this.survey.entry_by = this.global.username;
              this.survey.modify_by = this.global.username;
              this.survey.inspct_date = new Date(this.getNowTimestamp()).getUTCDate();

              if (this.survey.frequency === 'MONTHLY') {
                this.survey.period = this.global.year + '-' + this.global.month;
              }
              else {
                this.survey.period = this.global.year + '-' + this.global.quarter;
              }

              if (this.survey.surveyDetailList.length > 0) {
                this.offlineSurvey = new Survey(JSON.parse(JSON.stringify(this.survey)));
                this.offlineSurvey.surveyDetailList = [];
                for (let i = 0; i < this.survey.surveyDetailList.length; i++) {
                  if (this.survey.display_type === 'CATEGORY') {
                    if (this.survey.surveyDetailList[i].quest_catnum === 0) {
                      console.log('setting category name to => ' + this.survey.surveyDetailList[i].question_cat);
                      console.log('category => ' + this.survey.surveyDetailList[i].quest_catnum);
                      console.log('question => ' + this.survey.surveyDetailList[i].question_no);
                      this.categoryName = this.survey.surveyDetailList[i].question_cat;
                      this.categoryNumber = this.survey.surveyDetailList[i].quest_catnum;
                      this.offlineSurvey.surveyDetailList.push(this.survey.surveyDetailList[i]);
                    }
                  }
                  else{
                    this.offlineSurvey.surveyDetailList.push(this.survey.surveyDetailList[i]);
                  }
                }
              }

              if (this.survey.display_type !== 'CATEGORY') {
                this.showCompleteButton = true;
              }
              else {
                this.showCompleteButton = false;
              }

              this.setOfflineProgress();

            })
            .catch(e => console.log(e));

        }).catch(e => console.log(e));
      }
      else {
        this.service.getSurvey(surveyId, 'NEW').subscribe(data => {
            this.survey = data;

            if (this.survey.surveyDetailList.length > 0) {
              this.categoryName = this.survey.surveyDetailList[0].question_cat;
            }

            if (this.survey.display_type !== 'CATEGORY') {
              this.showCompleteButton = true;
            }
            else {
              this.showCompleteButton = false;
            }

          },
          err => {
            return console.error(err.message);
          });
      }

      this.survey.company_cd = this.global.company_code;
      this.survey.location_cd = this.global.location.toUpperCase();
      this.survey.survey_stat = 'H';
      this.survey.inspct_by = this.global.fullname;
      this.survey.inspct_byid = this.global.username;
      this.survey.inspct_eml = this.global.email;
      this.survey.inspct_ph1 = this.global.phone;
      this.survey.entry_by = this.global.username;
      this.survey.modify_by = this.global.username;
      this.survey.inspct_date = new Date(this.getNowTimestamp()).getUTCDate();
      console.log('setting survey date to ' + this.survey.inspct_date);

    }

  }

  getPicture(event, row){

    console.log('in getPicture(event, row)...');

    this.camera.getPicture({
      sourceType: this.camera.PictureSourceType.CAMERA,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
      //      targetWidth: 1000,
      //      targetHeight: 1000
    }).then((imageData) => {
      // imageData is a base64 encoded string
      const filename = 'img-' + (row.surveyImageList.length + 1) + '.jpeg';
      const surveyImage = new SurveyImage();
      surveyImage.base64 = imageData;
      surveyImage.image_name = filename;
      surveyImage.survey_resp_detail_id = row.survey_resp_detail_id;
      surveyImage.survey_resp_id = row.survey_resp_id;
      surveyImage.entry_by = this.global.username;
      surveyImage.modify_by = this.global.username;
      row.surveyImageList[row.surveyImageList.length] = surveyImage;
      console.log('captured image....');
    }, (err) => {
      console.log(err);
    });
  }

  private addRestriction(id: string): void {
    let isFound = false;

    for(let i = 0; i < this.global.restrictList.length; i++){
      if(this.global.restrictList[i] === id) {
        isFound = true;
      }
    }
    if(isFound === false) {
      this.global.restrictList.push(id);
    }
  }

  private sync() {

    if (!this.survey.inspct_date) {
      this.survey.inspct_date = new Date(this.getNowTimestamp()).getUTCDate();
    }

    for(let i = 0; i < this.offlineSurvey.surveyDetailList.length; i++){
      for(let j = 0; j < this.survey.surveyDetailList.length; j++){
        if(this.offlineSurvey.surveyDetailList[i].survey_detail_id == this.survey.surveyDetailList[j].survey_detail_id) {
          console.log('sync offline survey_detail_id => ' + this.offlineSurvey.surveyDetailList[i].survey_detail_id);
          this.survey.surveyDetailList[j] = this.offlineSurvey.surveyDetailList[i];
        }
      }
    }

    this.sqlite.create({
      name: 'field-user.db',
      location: 'default'
    }).then((db: SQLiteObject) => {

      console.log('creating local response table if not exists');
      db.executeSql('CREATE TABLE IF NOT EXISTS response(survey_id INTEGER PRIMARY KEY, response TEXT, restrictkey TEXT)', [])
        .then(res => console.log('created table => response'))
        .catch(e => console.log(e));

      console.log('deleting survey into response table');
      db.executeSql('DELETE FROM response WHERE survey_id = ?', [this.survey.survey_id])
        .then(res => console.log('deleted survey_id => ' + this.survey.survey_id))
        .catch(e => console.log(e));

      console.log('inserting survey into response table');
      db.executeSql('INSERT INTO response VALUES (?,?,?)', [this.survey.survey_id, JSON.stringify(this.survey), (this.survey.location_cd + ':' + this.survey.survey_id + ':' + this.survey.period)])
        .then(res => console.log('inserted survey_id => ' + this.survey.survey_id))
        .catch(e => console.log(e));

      this.addRestriction(this.global.location + ':' + this.survey.survey_id + ':' + this.survey.period);

      if (this.survey.display_type === 'CATEGORY') {

        this.setOfflineProgress();

        this.offlineSurvey.surveyDetailList = [];
        for (let i = 0; i < this.survey.surveyDetailList.length; i++) {
          //console.log('comparing ' + this.survey.surveyDetailList[i].quest_catnum + ' to ' + this.categoryNumber)
          if (this.survey.surveyDetailList[i].quest_catnum == this.categoryNumber) {
            this.offlineSurvey.surveyDetailList.push(this.survey.surveyDetailList[i]);
          }
        }

        this.categoryName = this.offlineSurvey.surveyDetailList[0].question_cat;
        this.categoryNumber = this.offlineSurvey.surveyDetailList[0].quest_catnum;

      }

      this.pageTop.scrollToTop();

    }).catch(e => console.log(e));
  }

  private removeOffline(id: string): void {

    this.sqlite.create({
      name: 'field-user.db',
      location: 'default'
    }).then((db: SQLiteObject) => {

      console.log('creating local response table if not exists');
      db.executeSql('CREATE TABLE IF NOT EXISTS response(survey_id INTEGER PRIMARY KEY, response TEXT, restrictkey TEXT)', [])
        .then(res => console.log('created table => response'))
        .catch(e => console.log(e));

      console.log('deleting survey from response table');
      db.executeSql('DELETE FROM response WHERE survey_id = ?', [id])
        .then(res => console.log('removed survey_id from local db => ' + id))
        .catch(e => console.log(e));

    }).catch(e => console.log(e));

  }

  private setOfflineProgress() {

    if(!this.survey.progress.goTo) {
      this.survey.progress.goTo = '0';
    }

    // Reset Progress information
    let goTo = parseInt(this.survey.progress.goTo);
    let total = this.survey.categoryList.length;

    let percent = ((goTo + 1) / total) * 100 ;
    percent = Math.round(percent);

    if(percent < 10) {
      percent  = 10;
    }

    this.survey.progress.percentComplete = percent.toString() + '%';

    this.survey.progress.minStep = '1';
    this.survey.progress.maxStep = total.toString();
    this.survey.progress.currentStep = (goTo + 1).toString();
    this.survey.progress.currentId = goTo.toString();
    this.survey.progress.previousId = (goTo - 1).toString();
    this.survey.progress.label = 'Step ' + (goTo + 1).toString() + ' of ' + total.toString();

    if ((goTo + 1) == total) {
      this.survey.progress.nextId = 'COMPLETE';
    } else {
      this.survey.progress.nextId = (goTo + 1).toString();
    }

    console.log('**************************************************');
    console.log('**************** Offline Progress ****************');
    console.log('**************************************************');
    console.log('survey.progress.percentComplete => ' + this.survey.progress.percentComplete);
    console.log('survey.progress.minStep => ' + this.survey.progress.minStep);
    console.log('survey.progress.maxStep => ' + this.survey.progress.maxStep);
    console.log('survey.progress.currentStep => ' + this.survey.progress.currentStep);
    console.log('survey.progress.currentId => ' + this.survey.progress.currentId);
    console.log('survey.progress.previousId => ' + this.survey.progress.previousId);
    console.log('survey.progress.label => ' + this.survey.progress.label);
    console.log('survey.progress.nextId => ' + this.survey.progress.nextId);
  }

  onSave() {

    if (this.isOfflineMode) {

      console.log('*** in offline mode ***');
      console.log('onSave() called');

      this.sync();

      this.saveMsg = 'AUDIT SUCCESSFULLY SAVED AT ' + this.getNowTimestamp();

    }
    else {

      this.sync();

      this.service.postSurvey(this.survey).subscribe(data => {

          this.saveMsg = 'AUDIT SUCCESSFULLY SAVED AT ' + this.getNowTimestamp();

          this.survey = data;

          this.global.surveyId = this.survey.survey_id.toString();

          if (this.survey.surveyDetailList.length > 0) {
            this.categoryName = this.survey.surveyDetailList[0].question_cat;
          }},
        err => {
          return console.error(err.message);
        });

    }

  }

  onMultiStep(clicked: string) {

    if (this.isOfflineMode && this.validate() === true) {

      console.log('*** in offline mode ***');
      console.log('sync answers....');
      this.sync();

      let ignoreComplete: boolean = false;
      try {

        if (this.survey.survey_stat === null) {
          this.survey.survey_stat = 'H';
        }

        if (clicked === 'PREVIOUS') {
          this.survey.progress.goTo = this.survey.progress.previousId;
          ignoreComplete = true;
        } else {
          this.survey.progress.goTo = this.survey.progress.nextId;
        }

        let isComplete = false;
        if (!ignoreComplete && this.survey.progress.nextId === 'COMPLETE') {
          isComplete = true;
          if (this.survey.survey_stat === null || this.survey.survey_stat === 'H') {

            if(this.survey.company_cd === 'KTI') {
              this.survey.survey_stat = 'F';
            }
            else {
              this.survey.survey_stat = 'O';
            }
          }
        }

        if (!ignoreComplete && isComplete) {
          if (this.global.networkStatus === 'ONLINE') {
            this.service.postSurvey(this.survey).subscribe(data => {
              this.survey = data;

              this.global.surveyId = this.survey.survey_id.toString();

              if(this.survey.msg === 'SUCCESS') {
                this.removeOffline(this.survey.survey_id.toString());
              }

              },
                err => {
              return console.error(err.message);
            });

            }

            this.navCtrl.setRoot('HomePage');
          }
          else {

            this.setOfflineProgress();

            this.offlineSurvey.surveyDetailList = [];
            for (let i = 0; i < this.survey.surveyDetailList.length; i++) {
              //console.log('comparing ' + this.survey.surveyDetailList[i].quest_catnum + ' to ' + this.categoryNumber)
              if (this.survey.surveyDetailList[i].quest_catnum == parseInt(this.survey.progress.goTo)) {
                this.offlineSurvey.surveyDetailList.push(this.survey.surveyDetailList[i]);
              }
            }

            this.categoryName = this.offlineSurvey.surveyDetailList[0].question_cat;
            this.categoryNumber = this.offlineSurvey.surveyDetailList[0].quest_catnum;

            this.window.document.getElementById('progress').scrollIntoView();
          }

      }
      catch (e) {
      }
    }
    else if (!this.isOfflineMode && this.validate() === true) {

      console.log('submitting answers....');

      try {

        if (this.survey.survey_stat === null) {
          this.survey.survey_stat = 'H';
        }

        if (!this.survey.inspct_date) {
          this.survey.inspct_date = new Date(this.getNowTimestamp()).getUTCDate();
        }

        if (clicked === 'PREVIOUS') {
          this.survey.progress.goTo = this.survey.progress.previousId;
        }
        else {
          this.survey.progress.goTo = this.survey.progress.nextId;
        }

        let isComplete = false;
        if (this.survey.progress.nextId === 'COMPLETE') {
          isComplete = true;
          if (this.survey.survey_stat === null || this.survey.survey_stat === 'H') {
            if(this.survey.company_cd === 'KTI') {
              this.survey.survey_stat = 'F';
            }
            else {
              this.survey.survey_stat = 'O';
            }
          }
        }

        this.service.postSurvey(this.survey).subscribe(data => {
          this.survey = data;

          this.global.surveyId = this.survey.survey_id.toString();

          if (this.survey.surveyDetailList.length > 0) {
            this.categoryName = this.survey.surveyDetailList[0].question_cat;
          }},
            err => {
          return console.error(err.message);
        });

        if (isComplete) {
          this.navCtrl.setRoot('HomePage');
        }
        else {
          this.window.document.getElementById('progress').scrollIntoView();
        }

      }
      catch (e) {
      }
    }
    else {
      //this.window.document.getElementById('validation').scrollIntoView();
      this.pageTop.scrollToTop();
    }
  }



  onComplete() {

    this.sync();

    if (this.isOfflineMode && this.validate() === true) {

      this.disableButton = true;

      if(this.survey.company_cd === 'KTI') {
        this.survey.survey_stat = 'F';
      }
      else {
        this.survey.survey_stat = 'O';
      }

      if(!this.survey.inspct_date) {
        this.survey.inspct_date = new Date(this.getNowTimestamp()).getUTCDate();
      }

      if(this.global.networkStatus === 'ONLINE') {

        this.service.postSurvey(this.survey).subscribe(data => {
            this.survey = data;

            this.global.surveyId = this.survey.survey_id.toString();

            if(this.survey.msg === 'SUCCESS') {
              this.removeOffline(this.survey.survey_id.toString());
            }

            this.navCtrl.setRoot('HomePage');
          },
          err => {
            return console.error(err.message);
          });

      }
    }
    else if (!this.isOfflineMode && this.validate() === true) {

      console.log('submitting answers....');

      this.disableButton = true;

      try {

        this.service.postSurvey(this.survey).subscribe(data => {

            this.survey = data;

            this.global.surveyId = this.survey.survey_id.toString();

            if(this.survey.msg === 'SUCCESS') {
              this.removeOffline(this.survey.survey_id.toString());
            }

            this.navCtrl.setRoot('HomePage');

          },
          err => {
            return console.error(err.message);
          });

      }
      catch (e) {
      }

    }
    else {
      this.pageTop.scrollToTop();
    }
  }

  onSubmit() {

  }

  validate(): boolean {

    console.log('validating form...');

    let isValid = true;
    this.validationMsg = [];
    let index = this.validationMsg.length;

    console.log('validating inspct_by');
    if (!this.survey.inspct_by || this.survey.inspct_by.length === 0) {
      this.validationMsg[index] = 'Inspected By is a required field.';
      isValid = false;
      index = index + 1;
    }

    /*
    console.log('validating inspectDate');
    if (!this.survey.inspct_date) {
      this.validationMsg[index] = 'Inspection Date is a required field.';
      isValid = false;
      index = index + 1;

    }
    */

    if(this.isOfflineMode){

      for (let i = 0; i < this.offlineSurvey.surveyDetailList.length; i++) {
        const detail = this.offlineSurvey.surveyDetailList[i];


        if (!detail.quest_answer) {
          console.log('setting answer to blank');
          detail.quest_answer = '';
        }

        console.log('validating question # ' + detail.question_no);
        console.log('question required => ' + detail.quest_reqrd);
        console.log('question answer => ' + detail.quest_answer);
        console.log('comment required => ' + detail.qst_com_req);
        console.log('comment => ' + detail.quest_commnt);


        if (detail.quest_reqrd === 'Y' && (!detail.quest_answer || detail.quest_answer.length === 0)) {
          this.validationMsg[index] = detail.question_cat + ': Question #' + detail.question_no + ' requires a response';
          isValid = false;
          index = index + 1;
        }

        if (detail.qst_com_req === 'Y' && (!detail.quest_commnt || detail.quest_commnt.length === 0)) {
          this.validationMsg[index] = detail.question_cat + ': Question #' + detail.question_no + ' requires a comment';
          isValid = false;
          index = index + 1;
        }
      }
    }
    else {

      for (let i = 0; i < this.survey.surveyDetailList.length; i++) {
        const detail = this.survey.surveyDetailList[i];


        if (!detail.quest_answer) {
          console.log('setting answer to blank');
          detail.quest_answer = '';
        }

        console.log('validating question # ' + detail.question_no);
        console.log('question required => ' + detail.quest_reqrd);
        console.log('question answer => ' + detail.quest_answer);
        console.log('comment required => ' + detail.qst_com_req);
        console.log('comment => ' + detail.quest_commnt);


        if (detail.quest_reqrd === 'Y' && (!detail.quest_answer || detail.quest_answer.length === 0)) {
          this.validationMsg[index] = detail.question_cat + ': Question #' + detail.question_no + ' requires a response';
          isValid = false;
          index = index + 1;
        }

        if (detail.qst_com_req === 'Y' && (!detail.quest_commnt || detail.quest_commnt.length === 0)) {
          this.validationMsg[index] = detail.question_cat + ': Question #' + detail.question_no + ' requires a comment';
          isValid = false;
          index = index + 1;
        }
      }
    }

    return isValid;
  }

  convertLocalDateToUTCDate(date, toUTC) {
    date = new Date(date);
    // Local time converted to UTC
    const localOffset = date.getTimezoneOffset() * 60000;
    const localTime = date.getTime();
    if (toUTC) {
      date = localTime + localOffset;
    } else {
      date = localTime - localOffset;
    }
    date = new Date(date);
    return date;
  }

  getNowDate() {

    //get datetime now
    const today = this.convertLocalDateToUTCDate(new Date(),false);
    //split
    let dd = today.getUTCDate().toString();
    let mm = (today.getUTCMonth() + 1).toString();
    const yyyy = today.getUTCFullYear().toString();

    if (dd.length === 1) {
      dd = '0' + dd;
    }
    if (mm.length === 1) {
      mm = '0' + mm;
    }

    return yyyy + '-' + mm + '-' +  dd;
  }

  getNowTimestamp() {

    // get datetime now
    const today = this.convertLocalDateToUTCDate(new Date(), false);
    // split
    let dd = today.getUTCDate().toString();
    let mm = (today.getUTCMonth() + 1).toString();
    const yyyy = today.getUTCFullYear().toString();

    let hh = today.getUTCHours().toString();
    let MM = today.getUTCMinutes().toString();
    let ss = today.getUTCSeconds().toString();


    if (dd.length === 1) {
      dd = '0' + dd;
    }
    if (mm.length === 1) {
      mm = '0' + mm;
    }
    if (hh.length === 1) {
      hh = '0' + hh;
    }
    if (MM.length === 1) {
      MM = '0' + MM;
    }
    if (ss.length === 1) {
      ss = '0' + ss;
    }

    //console.log('NOW => ' + yyyy + '-' + mm + '-' +  dd + ' ' + hh + ':' + MM + ':' + ss );
    return yyyy + '-' + mm + '-' +  dd + ' ' + hh + ':' + MM + ':' + ss;

  }

  displayNow() {

    // get datetime now
    const today = this.convertLocalDateToUTCDate(new Date(), false);
    // split
    let dd = today.getUTCDate().toString();
    let mm = (today.getUTCMonth() + 1).toString();
    const yyyy = today.getUTCFullYear().toString();

    let hh = today.getUTCHours().toString();
    let MM = today.getUTCMinutes().toString();
    let ss = today.getUTCSeconds().toString();


    if (dd.length === 1) {
      dd = '0' + dd;
    }
    if (mm.length === 1) {
      mm = '0' + mm;
    }
    if (hh.length === 1) {
      hh = '0' + hh;
    }
    if (MM.length === 1) {
      MM = '0' + MM;
    }
    if (ss.length === 1) {
      ss = '0' + ss;
    }

    //console.log('NOW => ' + yyyy + '-' + mm + '-' +  dd + ' ' + hh + ':' + MM + ':' + ss );
    return mm + '/' + dd + '/' + yyyy;

  }

  displayDate(date) {
    const d = date.split('-');
    return d[1] + '/' + d[2] + '/' + d[0];
  }

  time2String(time) {

    if (!time) {
      return '';
    }
    const d = new Date();

    d.setTime(time);

    let dd = d.getUTCDate().toString();
    let mm = (d.getUTCMonth() + 1).toString();
    const yyyy = d.getUTCFullYear().toString();

    if (dd.length === 1) {
      dd = '0' + dd;
    }
    if (mm.length === 1) {
      mm = '0' + mm;
    }

    return mm + '/' + dd + '/' +  yyyy;
  }

  time2StringForInput(time) {

    if (!time) {
      return '';
    }
    const d = new Date();

    d.setTime(time);

    let dd = d.getUTCDate().toString();
    let mm = (d.getUTCMonth() + 1).toString();
    const yyyy = d.getUTCFullYear().toString();

    if (dd.length === 1) {
      dd = '0' + dd;
    }
    if (mm.length === 1) {
      mm = '0' + mm;
    }

    return yyyy + '-' + mm + '-' +  dd;
  }

}

import { Injectable } from '@angular/core';
import {Platform} from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Template } from '../../model/template';

@Injectable()
export class Global {

  public networkStatus:string = 'ONLINE';

  public currentView: string = '';
  public username: string;
  public fullname: string;
  public jobTitle: string;
  public email: string;
  public phone: string;
  public surveyId = '-1';
  public survey_stat  = 'H';
  public company_code: string;
  public location: string;
  public period: string;
  public print_url: string;
  public token: string;

  public month: string;
  public year: string;
  public quarter: string;

  public restrictList: string[] = new Array();

  constructor(public platform : Platform, public sqlite: SQLite) {
  }

  getOfflineRestrictList(): string[] {

    let restrictList: string[] = [];
    // let index = this.restrictList.length;

    this.sqlite.create({
      name: 'field-user.db',
      location: 'default'
    }).then((db: SQLiteObject) => {

      db.executeSql('SELECT restrictKey FROM response', [])
        .then(res => {

          if (res.rows.length > 0) {

            for(let i = 0; i < res.rows.length(); i++) {
              restrictList[i] = res.rows.item(i).restrictKey;
            }

          }

        })
        .catch(e => console.log(e));
    }).catch(e => console.log(e));

    return restrictList;

  }

  updateTables() {

    this.sqlite.create({
      name: 'field-user.db',
      location: 'default'
    }).then((db: SQLiteObject) => {

      db.executeSql('ALTER TABLE response ADD COLUMN restrictkey text;', [])
        .then(res => console.log('added column => restrictKey'))
        .catch(e => console.log(e));

    })
      .catch(e => console.log(e));

  }

  removeTemplates() {

    this.sqlite.create({
      name: 'field-user.db',
      location: 'default'
    }).then((db: SQLiteObject) => {

      db.executeSql('DELETE FROM template', [])
        .then(res => console.log('removed templates'))
        .catch(e => console.log(e));

      })
      .catch(e => console.log(e));
  }

  updateTemplates(templates: Template) {

    for(let i = 0; i < templates.surveyList.length; i++) {

      let isDelete: boolean = false;
      let isInsert: boolean = false;

      this.sqlite.create({
        name: 'field-user.db',
        location: 'default'
      }).then((db: SQLiteObject) => {

        if(templates.surveyList[i].survey_id === -1) {
          db.executeSql('DELETE FROM template WHERE survey_id = ?', [templates.surveyList[i].survey_id])
            .then(res => console.log('delete survey_id => ' + templates.surveyList[i].survey_id))
            .catch(e => console.log(e));

          db.executeSql('INSERT INTO template VALUES (?,?,?)', [templates.surveyList[i].survey_id, JSON.stringify(templates.surveyList[i]), templates.surveyList[i].version])
            .then(res => console.log('insert survey_id => ' + templates.surveyList[i].survey_id))
            .catch(e => console.log(e));

        }
        else {
          db.executeSql('CREATE TABLE IF NOT EXISTS template(survey_id INTEGER PRIMARY KEY, template TEXT, version INTEGER)', [])
            .then(res => console.log('created table => template'))
            .catch(e => console.log(e));

          db.executeSql('SELECT version FROM template WHERE survey_id = ?', [templates.surveyList[i].survey_id])
            .then(res => {

              if (res.rows.length > 0) {
                const version = parseInt(res.rows.item(0).version);
                if (version > templates.surveyList[i].version) {
                  isDelete = true;
                  isInsert = true;
                }
              }
              else {
                isInsert = true;
              }

              if (isDelete) {
                db.executeSql('DELETE FROM template WHERE survey_id = ?', [templates.surveyList[i].survey_id])
                  .then(res => console.log('delete survey_id => ' + templates.surveyList[i].survey_id))
                  .catch(e => console.log(e));
              }

              if (isInsert) {
                db.executeSql('INSERT INTO template VALUES (?,?,?)', [templates.surveyList[i].survey_id, JSON.stringify(templates.surveyList[i]), templates.surveyList[i].version])
                  .then(res => console.log('insert survey_id => ' + templates.surveyList[i].survey_id))
                  .catch(e => console.log(e));
              }

            })
            .catch(e => console.log(e));
        }
      }).catch(e => console.log(e));
    }

  }


  print() {
    console.log('================ PRINT GLOBAL VARIABLES ================');
    console.log('currentView => ' + this.currentView);
    console.log('username => '    + this.username);
    console.log('fullname => '    + this.fullname);
    console.log('jobTitle => '    + this.jobTitle);
    console.log('email => '       + this.email);
    console.log('phone => '       + this.phone);
    console.log('surveyId => '    + this.surveyId);
    console.log('surveyStat => '  + this.survey_stat);
    console.log('companyCode => ' + this.company_code);
    console.log('location => '    + this.location);
    console.log('period => '      + this.period);
    console.log('quarter => '     + this.quarter);
    console.log('year => '        + this.year);
    console.log('month => '       + this.month);
    console.log('printURL => '    + this.print_url);
    console.log('token => '       + this.token);
    for(let i = 0; i < this.restrictList.length; i++ ){
      console.log('restrict => '  + this.restrictList[i]);
    }
  }

  setPeriodInfo() {

    const today = new Date();

    //let dd = today.getUTCDate().toString();
    this.month = (today.getUTCMonth() + 1).toString();
    this.year = today.getUTCFullYear().toString();

    if(this.month.length === 1){
      this.month = '0' + this.month;
    }

    if(this.period === 'FISCAL'){
      if(this.month === '10' || this.month === '11' || this.month === '12' ){
        this.quarter = '1';
        this.year    = (today.getUTCFullYear() + 1).toString();
      }
      else if(this.month === '01' || this.month === '02' || this.month === '03' ){
        this.quarter = '2';
      }
      else if(this.month === '04' || this.month === '05' || this.month === '06' ){
        this.quarter = '3';
      }
      else{
        this.quarter = '4';
      }
    }
    else{
      if(this.month === '01' || this.month === '02' || this.month === '03' ){
        this.quarter = '1';
      }
      else if(this.month === '04' || this.month === '05' || this.month === '06' ){
        this.quarter = '2';
      }
      else if(this.month === '07' || this.month === '08' || this.month === '09' ){
        this.quarter = '3';
      }
      else{
        this.quarter = '4';
      }
    }

  }

  isLinkEnabled() {
    if (!this.surveyId && this.surveyId !== '-1' && this.survey_stat !== 'H') {
      return true;
    }
    return false;
  }

  isLoggedIn() {
    if (this.username && this.username.length > 0) {
      return true;
    }
    return false;
  }

  getSplitPane() {
    if(this.currentView === 'Login'){
      return false;
    }
    return true;
  }


}

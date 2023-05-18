import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs/internal/Observable';
import { environment }  from '@app/env';
import { Search } from '../../model/search';
import { Survey} from '../../model/survey';
import { User } from '../../model/user';
import {Intake} from '../../model/intake';
import {Template} from "../../model/template";
/*
  Generated class for the RestServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

const WS_URL = environment.WSUrl;

@Injectable()
export class RestService {

  constructor(public http: HttpClient) {
    console.log('Hello RestService');
  }

  // API: POST /login
  public login(user: User): Observable<User> {
    return this.http.post<User>(WS_URL + 'login', user);
  }

  // API: GET /templates
  public getTemplates(location: string): Observable<Template> {
    return this.http.get<Template>(WS_URL + 'templates?location=' + location);
  }

  // API: POST /search
  public search(search: Search): Observable<Search> {
    return this.http.post<Search>(WS_URL + 'search', search);
  }

  // API: POST /
  public getInProgress(search: Search): Observable<Search> {
    return this.http.post<Search>(WS_URL + 'inProgressList', search);
  }

  // API: GET /questions
  public getSurvey(id: string, val: string): Observable<Survey> {
    console.log("get survey from url => " + WS_URL + 'survey?id=' + id + '&val=' + val);
    return this.http.get<Survey>(WS_URL + 'survey?id=' + id + '&val=' + val);
  }

  // API: POST /response
  public postSurvey(survey: Survey): Observable<Survey> {
    return this.http.post<Survey>(WS_URL + 'survey', survey);
  }

  // API: POST /intake
  public postIntake(intake: Intake): Observable<Intake> {
    return this.http.post<Intake>(WS_URL + 'intake', intake);
  }

  // API: GET (external servlet call to WebFOCUS)
  public print(url: string):  Observable<Response>  {
    console.log("get survey from url => " + url);
    return this.http.get<Response>(url);
  }

}

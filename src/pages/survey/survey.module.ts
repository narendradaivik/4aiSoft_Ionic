import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SurveyPage } from './survey';
import {NgxDatatableModule} from "@swimlane/ngx-datatable";

@NgModule({
  declarations: [
    SurveyPage,
  ],
  imports: [
    NgxDatatableModule,
    IonicPageModule.forChild(SurveyPage),
  ],
})
export class SurveyPageModule {
}

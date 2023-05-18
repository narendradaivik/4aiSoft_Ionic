import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IllnessLogPage } from './illness-log';

@NgModule({
  declarations: [
    IllnessLogPage,
  ],
  imports: [
    IonicPageModule.forChild(IllnessLogPage),
  ],
})
export class IllnessLogPageModule {}

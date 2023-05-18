import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RestrictionsPage } from './restrictions';

@NgModule({
  declarations: [
    RestrictionsPage,
  ],
  imports: [
    IonicPageModule.forChild(RestrictionsPage),
  ],
})
export class RestrictionsPageModule {}

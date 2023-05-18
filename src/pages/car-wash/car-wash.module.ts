import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CarWashPage } from './car-wash';

@NgModule({
  declarations: [
    CarWashPage,
  ],
  imports: [
    IonicPageModule.forChild(CarWashPage),
  ],
})
export class CarWashPageModule {}

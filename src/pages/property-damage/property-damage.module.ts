import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PropertyDamagePage } from './property-damage';

@NgModule({
  declarations: [
    PropertyDamagePage,
  ],
  imports: [
    IonicPageModule.forChild(PropertyDamagePage),
  ],
})
export class PropertyDamagePageModule {}

import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { MyApp } from './app.component';
import { Global } from '../providers/global/global';
import { RestService } from '../providers/rest-service/rest-service';
import {HttpClientModule} from '@angular/common/http';
import { ImagePopupPage } from '../pages/image-popup/image-popup';
import { InfoPopupPage } from '../pages/info-popup/info-popup';
import { SQLite } from '@ionic-native/sqlite';
import { Camera } from '@ionic-native/camera';
import { Network } from '@ionic-native/network';
import { NetworkProvider } from '../providers/network/network';


class CameraMock extends Camera {
  getPicture(options) {
    return new Promise((resolve, reject) => {
      resolve("BASE_64_ENCODED_DATA_GOES_HERE");
    })
  }
}

@NgModule({
  declarations: [
    MyApp,
    InfoPopupPage,
    ImagePopupPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgxDatatableModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    InfoPopupPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    { provide: Camera, useClass: CameraMock },
    SQLite,
    Global,
    Camera,
    Network,
    RestService,
    NetworkProvider
  ]
})
export class AppModule {}

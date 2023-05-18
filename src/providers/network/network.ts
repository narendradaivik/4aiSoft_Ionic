import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController, Events } from 'ionic-angular';
import { Network } from '@ionic-native/network';
/*
  Generated class for the NetworkProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

export enum ConnectionStatus {
  ONLINE,
  OFFLINE
}

@Injectable()
export class NetworkProvider {

  previousStatus;

  constructor(public http: HttpClient,
              public alertCtrl: AlertController,
              public network: Network,
              public eventCtrl: Events) {

    console.log('Hello NetworkProvider Provider');
    this.previousStatus = ConnectionStatus.ONLINE;

  }

  public initializeNetworkEvents(): void {

    this.network.onDisconnect().subscribe(() => {
      if (this.previousStatus === ConnectionStatus.ONLINE) {
        this.eventCtrl.publish('network:offline');
      }
      this.previousStatus = ConnectionStatus.OFFLINE;
    });

    this.network.onConnect().subscribe(() => {
      setTimeout(() => {
        if (this.previousStatus === ConnectionStatus.OFFLINE) {
          this.eventCtrl.publish('network:online');
        }
        this.previousStatus = ConnectionStatus.ONLINE;
      }, 3000);
    });

  }

  public getNetworkType(): string {
    return this.network.type;
  }


}

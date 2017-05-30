import { Component } from '@angular/core';
import { LocationTracker } from '../../providers/location-tracker';

import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  styles: [`
  .title{
    text-align:center;
  }
  .bluelabel{
    color:blue;
    text-align :left;
  }
  `]

})
export class HomePage {

  constructor(public navCtrl: NavController, public locationTracker: LocationTracker) {

  }

  start() {
    this.locationTracker.startTracking();
  }

  stop() {
    this.locationTracker.stopTracking();
  }

}

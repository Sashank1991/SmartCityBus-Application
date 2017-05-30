import { Component } from '@angular/core';
import { LocationTracker } from '../../providers/location-tracker';
import { NavController } from 'ionic-angular';
export var HomePage = (function () {
    function HomePage(navCtrl, locationTracker) {
        this.navCtrl = navCtrl;
        this.locationTracker = locationTracker;
    }
    HomePage.prototype.start = function () {
        this.locationTracker.startTracking();
    };
    HomePage.prototype.stop = function () {
        this.locationTracker.stopTracking();
    };
    HomePage.decorators = [
        { type: Component, args: [{
                    selector: 'page-home',
                    templateUrl: 'home.html',
                    styles: ["\n  .title{\n    text-align:center;\n  }\n  .bluelabel{\n    color:blue;\n    text-align :left;\n  }\n  "]
                },] },
    ];
    /** @nocollapse */
    HomePage.ctorParameters = [
        { type: NavController, },
        { type: LocationTracker, },
    ];
    return HomePage;
}());
//# sourceMappingURL=home.js.map
import { Injectable, NgZone } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Geolocation, BackgroundGeolocation } from 'ionic-native';
import 'rxjs/add/operator/filter';
export var LocationTracker = (function () {
    function LocationTracker(zone, http) {
        this.zone = zone;
        this.http = http;
        this.lat = 0;
        this.lng = 0;
        this.txtTrip = 0;
        this.url = 'http://10.0.0.180:3000/locations';
        this.serverRes = "";
    }
    LocationTracker.prototype.startTracking = function () {
        var _this = this;
        /**
    * This callback will be executed every time a geolocation is recorded in the background.
    */
        var callbackFn = function (location) {
            var _this = this;
            console.log('[js] BackgroundGeolocation callback:  ' + location.latitude + ',' + location.longitude);
            var savCords = {
                "lat": location.latitude,
                "long": location.longitude,
                "trip": this.txtTrip
            };
            this.http.post(this.url, JSON.stringify(savCords)).map(function (res) { return res.json(); }).subscribe(function (data) { return _this.serverRes = data.data; });
            // Do your HTTP request here to POST location to your server. 
            // jQuery.post(url, JSON.stringify(location)); 
            /*
            IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
            and the background-task may be completed.  You must do this regardless if your HTTP request is successful or not.
            IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
            */
            BackgroundGeolocation.finish();
        };
        var failureFn = function (error) {
            console.log('BackgroundGeolocation error');
        };
        // BackgroundGeolocation is highly configurable. See platform specific configuration options 
        BackgroundGeolocation.configure(callbackFn, failureFn, {
            desiredAccuracy: 10,
            stationaryRadius: 20,
            distanceFilter: 30,
            interval: 2000
        });
        // Turn ON the background-geolocation system.  The user will be tracked whenever they suspend the app. 
        BackgroundGeolocation.start();
        // // If you wish to turn OFF background-tracking, call the #stop method. 
        // // backgroundGeolocation.stop(); 
        // // Background Tracking
        // let config = {
        //   desiredAccuracy: 0,
        //   stationaryRadius: 20,
        //   distanceFilter: 10,
        //   debug: true,
        //   interval: 2000,
        //   url: 'http://10.0.0.180:3000/locations'
        // };
        // BackgroundGeolocation.configure((location) => {
        //   console.log('BackgroundGeolocation:  ' + location.latitude + ',' + location.longitude);
        //   // var savCords = {
        //   //   "lat": location.latitude,
        //   //   "long": location.longitude,
        //   //   "trip": 123
        //   // };
        //   // this.http.post(this.url, JSON.stringify(savCords)).map(res => res.json()).subscribe(data => this.serverRes = data.data);
        //   // Run update inside of Angular's zone
        //   this.zone.run(() => {
        //     this.lat = location.latitude;
        //     this.lng = location.longitude;
        //   });
        // }, (err) => {
        //   console.log(err);
        // }, config);
        // // Turn ON the background-geolocation system.
        // BackgroundGeolocation.start();
        // Foreground Tracking
        var options = {
            frequency: 3000,
            enableHighAccuracy: true
        };
        this.watch = Geolocation.watchPosition(options).filter(function (p) { return p.code === undefined; }).subscribe(function (position) {
            var savCords = {
                "lat": position.coords.latitude,
                "long": position.coords.longitude,
                "trip": _this.txtTrip
            };
            _this.http.post(_this.url, JSON.stringify(savCords)).map(function (res) { return res.json(); }).subscribe(function (data) { return _this.serverRes = data.data; });
            // Run update inside of Angular's zone
            _this.zone.run(function () {
                console.log(position);
                _this.lat = position.coords.latitude;
                _this.lng = position.coords.longitude;
            });
        });
    };
    LocationTracker.prototype.stopTracking = function () {
        console.log('stopTracking');
        BackgroundGeolocation.finish();
        this.watch.unsubscribe();
    };
    LocationTracker.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    LocationTracker.ctorParameters = [
        { type: NgZone, },
        { type: Http, },
    ];
    return LocationTracker;
}());
//# sourceMappingURL=location-tracker.js.map
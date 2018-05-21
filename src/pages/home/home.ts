import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { MyCarsPage } from '../my-cars/my-cars';
import { MapPage } from '../map/map';
import { ConfigPage } from '../config/config';
import { NotificationPage } from '../notification/notification';

@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage {
	constructor(public navCtrl: NavController, public navParams: NavParams) { }

	goToMyCarsPage(){
		this.navCtrl.push(MyCarsPage);
	}

	goToMapPage(){
		this.navCtrl.push(MapPage);
	}

	goToConfigPage(){
		this.navCtrl.push(ConfigPage);
	}

	goToNotificationPage(){
		this.navCtrl.push(NotificationPage);
	}
}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Push } from '@ionic-native/push';

/**
 * Generated class for the NotificationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
})
export class NotificationPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private push: Push) {

	this.push.hasPermission().then((res: any) => {
		if (res.isEnabled) {
			alert('We have permission to send push notifications');
		} else {
			alert('We do not have permission to send push notifications');
		}
	});

  }

  ionViewDidLoad() {
    
  }

}

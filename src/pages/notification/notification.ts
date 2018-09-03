import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Push, PushObject, PushOptions } from '@ionic-native/push';

@IonicPage()
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
})
export class NotificationPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private push: Push) {

	const options: PushOptions = {
	   android: {
	       sound: 'true'
	   }
	};

	const pushObject: PushObject = this.push.init(options);

	pushObject.on('registration').subscribe((registration: any) => console.log(registration.registrationId));

	pushObject.on('notification').subscribe((notification: any) => console.log('Received a notification', notification.title));
  }

  ionViewDidLoad() {
    
  }

}

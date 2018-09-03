import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, LoadingController } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import { BackgroundMode } from '@ionic-native/background-mode';
import { Push, PushObject, PushOptions } from '@ionic-native/push';

import { LoginPage } from '../login/login';
import { MyCarsPage } from '../my-cars/my-cars';

/**
 * Generated class for the ConfigPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-config',
  templateUrl: 'config.html',
})
export class ConfigPage {

  constructor(	public navCtrl: NavController, 
  				public navParams: NavParams,
  				public appCtrl: App,
          public http: Http,
          public loadingCtrl: LoadingController,
          private backgroundMode: BackgroundMode,
          private push: Push) {
   
    
    const options: PushOptions = {
       android: {
           sound: 'true'
       }
    };

    const pushObject: PushObject = this.push.init(options);
    pushObject.on('notification').subscribe((notification: any) => {
      alert(notification.title);
    });
  }

  public username: any;
  public total_veiculos_cadastrados = 0;
  public total_veiculos_movimento = 0;
  public total_veiculos_desligados = 0;
  public veiculos: any;
  public notification = true;

  ionViewDidLoad() {
    this.total_veiculos_cadastrados = this.navParams.data.total_veiculos_cadastrados;
    this.total_veiculos_movimento = this.navParams.data.total_veiculos_movimento;
    this.total_veiculos_desligados = this.navParams.data.total_veiculos_desligados;

    this.username = localStorage.getItem('app.trackerbr.user.username');
  }

  goToMyCars(filter){
    this.veiculos = this.navParams.data.veiculos;
    let loader = this.loadingCtrl.create({
      content: "Aguarde!",
      duration: 500
    });

    loader.present();

    if (filter == 'lig')
      this.navCtrl.push(MyCarsPage, {'veiculos' : this.veiculos, 'filter': 'lig'});
    else
      this.navCtrl.push(MyCarsPage, {'veiculos' : this.veiculos, 'filter': 'des'});
  }

  logout(){
		this.appCtrl.getRootNav().setRoot(LoginPage);
    localStorage.removeItem('app.trackerbr.user.data');
    localStorage.removeItem('app.trackerbr.user.username');
    localStorage.removeItem('app.trackerbr.user.password');
    localStorage.removeItem('app.trackerbr.user.doLogin');
	}

  sender(){
    setInterval(()=> {
      var veiculos_verificacao = JSON.parse(localStorage.getItem('app.trackerbr.verification-cars'));
      if(veiculos_verificacao != null){
        for(let verificado of veiculos_verificacao){
          var token = JSON.parse(localStorage.getItem('app.trackerbr.user.data'));

          let headers = new Headers();
          headers.append('Authorization', token.token_type+" "+token.access_token);

          this.http.get('https://api.getrak.com/v0.1/localizacoes', {headers: headers}).subscribe(res => {
            if (res['_body']) {
              let veiculos = JSON.parse(res['_body']).veiculos;
              for(let veiculo of veiculos){
                if(verificado.id_veiculo == veiculo.id_veiculo && verificado.lig == 0 && veiculo.lig == 1 && verificado.enviada == 0){
                  this.http.get('http://192.168.15.23:8080/send/eg23SFy1N9E:APA91bGjU1mrTohxswmlHZgzADRAR4xlC8bhS8pPA4PnA7SbLxs5AcbYw0Pj409XVvTUSq89Rb-IeecWiGd0FQHQL6CD7j6zZ2nrTF5NnDlgWiOuH4Tue_DJAbjYpEWkzmTDuy28_JCT').subscribe(res => {}, (err) => {});
                  verificado.enviada = 1;
                }
                if(verificado.id_veiculo == veiculo.id_veiculo && veiculo.lig == 0){
                  verificado.enviada = 0;
                }
              }
              localStorage.setItem('app.trackerbr.verification-cars', JSON.stringify(veiculos_verificacao));
            }
          }, (err) => {});
        }
      }
    },10000);
  }
}

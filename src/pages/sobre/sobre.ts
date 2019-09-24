import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProvedorProvider } from '../../providers/provedor/provedor';
import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-sobre',
  templateUrl: 'sobre.html',
})
export class SobrePage {
  Fornecedor: Array<{}>;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public provedor: ProvedorProvider) {
                this.Fornecedor = [];
  }

  ionViewDidLoad() {
    if (localStorage.getItem('Fornecedor') !== null)
      this.Fornecedor = JSON.parse(localStorage.getItem('Fornecedor'));
    else
      this.navCtrl.setRoot(HomePage);
  }
}
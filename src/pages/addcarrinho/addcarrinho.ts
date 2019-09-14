import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { CarrinhoPage } from '../carrinho/carrinho';
import { ProvedorProvider } from '../../providers/provedor/provedor';

@Component({
  selector: 'page-list',
  templateUrl: 'addcarrinho.html'
})
export class AddcarrinhoPage {
  selectedItem: any;
  qtd_item: number;
  total: number;
  ingredientes: Array<{}>;
  obs: any;
  listPref: Array<{}>;
  checkItems: {};
  registrosBdLocal: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public provedor: ProvedorProvider,
    public toastCtrl: ToastController) {
    this.selectedItem = navParams.get('item');
    this.qtd_item = 1;
    this.total = this.selectedItem.valor_unitario;
    this.ingredientes = [];
    this.checkItems = {};
    this.registrosBdLocal = '';
    this.obs = '';
  }

  ionViewDidLoad() {
    this.registrosBdLocal = localStorage;
   
  }

  nro_item(id){
    var cont = 1;
    var max = parseInt ( localStorage.getItem('idItemMax') );
    for(var i = 0; i <= max; i++){
      var item = JSON.parse(localStorage.getItem('item' + i));
      if(item != null && item.id == id){
        cont++;
      }
    }
    return (cont);
  }

  addCarrinho() {
    this.selectedItem.ingredientes.forEach(ing => {
      ing.selecionado = false; //Limpa a variavel
      for (var i in this.checkItems) {//Percorre o array de itens checados
        if (this.checkItems[i] == true && ing.nome == i) {
          ing.selecionado = true
        }
      }
    });
    this.selectedItem.qtd = this.qtd_item;
    this.selectedItem.valor_total = this.total;
    this.selectedItem.nro_item = this.nro_item(this.selectedItem.id);
    this.selectedItem.obs = this.obs;
    //Seta o id maximo na primeira inserção no localStorage
    if(localStorage.length == 0 || localStorage.getItem('idItemMax') == 'NaN' || localStorage.getItem('idItemMax') == null){
      localStorage.setItem('idItemMax',''+0);  
    }
    this.selectedItem.chaveStorage = 'item' + localStorage.getItem('idItemMax');
    //converte o objeto em string e grava
    localStorage.setItem('item' +localStorage.getItem('idItemMax'), JSON.stringify(this.selectedItem));
    localStorage.setItem('idItemMax','' + ( parseInt( localStorage.getItem('idItemMax') ) +1 ) );
    this.provedor.aviso("Item adicionado ao carrinho!");
    this.navCtrl.pop(); 
  }

  addQtd() {
    this.qtd_item++;
    this.recalculaTotal();
  }
  subQtd() {
    if (this.qtd_item > 1) {
      this.qtd_item--;
      this.recalculaTotal();
    }
  }

  recalculaTotal() {
    this.total = parseFloat((this.selectedItem.valor_unitario * this.qtd_item).toFixed(2));
  }

  irCarrinho() {
    this.navCtrl.push(CarrinhoPage);
  }
}

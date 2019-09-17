import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';
import { ToastController, AlertController } from 'ionic-angular';
@Injectable()
export class ProvedorProvider {
  public url = "http://127.0.0.1/tele/public";
  //public url = "http://notavelsistemas.com/delivery/public";

  constructor(public http: Http,
    public toastCtrl: ToastController,
    public alertController: AlertController) {
  }

  criaConta(dados) {
    //console.log(dados);
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers, method: "post" });
    return this.http.post(this.url + "/cadastrarMobile", dados, options);
  }

  login(credential) {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers, method: "post" });
    return this.http.post(this.url + "/loginMobile", credential, options);
  }

  public resetar_senha(email) {
    console.log(email);
    return this.http.get(this.url + "/password_resets/" + email).timeout(15000);

  }

  public getDadosConta(id) {
    return this.http.get(this.url + "/dadosContaMobile/" + id).timeout(15000);
  }

  alterarDadosConta(dados) {
    //console.log(dados);
    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers, method: "post" });
    return this.http.post(this.url + "/alterarContaMobile", dados, options);
  }

  public getItens() {
    return this.http.get(this.url + "/itensMobile").timeout(15000);
  }

  public getFormaPgto(){
    return this.http.get(this.url + "/forma_pgto_mobile").timeout(15000);
  } 
  
  public getFornecedor(){
    return this.http.get(this.url + "/fornecedorMobile").timeout(15000);
  }

  public enviarPedido(car, forma_retirar, forma_pgto, troco_para, total, preco_tele) {
    let carrinho: string = JSON.stringify(car),
      type: 'application/json',
      headers: any = new Headers({ 'Content-Type': type }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.url + "/pedidos/gerar";
    return this.http.get(url + "?forma_retirar=" + forma_retirar + "&forma_pgto=" + forma_pgto + "&troco_para=" + troco_para +"&total="+total+"&preco_tele="+preco_tele+ "&cliente=" + localStorage.getItem('usuario') + "&" + "carrinho=" + carrinho);
  }

  //Verifica se há itens no carrinho
  carrinhoVazio() {
    var idMax = parseInt(localStorage.getItem("idItemMax"));
    var vazio = true;
    for (var i = 0; i <= idMax; i++) {
      if (localStorage.getItem("item" + i) != null) {
        vazio = false;
        break;
      }
    }
    return vazio;
  }

  esvaziaCarrinho() {
    var idMax = parseInt(localStorage.getItem("idItemMax"));
    for (var i = 0; i <= idMax; i++) {
      localStorage.removeItem("item" + i);
    }
  }

  aviso(msg) {
    const alert =  this.alertController.create({
      title: 'Aviso',
      message: msg,
      buttons: ['OK']
    });

    alert.present();
  }

}
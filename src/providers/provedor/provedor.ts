import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';
import { AlertController } from 'ionic-angular';

@Injectable()
export class ProvedorProvider {
  public url = "http://127.0.0.1/tele/public";
  //public url = "http://notavelsistemas.com/rodasuperdog/public";

  constructor(public http: Http,
    public alertController: AlertController) {
  }

  getTokenLocal(){
    return localStorage.getItem('token');
  }

  isUsuarioLogado() {
    if (this.getTokenLocal() !== null && this.getTokenLocal() !== '')
      return true;

    return false;
  }

  criaConta(dados) {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers, method: "post" });

    return this.http.post(this.url + "/cadastrarMobile", dados, options);
  }

  login(credential) {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers, method: "post" });

    return this.http.post(this.url + "/loginMobile", credential, options);
  }

  public resetar_senha(email) {    
    return this.http.get(this.url + "/password_resets/" + email).timeout(15000);
  }

  public getDadosConta() {
    let headers = new Headers({ 'Content-Type': 'application/json', 
                                'Authorization': 'Bearer ' + this.getTokenLocal() });
    let options = new RequestOptions({ headers: headers, method: "get" });

    return this.http.get(this.url + "/dadosContaMobile", options).timeout(15000);
  }

  alterarDadosConta(dados) {
    
    let headers = new Headers({ 'Content-Type': 'application/json', 
                                'Authorization': 'Bearer ' + this.getTokenLocal() });
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
      headers: any = new Headers({ 'Content-Type': 'application/json', 
                                   'Authorization': 'Bearer ' + this.getTokenLocal() }),
      options: any = new RequestOptions({ headers: headers }),
      url: any = this.url + "/pedidos/gerar";

    return this.http.get(url + "?forma_retirar=" + forma_retirar + "&forma_pgto=" + forma_pgto + "&troco_para=" + troco_para 
                           +"&total="+total+"&preco_tele="+preco_tele+ "&carrinho=" + carrinho, options);
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
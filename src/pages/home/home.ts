import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { ProvedorProvider } from '../../providers/provedor/provedor';
import { AddcarrinhoPage } from '../addcarrinho/addcarrinho';
import { CarrinhoPage } from '../carrinho/carrinho';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [
    ProvedorProvider
  ]
})

export class HomePage {
  selectedItem: any;
  itens: Array<{
    id: number, chaveStorage: string, nome: string,
    valor_unitario: number, qtd: number, valor_total: number, nro_item: number, categoria: string, obs: string
    ingredientes: Array<{ id: number, nome: string }>, imagem: string
  }>;
  registrosBdLocal: any;
  categorias: Array<{ nome: string }>;
  opcao: any;
  mostrar_aviso_horario: boolean;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public provedor: ProvedorProvider,
    public loadingController: LoadingController,
    public alertCtrl: AlertController) {
    this.selectedItem = navParams.get('item');
    this.itens = [];
    this.registrosBdLocal = '';
    this.categorias = [];
    this.mostrar_aviso_horario = true;
  }

  ionViewDidLoad() {
    this.registrosBdLocal = localStorage;
    this.opcao = 'cardapio';
    this.buscarItens();
    this.buscarFornecedor();
  }

  getItems(ev) {
    // Reset items back to all of the items
    this.buscarItens();
    // set val to the value of the ev target
    var val = ev.target.value;
    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.itens = this.itens.filter((item) => {
        return (item.nome.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  irAddcarrinho(item) {
    this.navCtrl.push(AddcarrinhoPage, {
      item: item
    });
  }

  irCarrinho() {
    this.navCtrl.push(CarrinhoPage);
  }

  public buscarFornecedor(){
    this.provedor.getFornecedor()
    .subscribe(
     data => {
       if ((data as any)._body !== '')
       {
          var dados = JSON.parse((data as any)._body);
         
          if(dados.msg_inicio_app != null && this.mostrar_aviso_horario){
            const alert = this.alertCtrl.create({
              title: dados.titulo_msg_inicio_app || 'Aviso',
              message: dados.msg_inicio_app,
              buttons: ['OK']
            });
            alert.present();
            this.mostrar_aviso_horario = false;
          }

          this.gravarFornecedorLocalStorage(dados);
        }
     }, error => {
        console.log(error);
     }     
    )
  }

  public gravarFornecedorLocalStorage(dados)
  {
    localStorage.setItem('Fornecedor', JSON.stringify(dados));
  }

  public buscarItens() {
    if (this.itens.length > 0)//Não busca itens caso os itens já estejam no array
      return false;
    const loading = this.loadingController.create({
      content: 'Obtendo cardápio...'
    });
    loading.present();
    this.provedor.getItens()
      .subscribe(
      data => {
        loading.dismiss();
        var dados = JSON.parse((data as any)._body);
        var ing: Array<{ id: number, nome: string, selecionado: boolean }>;
        dados.forEach(dado => {
          ing = [];
          dado.ingredientes.forEach(i => {
            ing.push({
              id: i.id,
              nome: i.nome,
              selecionado: false
            })
          });
          this.itens.push({
            id: dado.id,
            chaveStorage: '',
            nome: dado.nome,
            valor_unitario: dado.valor,
            nro_item: 0,
            qtd: 0,
            valor_total: 0,
            categoria: dado.categoria.nome,
            obs: '',
            ingredientes: ing,
            imagem: (dado.imagem != null) ? this.provedor.url + '/' + dado.imagem : ''
          });

          //Verifica se categoria já existe no array de categorias
          var existe = false;
          this.categorias.forEach(c => {
            if (c.nome == dado.categoria.nome)
              existe = true;
          });
          if (!existe) {
            this.categorias.push({ nome: dado.categoria.nome });
            existe = false;
          }

        });        
      },
      error => {
        loading.setContent("Ocorreu um erro ao carregar dados.");
        setTimeout(() => {
          loading.dismiss();
        }, 3000);
        console.log(error);
      }
      )
  } 
}
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { ProvedorProvider } from '../../providers/provedor/provedor';
import { CadastroPage } from '../cadastro/cadastro';

@IonicPage()
@Component({
  selector: 'page-carrinho',
  templateUrl: 'carrinho.html',
})
export class CarrinhoPage {
  private carrinho: Array<{}>;
  private total: number;
  private total_com_tele: number;
  private troco_para: number;
  private preco_tele: number;
  private forma_pgto: number;
  private forma_retirar: string;
  public Fornecedor: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public provedor: ProvedorProvider,
    public toastCtrl: ToastController,
    public loadingController: LoadingController) {
    this.carrinho   = [];
    this.total      = 0;
    this.Fornecedor = {};
  }

  ionViewDidLoad() {
    this.getCarrinho();
    this.obterDadosFornecedor();
  }

  irCarrinho() {
    this.navCtrl.push(CarrinhoPage);
  }

  removeItem(chave) {
    let confirm = this.alertCtrl.create({
      title: 'Confirmação',
      message: 'Remover item do carrinho?',
      buttons: [
        {
          text: 'Não',
          handler: () => { }
        },
        {
          text: 'Sim',
          handler: () => {
            localStorage.removeItem(chave);
            this.navCtrl.setRoot(this.navCtrl.getActive().component);
          }
        }
      ]
    });
    confirm.present();
  }

  getCarrinho() {
    for (var i = 0; i <= parseInt(localStorage.getItem('idItemMax')); i++) {
      if (localStorage.getItem('item' + i) != null) {
        this.total += JSON.parse(localStorage.getItem('item' + i)).valor_total;
        this.carrinho.push(
          JSON.parse(localStorage.getItem('item' + i))
        );
      }
    }
    this.total = parseFloat(this.total.toFixed(2));
    this.total_com_tele = this.total;
  }

  obterDadosFornecedor()
  {
    this.provedor.getFornecedor()
    .subscribe((data) => {
      if ((data as any)._body =! null && (data as any)._body != '')
      {
        var resposta = JSON.parse((data as any)._body);
        
        this.Fornecedor.endereco = resposta.endereco;
        this.Fornecedor.cidade   = resposta.cidade;
        this.Fornecedor.rua      = resposta.rua;
        this.Fornecedor.numero   = resposta.numero;
        this.Fornecedor.bairro   = resposta.bairro;
        this.Fornecedor.cep      = resposta.cep;
        this.Fornecedor.uf       = resposta.uf;
      }
    }, error => {
      this.provedor.aviso("Ocorreu um erro ao carregar dados do fornecedor!");
    })
  }

  verificaFormaRetirar() {
    if (!this.provedor.carrinhoVazio()) {
      let radioAlert = this.alertCtrl.create();
      radioAlert.setTitle('Você deseja?');
      
      radioAlert.addInput({
        type: 'radio',
        label: 'Delivery!',
        value: 'Delivery',
        checked: true
      })

      radioAlert.addInput({
        type: 'radio',
        label: 'Retirar ' +
              '(' + this.Fornecedor.endereco + ', ' + this.Fornecedor.numero + 
              ' - ' + this.Fornecedor.bairro + ', ' + this.Fornecedor.cidade +
              ' - ' + this.Fornecedor.uf + ', ' + this.Fornecedor.cep + ')',
        value: 'Balcao',
        checked: false,
        max: 150
      })
      
      //radioAlert.addButton('Cancel');
      radioAlert.addButton({
        text: 'OK',
        handler: data => {
          this.forma_retirar = data;
          if (data == "Delivery") {
            //this.verificaFormaPgto();
            this.verificaEndEntrega()
          } else {
            this.enviarPedido();
          }
        }
      });
      radioAlert.present();
    } else {
      this.provedor.aviso("Seu carrinho está vazio!");
    }
  }

  verificaFormaPgto() {
    const loading = this.loadingController.create({
      content: 'Carregando formas de pagamento...'
    });
    loading.present();
    this.provedor.getFormaPgto()
      .subscribe((data) => {
        var resposta = JSON.parse((data as any)._body);
        loading.dismiss();

        let radioAlert = this.alertCtrl.create();
        radioAlert.setTitle('Forma de pagamento?');
        var checado = true;
        resposta.forEach(element => {
          radioAlert.addInput({
            type: 'radio',
            label: element.descricao,
            value: element.id,
            checked: checado
          })
          checado = false;
        });

        //radioAlert.addButton('Cancel');
        radioAlert.addButton({
          text: 'OK',
          handler: data => {
            this.forma_pgto = data;
            if (data == '1')
              this.trocoPara();
            else
              this.enviarPedido();
          }
        });
        radioAlert.present();

      }, error => {
        loading.dismiss();
        console.log(error);
        this.provedor.aviso("Ocorreu um erro ao carregar dados!");
      })

  }

  trocoPara() {
    const prompt = this.alertCtrl.create({
      title: 'Você precisa de troco?',
      message: "Total do pedido: R$ " + this.total_com_tele.toFixed(2),
      inputs: [
        {
          name: 'troco',
          type: 'number',
          placeholder: 'Troco para...'
        }
      ],
      buttons: [
        {
          text: 'Não preciso',
          handler: data => {
            console.log('Cancel clicked');
            this.enviarPedido();
          }
        },
        {
          text: 'OK',
          handler: data => {
            console.log('Troco para: ' + data.troco);
            this.troco_para = data.troco;
            this.enviarPedido();
          }
        }
      ]
    });

    prompt.present();
  }


  verificaEndEntrega() {
    const loading = this.loadingController.create({
      content: 'Carregando endereço para entrega...'
    });
    loading.present();
    this.provedor.getDadosConta(localStorage.getItem('identificador'))
      .subscribe((data) => {
        var resposta = JSON.parse((data as any)._body);
        this.total_com_tele = this.total;
        this.total_com_tele += resposta.preco_tele;
        this.preco_tele = resposta.preco_tele;
        console.log(resposta);
        loading.dismiss();
        let confirm = this.alertCtrl.create({
          title: 'Verifique endereço de entrega',
          message: "<p>CEP: " + resposta.cep + "</p><p>Rua: " + resposta.endereco + "</p><p>Número: " + resposta.numero + "</p><p>Bairro: " + resposta.bairro + "</p><p>Complemento: " + resposta.complemento + "</p><p class='preco_tele'>Preço tele-entrega: R$"+resposta.preco_tele+"</p  >",
          buttons: [
            {
              text: 'Prosseguir',
              handler: () => {
                console.log("Chama envia pedido");
                this.verificaFormaPgto();
              }
            },
            {
              text: 'Editar endereço',
              handler: () => {
                this.navCtrl.push(CadastroPage);
              }
            }
          ]
        });
        confirm.present();
      }, error => {
        loading.dismiss();
        console.log(error);
        this.provedor.aviso("Ocorreu um erro ao carregar dados de endereço!");
      })
  }


  enviarPedido() {
    const loading = this.loadingController.create({
      content: 'Enviando pedido...'
    });
    loading.present();
    this.provedor.enviarPedido(this.carrinho, this.forma_retirar, this.forma_pgto, this.troco_para, this.total_com_tele, this.preco_tele)
      .subscribe((data) => {
        var resposta = JSON.parse((data as any)._body);
        if (resposta.pedido_id != null) {
          loading.dismiss();
          this.provedor.aviso("Seu pedido foi enviado com sucesso!");
          this.provedor.esvaziaCarrinho();
          this.navCtrl.setRoot(this.navCtrl.getActive().component);
        } else {
          loading.dismiss();
          console.log(resposta);
          this.provedor.aviso("Ocorreu um erro ao enviar seu pedido!");
        }
      }, error => {
        loading.dismiss();
        console.log(error);
        this.provedor.aviso("Ocorreu um erro ao enviar seu pedido!");
      })
  }
}

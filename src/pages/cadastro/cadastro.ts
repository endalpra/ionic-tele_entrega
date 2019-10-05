import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { ProvedorProvider } from '../../providers/provedor/provedor';
import { FormBuilder, AbstractControl, FormGroup, Validators } from '@angular/forms';
import { HomePage } from '../home/home';
import { stringify } from '@angular/core/src/util';
import { Geolocation } from '@ionic-native/geolocation';

@IonicPage()
@Component({
  selector: 'page-cadastro',
  templateUrl: 'cadastro.html',
})
export class CadastroPage {
  formgroup: FormGroup;
  email: AbstractControl;
  senha: AbstractControl;
  nome: AbstractControl;
  repetir_senha: AbstractControl;
  telefone: AbstractControl;
  cep: AbstractControl;
  endereco: AbstractControl;
  numero: AbstractControl;
  bairro: AbstractControl;
  complemento: AbstractControl;
  latitude: number = 0;
  longitude: number = 0;
  formSubmetido: boolean;
  public dados   = { nome: '', email: '', senha: '', telefone: '', cep: '', endereco: '', numero: '', bairro: '', complemento: '', latitude: 0, longitude: 0};
  public usuario = { nome: '', email: '', telefone: '', cep: '', endereco: '', bairro: '', numero:'', complemento: '', latitude: '', longitude: ''};

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public provedor: ProvedorProvider,
    public loadingController: LoadingController,
    public formbuilder: FormBuilder,
    private geolocation: Geolocation) {
    
    if (!this.provedor.isUsuarioLogado()) {
      this.formgroup = formbuilder.group({
        email: ['', Validators.required],
        nome: ['', Validators.required],
        telefone: ['', Validators.required],
        cep: ['', Validators.required],
        endereco: ['', Validators.required],
        numero: ['', Validators.required],
        bairro: ['', Validators.required],
        complemento: [''],
        senha: ['', Validators.required],
        repetir_senha: ['', Validators.required]
      });
      this.email = this.formgroup.controls['email'];
      this.nome = this.formgroup.controls['nome'];
      this.cep = this.formgroup.controls['cep'];
      this.telefone = this.formgroup.controls['telefone'];
      this.endereco = this.formgroup.controls['endereco'];
      this.numero = this.formgroup.controls['numero'];
      this.bairro = this.formgroup.controls['bairro'];
      this.complemento = this.formgroup.controls['complemento'];
      this.senha = this.formgroup.controls['senha'];
      this.repetir_senha = this.formgroup.controls['repetir_senha'];
    } else {
      this.formgroup = formbuilder.group({
        email: ['', [Validators.required, Validators.email]],
        nome: ['', Validators.required],
        telefone: ['', Validators.required],
        cep: ['', Validators.required],
        endereco: ['', Validators.required],
        numero: ['', Validators.required],
        bairro: ['', Validators.required],
        complemento: ['']
      });
      this.email = this.formgroup.controls['email'];
      this.nome = this.formgroup.controls['nome'];
      this.telefone = this.formgroup.controls['telefone'];
      this.cep = this.formgroup.controls['cep'];
      this.endereco = this.formgroup.controls['endereco'];
      this.numero = this.formgroup.controls['numero'];
      this.bairro = this.formgroup.controls['bairro'];
      this.complemento = this.formgroup.controls['complemento'];
    }
  }

  ionViewDidLoad() {
    if (this.provedor.isUsuarioLogado())
      this.buscarDadosConta();

      this.geolocation.getCurrentPosition().then((resp) => {
        this.dados.latitude = resp.coords.latitude;
        this.dados.longitude = resp.coords.longitude;
       }).catch((error) => {
         console.log('Erro', error);
       });
  }

  //Não está sendo usado - Deixei método para o caso de ser usado futuramente
  gravaDadosContaLocal() {
    this.usuario.nome = this.dados.nome;
    this.usuario.email = this.dados.email;
    this.usuario.telefone = this.dados.telefone;
    this.usuario.cep = this.dados.cep;
    this.usuario.endereco = this.dados.endereco;
    this.usuario.bairro = this.dados.bairro;
    this.usuario.numero = this.dados.numero;
    this.usuario.complemento = this.dados.complemento;
    this.usuario.latitude = this.dados.latitude+'';
    this.usuario.longitude = this.dados.longitude+'';
    localStorage.setItem('usuario' +'', JSON.stringify(this.usuario));
  }

  buscarDadosConta() {
    const loading = this.loadingController.create({
      content: 'Obtendo dados da conta...'
    });
    loading.present();
    this.provedor.getDadosConta()
      .subscribe((data) => {
        loading.dismiss();

        var user = JSON.parse((data as any)._body);

        this.dados.bairro = user.bairro;
        this.dados.telefone = user.telefone;
        this.dados.cep = user.cep;
        this.dados.complemento = user.complemento;
        this.dados.email = user.email;
        this.dados.endereco = user.endereco;
        this.dados.nome = user.name;
        this.dados.numero = user.numero;
      }, error => {
        loading.setContent('Erro ao obter dados: ' + error._body);
        setTimeout(() => {
          loading.dismiss();
        }, 3000);
      })
  }

  alterarConta() {
    this.formSubmetido = true;
    if (this.formgroup.status == "VALID") {
      const loading = this.loadingController.create({
        content: 'Um momento...'
      });
      loading.present();
      this.provedor.alterarDadosConta(this.dados)
        .subscribe((data) => {
          var token = (data as any)._body;          
          localStorage.setItem('token', token);
          loading.dismiss();          
          this.provedor.aviso('Dados alterados com sucesso!');         
        }, error => {
          loading.setContent('Erro ao alterar conta: ' + error._body);
          setTimeout(() => {
            loading.dismiss();
          }, 3000);
        })
    } else {
      this.provedor.aviso("Formulário não está preenchido corretamente. Favor verifique!");
    }
  }

  criarConta() {
    this.formSubmetido = true;
    if (this.formgroup.status == "VALID") {
      const loading = this.loadingController.create({
        content: 'Um momento...'
      });
      loading.present();
      this.provedor.criaConta(this.dados)
        .subscribe((data) => {
          var token = (data as any)._body;
          localStorage.setItem('token', token);
          loading.dismiss();
          this.navCtrl.setRoot(HomePage);         
        }, error => {          
          loading.setContent('Erro ao criar conta: ' + error._body);
          setTimeout(() => {
            loading.dismiss();
          }, 3000);
        })
    } else {
      this.provedor.aviso("Formulário não está preenchido corretamente. Favor verifique!");
    }
  }

  irLoginPage() {
    this.navCtrl.pop();
  }
}
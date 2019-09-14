import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { CadastroPage } from '../cadastro/cadastro';
import { ProvedorProvider } from '../../providers/provedor/provedor';
import { HomePage } from '../home/home';
import { AbstractControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ResetarPage } from '../resetar/resetar';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  formgroup: FormGroup;
  email: AbstractControl;
  senha: AbstractControl;
  formSubmetido: boolean;
  public credential = { email: '', senha: '' };

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private provedor: ProvedorProvider,
    public loadingController: LoadingController,
    public formbuilder: FormBuilder) {
    this.formgroup = formbuilder.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', Validators.required]
    });

    this.email = this.formgroup.controls['email'];
    this.senha = this.formgroup.controls['senha'];
  }

  ionViewDidLoad() {
    this.estaLogado();
  }

  estaLogado() {
    if (localStorage.getItem('logado') == 'true') {
      this.navCtrl.setRoot(HomePage);
    }
  }

  entrar() {
    this.formSubmetido = true;
    if (this.formgroup.status == "VALID") {
      const loading = this.loadingController.create({
        content: 'Um momento...'
      });
      loading.present();
      this.provedor.login(this.credential)
        .subscribe((data) => {
          var dado = JSON.parse((data as any)._body);
          if (dado[0] == 'ok') {
            localStorage.setItem('identificador', dado[1] + '');
            localStorage.setItem('logado', 'true');
            this.navCtrl.setRoot(HomePage);
            loading.dismiss();
          } else {
            loading.setContent(dado[0]);
            setTimeout(() => {
              loading.dismiss();
            }, 3000);
            console.log(dado[0]);
          }
        }, error => {
          loading.setContent("Erro desconhecido. Tente acessar novamente mais tarde!");
          setTimeout(() => {
            loading.dismiss();
          }, 3000);
        })
    }
  }

  irCadastroPage() {
    this.navCtrl.push(CadastroPage);
  }

  irResetarPage(){
    this.navCtrl.push(ResetarPage);
  }

}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, AbstractControl, Validators } from '@angular/forms';
import { ProvedorProvider } from '../../providers/provedor/provedor';

@IonicPage()
@Component({
  selector: 'page-resetar',
  templateUrl: 'resetar.html',
})
export class ResetarPage {
  formgroup: FormGroup;
  email: AbstractControl;
  formSubmetido: boolean;
  public credential = { email: '' };
  sucesso: boolean;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private provedor: ProvedorProvider,
    public loadingController: LoadingController,
    public formbuilder: FormBuilder) {
    this.formgroup = formbuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
    this.email = this.formgroup.controls['email'];
    this.sucesso = false;
  }

  ionViewDidLoad() {

  }

  enviar(){
    this.formSubmetido = true;
    if (this.formgroup.status == "VALID") {
      const loading = this.loadingController.create({
        content: 'Um momento...'
      });
      loading.present();
      this.provedor.resetar_senha(this.credential.email)
        .subscribe((data) => {
          var dado = JSON.parse((data as any)._body);
          if (dado == 1) {
            loading.setContent("Requisição enviada. Verifique sua caixa de email e resete sua senha!");
            setTimeout(() => {
              loading.dismiss();
            }, 10000);
            this.sucesso = true;
            loading.dismiss();
          } else if(dado == 2) {
            loading.setContent("Email informado não existe na nossa base de dados. Favor verifique!");
            setTimeout(() => {
              loading.dismiss();
            }, 5000);            
          }else{
            loading.setContent("Erro desconhecido. Tente novamente mais tarde!");
            setTimeout(() => {
              loading.dismiss();
            }, 3000);
          }
        }, error => {
          loading.setContent("Erro desconhecido. Tente novamente mais tarde!");
          setTimeout(() => {
            loading.dismiss();
          }, 3000);
        })
    }
  }

}

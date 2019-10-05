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
  public credential = { email: '' };;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private provedor: ProvedorProvider,
    public loadingController: LoadingController,
    public formbuilder: FormBuilder) {
    this.formgroup = formbuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
    this.email = this.formgroup.controls['email'];
  }

  ionViewDidLoad() {}

  enviar(){
    this.formSubmetido = true;
    if (this.formgroup.status == "VALID") {
      const loading = this.loadingController.create({
        content: 'Um momento...'
      });
      loading.present();
      this.provedor.resetar_senha(this.credential.email)
        .subscribe((data) => {
          var resposta = (data as any)._body;
          
          this.provedor.aviso(resposta);

          loading.dismiss();          
        }, error => {
          loading.setContent("Erro ao requisitar recuparação de senha: " + error._body);
          setTimeout(() => {
            loading.dismiss();
          }, 3000);
        })
    }
  }
}
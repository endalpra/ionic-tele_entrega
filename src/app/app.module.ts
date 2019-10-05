import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import { SplashScreen } from '@ionic-native/splash-screen';
import { ProvedorProvider } from '../providers/provedor/provedor';
import { HttpModule } from '@angular/http';
import { AddcarrinhoPage } from '../pages/addcarrinho/addcarrinho';
import { CarrinhoPage } from '../pages/carrinho/carrinho';
import { LoginPage } from '../pages/login/login';
import { CadastroPage } from '../pages/cadastro/cadastro';
import { ResetarPage } from '../pages/resetar/resetar';
import { SobrePage } from '../pages/sobre/sobre';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    AddcarrinhoPage,
    CarrinhoPage,
    LoginPage,
    CadastroPage,
    ResetarPage,
    SobrePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    AddcarrinhoPage,
    CarrinhoPage,
    LoginPage, 
    CadastroPage,
    ResetarPage,
    SobrePage
  ],
  providers: [
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ProvedorProvider,
    Geolocation  
  ]
})
export class AppModule {}
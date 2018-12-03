import { NgModule, ErrorHandler } from '@angular/core';
import { HttpClientModule } from "@angular/common/http";
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { TabsPage } from '../pages/tabs/tabs';
import { SignInPage } from "../pages/sign-in/sign-in";

//imported pages
import { Applications } from "./pages/applications";
import { Profile } from "./pages/profile";
import { Inbox } from "./pages/inbox";
import { Dashboard } from "./pages/dashboard";
import { HomePages } from "./pages/home";

//imported modules
import { DirectivesModule } from "../directives/directives.module";
import { ComponentsModule } from "../components/components.module";
import { PipesModule } from "../pipes/pipes.module";

import { NativeModules } from "./native-modules";
import { IonicStorageModule } from "@ionic/storage";

//imported components
import { Components } from "../components/components";

//providers
import { Providers } from "../providers/providers";
import { AgencyProvider } from '../providers/agency/agency';

@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    SignInPage,
    ...Dashboard,
    ...Inbox,
    ...Profile,
    ...Applications,
    ...Components,
    ...HomePages
  ],
  imports: [
    BrowserModule,
    DirectivesModule,
    PipesModule,
    ComponentsModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot({
      name: 'db',
      driverOrder: ['indexeddb', 'sqlite', 'localstorage', 'websql'],
      version: 1.0
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    SignInPage,
    ...Dashboard,
    ...Inbox,
    ...Profile,
    ...Applications,
    ...Components,
    ...HomePages
  ],
  providers: [
    ...NativeModules,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ...Providers,
    AgencyProvider
  ]
})
export class AppModule {}

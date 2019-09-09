import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { AkitaNgRouterStoreModule } from '@datorama/akita-ng-router-store';
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { ContactsComponent } from './contacts/contacts.component';
import { mockInterceptor } from './mock/mock.interceptor';

const appRoutes: Routes = [
  { path: '', component: ContactsComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    ContactsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    environment.production ? [] : AkitaNgDevtools.forRoot(),
    RouterModule.forRoot(appRoutes),
    AkitaNgRouterStoreModule.forRoot()
  ],
  providers: [
    mockInterceptor,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

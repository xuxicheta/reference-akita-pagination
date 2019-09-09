import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { AkitaNgRouterStoreModule } from '@datorama/akita-ng-router-store';
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { ContactsComponent } from './contacts/contacts.component';
import { MockInterceptor } from './mock/http.interceptor';


const apiInterceptor = {
  provide: HTTP_INTERCEPTORS,
  useClass: MockInterceptor,
  multi: true
};

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
    apiInterceptor,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

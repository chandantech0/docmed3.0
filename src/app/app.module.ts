import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { SharedModule } from './shared';
import { SelectloginComponent } from './auth/selectlogin/selectlogin.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthAPIService } from './auth/auth.api.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { authInterceptor } from './Interceptor/http.interceptor';
import { UtilsService } from './shared/utility';
import { ToastMessageService } from './shared/toast-message.service';
import { ToastrModule } from 'ngx-toastr';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { AuthGuard } from './auth/auth.guard';


@NgModule({
  declarations: [
    AppComponent,
    SelectloginComponent,
    SignupComponent,
    ResetPasswordComponent,
    NotFoundPageComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-center',
      preventDuplicates: true
    })
  ],
  providers: [ {provide: HTTP_INTERCEPTORS, useClass: authInterceptor, multi: true},
    AuthAPIService, 
    UtilsService,
    ToastMessageService,
    AuthGuard
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule} from '@angular/material/radio';
import { MatCheckboxModule} from '@angular/material/checkbox';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './_helpers/material.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { DialogAuthentication } from './_services/auth.component';
import { ConfirmationDialogComponent } from './_components/confirmation-dialog/confirmation-dialog.component';
import { CardDetailDialogComponent } from './_components/card-detail-dialog/card-detail-dialog';
import { orderDetailsComponent, cancelOrderDialog, EditorderDialog, ConfirmpaymentreceivedDialog } from './_components/single-order-detail/single-order-detail';
import {OnlyNumberDirective} from './only-number.directive';
import { SocialLoginModule, SocialAuthServiceConfig, FacebookLoginProvider,GoogleLoginProvider } from 'angularx-social-login';
import { ErrorInterceptor } from './_helpers';
import { MdePopoverModule } from '@material-extended/mde';
// import { CookieService } from "angular2-cookie/services/cookies.service";
import { AngularEditorModule } from '@kolkov/angular-editor';
import { ResponsePageComponent } from './response-page/response-page.component';


const config = [ 
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '458577402908-0dgkkip4akvlppbb6lkr35l5rv4c5rdi.apps.googleusercontent.com'
            )
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('2885117205032998')
          }
        ]
      } as SocialAuthServiceConfig,
    }
]

export function provideConfig() {
  return config;
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    DialogAuthentication,
    ConfirmationDialogComponent,
    CardDetailDialogComponent,
    EditorderDialog, 
    ConfirmpaymentreceivedDialog,
    cancelOrderDialog,
    orderDetailsComponent,
    OnlyNumberDirective,
    ResponsePageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatRadioModule,
    MatCheckboxModule,
    MaterialModule,
    NgbModule,
    FlexLayoutModule,
    FontAwesomeModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    MdePopoverModule,
    SocialLoginModule,
	AngularEditorModule,
  ],
  entryComponents: [
    DialogAuthentication,
    ConfirmationDialogComponent,
    CardDetailDialogComponent,
    EditorderDialog, 
    ConfirmpaymentreceivedDialog,
    cancelOrderDialog,
    orderDetailsComponent,
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '458577402908-0dgkkip4akvlppbb6lkr35l5rv4c5rdi.apps.googleusercontent.com'
            )
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('2885117205032998')
          }
        ]
      } as SocialAuthServiceConfig,
    }
  ],
  bootstrap: [AppComponent],

})
export class AppModule { }

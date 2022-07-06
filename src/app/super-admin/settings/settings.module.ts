import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule} from '@angular/common/http';
import { MaterialModule } from '../../_helpers/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import { EventPageDesignComponent } from './event-page-design/event-page-design.component';
import { ButttonAndLinksComponent } from './buttton-and-links/buttton-and-links.component';
import { ContactPreferencesComponent } from './contact-preferences/contact-preferences.component';
import { CheckoutFormComponent } from './checkout-form/checkout-form.component';
import { WebsitesEmbedCodesComponent } from './websites-embed-codes/websites-embed-codes.component';
// import { MyProfileComponent } from '../my-profile/my-profile.component';
import { BoxOfficeComponent } from './box-office/box-office.component';
import { SeatingChartsComponent } from './seating-charts/seating-charts.component';
import { TeamAccessComponent } from './team-access/team-access.component';
import { BillingComponent,DialogUnBuyTicketsCredits ,DialogLearnMore,DialogViewAllInvoices,DialogViewAllUsage,DialogUpdateVatInfo,DialogCharityDiscount} from './billing/billing.component';
// import { BillingComponent,DialogUnBuyTicketsCredits ,DialogLearnMore,DialogViewAllInvoices,DialogViewAllUsage, DialogCharityDiscount} from './billing/billing.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { PrivacyPolicyGenerateDialog } from './privacy-policy/privacy-policy.component';
import { MatExpansionModule} from '@angular/material/expansion';
import { ColorPickerModule } from 'ngx-color-picker';
import { ConnectAppsComponent } from './connect-apps/connect-apps.component';
import { CKEditorModule } from 'ngx-ckeditor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { inviteTeamMateDialog} from './team-access/team-access.component';
import { OrderConfirmationComponent } from './order-confirmation/order-confirmation.component';
import { SalesTaxComponent } from './sales-tax/sales-tax.component';
import { AddSalesTax } from './sales-tax/sales-tax.component';
import { DialogAdminBoxofficeImageUpload } from './box-office/box-office.component';
import { PaymentSystemsComponent } from './payment-systems/payment-systems.component';
import { addBuyerQuestionDialog, addAttendeeQuestionDialog } from './checkout-form/checkout-form.component';
import { ReferralCodeComponent, addReferralCodeDialog } from './referral-code/referral-code.component';
import { AppUsersComponent, AddAppUser, appUserDetail } from './app-users/app-users.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { MdePopoverModule } from '@material-extended/mde';
import { ProgressComponent } from './components/progress/progress.component';
import { RemindersComponent } from './reminders/reminders.component';


@NgModule({
  declarations: [
    SettingsComponent, 
    EventPageDesignComponent,
    ContactPreferencesComponent, 
    CheckoutFormComponent, 
    ButttonAndLinksComponent, 
    WebsitesEmbedCodesComponent,
    TeamAccessComponent, 
    // MyProfileComponent, 
    BoxOfficeComponent, 
    SeatingChartsComponent, 
    ConnectAppsComponent, 
    BillingComponent, 
    AddSalesTax,
    PrivacyPolicyComponent,
    SalesTaxComponent,
     OrderConfirmationComponent,
    inviteTeamMateDialog,
    DialogAdminBoxofficeImageUpload,
    PaymentSystemsComponent,
    PrivacyPolicyGenerateDialog,
    addBuyerQuestionDialog, 
    addAttendeeQuestionDialog, 
    ReferralCodeComponent,
    addReferralCodeDialog,
    AppUsersComponent,
    AddAppUser,
    appUserDetail,
    DialogUnBuyTicketsCredits,
    DialogLearnMore,
    DialogViewAllInvoices,
    DialogViewAllUsage,
    DialogUpdateVatInfo,
    DialogCharityDiscount,
    ProgressComponent,
    RemindersComponent
  ],

  imports: [
    CommonModule,
    SettingsRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    MatExpansionModule,
    ColorPickerModule,
    CKEditorModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    NgxMatSelectSearchModule,
    AngularEditorModule,
    MdePopoverModule,
    
  ],
  entryComponents: [
    AddSalesTax,
    DialogAdminBoxofficeImageUpload,
    inviteTeamMateDialog,
    addBuyerQuestionDialog, 
    addAttendeeQuestionDialog,
    PrivacyPolicyGenerateDialog,
    addReferralCodeDialog,
    AddAppUser,
    appUserDetail,
    DialogUnBuyTicketsCredits,
    DialogLearnMore,
    DialogViewAllInvoices,
    DialogViewAllUsage,
    DialogUpdateVatInfo,
    DialogCharityDiscount
  ]
})
export class SettingsModule { }
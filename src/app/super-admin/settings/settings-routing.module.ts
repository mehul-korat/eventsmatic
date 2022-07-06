import { NgModule,  } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SettingsComponent } from './settings.component';
import { EventPageDesignComponent } from './event-page-design/event-page-design.component';
import { ButttonAndLinksComponent } from './buttton-and-links/buttton-and-links.component';
import { ContactPreferencesComponent } from './contact-preferences/contact-preferences.component';
import { CheckoutFormComponent } from './checkout-form/checkout-form.component';
import { TeamAccessComponent } from './team-access/team-access.component';

import { WebsitesEmbedCodesComponent } from './websites-embed-codes/websites-embed-codes.component';
import { OrderConfirmationComponent } from './order-confirmation/order-confirmation.component';
import { BoxOfficeComponent } from './box-office/box-office.component';
import { ConnectAppsComponent } from './connect-apps/connect-apps.component';
import { SeatingChartsComponent } from './seating-charts/seating-charts.component';
import { BillingComponent } from './billing/billing.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { SalesTaxComponent } from './sales-tax/sales-tax.component';
import { PaymentSystemsComponent } from './payment-systems/payment-systems.component';
import { ReferralCodeComponent } from './referral-code/referral-code.component'
import { AppUsersComponent } from './app-users/app-users.component'
import { RemindersComponent } from './reminders/reminders.component'

const routes: Routes = [{ 
              path: '', 
              component: SettingsComponent, 
              children:[{
                    path:'',
                    component:WebsitesEmbedCodesComponent
                  },
                  {
                    path:'event-page-design',
                    component:EventPageDesignComponent
                  },

                  {
                    path:'buttons-and-links',
                    component:ButttonAndLinksComponent
                  },
                  {
                    path:'websites-embed-codes',
                    component:WebsitesEmbedCodesComponent
                  },
                  {
                    path:'seating-charts',
                    component:SeatingChartsComponent
                  },
                 
                  {
                    path:'order-confirmation',
                    component:OrderConfirmationComponent
                  },
                  {
                    path:'box-office',
                    component:BoxOfficeComponent
                  },
                  {
                    path:'billing',
                    component:BillingComponent
                  },
                  {
                    path:'sales-tax',
                    component:SalesTaxComponent
                  },
                  { 
                    path: 'contact-preferences', 
                    component: ContactPreferencesComponent
                  },
                  { 
                    path: 'privacy-policy', 
                    component: PrivacyPolicyComponent
                  },
                  { 
                    path: 'checkout-form', 
                    component: CheckoutFormComponent
                  },

                  { 
                    path: 'team-access', 
                    component: TeamAccessComponent
                  },
                  { 
                    path: 'connect-app', 
                    component: ConnectAppsComponent
                  },
                  { 
                    path: 'payment-systems', 
                    component: PaymentSystemsComponent
                  },
                  { 
                    path: 'referral-codes', 
                    component: ReferralCodeComponent
                  },
                  { 
                    path: 'app-users', 
                    component: AppUsersComponent
                  },
                  { 
                    path: 'reminders', 
                    component: RemindersComponent
                  }]
              }]
                         
                         
                         

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }

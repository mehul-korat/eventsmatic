import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SingleEventDashboard } from './single-event-dashboard';
import { EventSummaryComponent } from './event-summary/event-summary.component';
import { EventAndTicketTypesComponent } from './event-and-ticket-types/event-and-ticket-types.component';
import { CheckoutFormComponent } from './checkout-form/checkout-form.component';
import { DeleteComponent } from './delete/delete.component';
import { WaitilistSignupComponent } from './waitilist-signup/waitilist-signup.component';
import { IssuedTicketComponent } from './issued-ticket/issued-ticket.component';
import { OrderConfirmationComponent } from './order-confirmation/order-confirmation.component';
import { BroadcastComponent } from './broadcast/broadcast.component';
import { DuplicateComponent } from './duplicate/duplicate.component';
import { OccurrencesComponent } from './occurrences/occurrences.component';

const routes: Routes = [
  { 
    path: '', 
    component: SingleEventDashboard,
    children:[
      {
      path:'',
      component:EventSummaryComponent 
      },
      {
      path:'event-summary',
      component:EventSummaryComponent 
      },
      {
      path:'event-and-ticket-types',
      component:EventAndTicketTypesComponent 
      },
      {
      path:'manage-occurrences',
      component:OccurrencesComponent 
      },
      {
      path:'checkout-form',
      component:CheckoutFormComponent 
      },
      {
      path:'delete',
      component:DeleteComponent 
      },
      {     
      path:'waitilist-signup',
      component:WaitilistSignupComponent
      },
      {
        path:'issued-ticket',
        component:IssuedTicketComponent 
      },
      {
        path: 'order-confirmation',
        component:OrderConfirmationComponent
      },
      {
        path: 'broadcast',
        component:BroadcastComponent
      },
      {
        path: 'duplicate',
        component:DuplicateComponent
      }
    ] 
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SingleEventDashboardRoutingModule { }

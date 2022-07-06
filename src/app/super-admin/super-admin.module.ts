import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { SuperAdminRoutingModule } from './super-admin-routing.module';
import { SuperAdminComponent } from './super-admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EventsComponent } from './events/events.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { MaterialModule } from '../_helpers/material.module';
import { MatTableModule } from '@angular/material/table';
import { OrdersComponent } from './orders/orders.component';
import { CouponsComponent } from './coupons/coupons.component';
import { CustomersComponent } from './customers/customers.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
// import { CKEditorModule } from 'ngx-ckeditor';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AddNewTicketType } from './events/events.component';
// import { AddNewTicketGroup } from './events/events.component';
import { DialogAdminProfileImageUpload } from './my-profile/my-profile.component';
import { myCreateDiscountCodeDialog } from './coupons/coupons.component';
import { myBatchVoucherCodeDialog } from './coupons/coupons.component';
import { AssignToEventDialog } from './coupons/coupons.component';
import { AssignToTicketTypeDialog } from './coupons/coupons.component';
import { ExportOrderDialog } from './orders/orders.component';
import { AddNewOrderDialog } from './orders/orders.component';
import { BookTicketDialog } from './orders/orders.component';
import { OrderInvoiceDialog ,ConfirmpaymentreceivedDialog} from './orders/orders.component';
import { EditorderDialog, cancelOrderDialog, eventSummaryDialog } from './orders/orders.component';
import { MyBoxofficeComponent } from './my-boxoffice/my-boxoffice.component';
import { myCreateNewBoxofficeDialog } from './my-boxoffice/my-boxoffice.component';
import { DialogEventImageUpload } from './events/events.component'
import { MatTimepickerModule } from 'mat-timepicker';
import { DialogImportFileUpload } from './customers/customers.component';
import { DialogCustomerImageUpload } from './customers/customers.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { MdePopoverModule } from '@material-extended/mde';



@NgModule({
  declarations: [
      DashboardComponent, 
      SuperAdminComponent,
      EventsComponent,
      MyProfileComponent,
      CouponsComponent,
      OrdersComponent, 
      CustomersComponent,
      MyBoxofficeComponent,
      myCreateDiscountCodeDialog,
      myBatchVoucherCodeDialog,
      ExportOrderDialog,
      AddNewOrderDialog,
      BookTicketDialog,
      AddNewTicketType,
      // AddNewTicketGroup,
      OrderInvoiceDialog,
      ConfirmpaymentreceivedDialog,
      EditorderDialog,
      cancelOrderDialog,
      eventSummaryDialog,
      myCreateNewBoxofficeDialog,
      DialogEventImageUpload,
      DialogImportFileUpload,
      DialogCustomerImageUpload,
      AssignToEventDialog,
      AssignToTicketTypeDialog,
      DialogImportFileUpload,
      DialogAdminProfileImageUpload
  ],
  
  imports: [
    CommonModule, 
    SuperAdminRoutingModule, 
    MaterialModule, 
    MatTableModule,
    FlexLayoutModule,
    FontAwesomeModule,
    MatTooltipModule,
    HttpClientModule,
    MatCardModule,
    MatExpansionModule,
    // CKEditorModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgxMatSelectSearchModule,
    AngularEditorModule,
    MdePopoverModule,
  ],
  
  entryComponents: [
    myCreateDiscountCodeDialog,
    myBatchVoucherCodeDialog,
    ExportOrderDialog,
    AddNewOrderDialog,
    BookTicketDialog,
    OrderInvoiceDialog,
    ConfirmpaymentreceivedDialog,
    AddNewTicketType,
    // AddNewTicketGroup,
    myCreateNewBoxofficeDialog,
    DialogEventImageUpload,
    AssignToEventDialog,
    AssignToTicketTypeDialog,
    DialogImportFileUpload,
    DialogCustomerImageUpload,
    cancelOrderDialog,
    EditorderDialog,
    eventSummaryDialog,
    DialogAdminProfileImageUpload
    
  ],
  bootstrap: [EventsComponent]

})
  
export class SuperAdminModule {}

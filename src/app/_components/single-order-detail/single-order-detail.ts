import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { ErrorService } from '../../_services/error.service';
import { HttpClient } from '@angular/common/http';
import { SuperadminService } from '../../super-admin/_services/superadmin.service';
import { DatePipe} from '@angular/common';
import {  environment } from '../../../environments/environment';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './single-order-detail.html',
  styleUrls: ['./single-order-detail.scss'],
  providers: [DatePipe]
})
export class orderDetailsComponent implements OnInit {
  singleorderCustomer:any;
  animal :any;
 // eventTicket:any;
  selectedEventCode:any;
  orderDetail:any =  [];
  orderDate:any;
  eventDate:any;
  order_item_data:any = [];
  customerData:any = [];
  isLoaderAdmin = false;
  is_show = false;
  currencyCode ='USD';  
  attendeeData:any = [];
  customerAddress : any;
  // Orderdata:any;
  subPermission:any;
  purchasedTicket:any;
  taxArray:any;
  orderId:any
  constructor(public dialogRef: MatDialogRef<orderDetailsComponent>,
    private http: HttpClient,
    public dialog: MatDialog,
    public superadminService : SuperadminService,
    public datePipe:DatePipe,
    private errorService:ErrorService,
    private change:ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: any) {
     this.orderId = this.data.orderId
     }
     onNoClick(): void {
      this.dialogRef.close();
    }

    ngOnInit() {
      this.fnGetsingleOrder();
    //  this.fnGeteventTicket();
    }

    cancelOrder(){
      const dialogRef = this.dialog.open(cancelOrderDialog, {
        width: '700px',
        data : this.orderDetail
      });
    
      dialogRef.afterClosed().subscribe(result => {
        this.animal = result;
        this.dialogRef.close();
      });
    }
  
    editOrder(){
      const dialogRef = this.dialog.open(EditorderDialog, {
        width: '700px',
        data : this.orderDetail
      });
    
      dialogRef.afterClosed().subscribe(result => {
        this.animal = result;
        this.dialogRef.close();
      });
    }  


    fnDownloadTicket(itemId){
      window.open(`${environment.apiUrl}/download-single-ticket?unique_code=${itemId}`);
    }  


    fnDownloadInvoice(orderId) {
      window.open(`${environment.apiUrl}/stream-invoice-pdf?order_id=${orderId}`);
    }  

    fnPayementpaid(){

      const dialogRef = this.dialog.open(ConfirmpaymentreceivedDialog, {
        width: '700px',
        data: this.orderDetail
      });
    
      dialogRef.afterClosed().subscribe(result => {
        this.dialogRef.close();
        this.fnGetsingleOrder();
      });

    }

    // orderInvoice() {
    //   // const dialogRef = this.dialog.open(OrderInvoiceDialog, {
    //   //   width: '700px',
    //   // });
    
    //   //  dialogRef.afterClosed().subscribe(result => {
    //   //   this.animal = result;
    //   //  });
    // }  
  
    resendOrder(){
      this.isLoaderAdmin=true;
      this.superadminService.fnResendOrder(this.orderDetail.unique_code).subscribe((response:any)=>{
        if(response.data == true){   
          this.errorService.successMessage(response.response);
        } else if(response.data == false){
          this.errorService.errorMessage(response.response);
        }
      });
        this.isLoaderAdmin=false;
    }

    fnGetsingleOrder(){

      let requestObject={
        "unique_code": this.orderId,
      } 

      this.superadminService.fnGetsingleOrder(requestObject).subscribe((response:any) => {
        if(response.data == true){
          this.orderDetail = response.response.order_info;
          // this.Orderdata = 
          this.purchasedTicket = response.response.ticket_info;
          this.orderDate  = this.datePipe.transform(new Date(this.orderDetail.created_at),"EEE MMM d, y");
          this.eventDate  = this.datePipe.transform(new Date(this.orderDetail.events.start_date),"EEE MMM d, y");
          this.order_item_data = this.orderDetail.order_item;
          this.customerData = this.orderDetail.customer;
          this.attendeeData  = JSON.parse(this.orderDetail.attendee_info);
          this.currencyCode = this.orderDetail.events.event_setting.currency;
          this.taxArray = this.orderDetail.tax_info!= null?JSON.parse(this.orderDetail.tax_info):'';
          if(this.orderDetail.customer.usa_address != null){
            this.customerAddress = JSON.parse(this.orderDetail.customer.usa_address)
            this.customerAddress['style']= 'USA';
          }else if(this.orderDetail.customer.uk_address != null){
            this.customerAddress = JSON.parse(this.orderDetail.customer.uk_address) 
            this.customerAddress['style']= 'UK';
          }else if(this.orderDetail.customer.ca_address != null){
            this.customerAddress = JSON.parse(this.orderDetail.customer.ca_address)
            this.customerAddress['style']= 'CA';
          }
        }else{
          this.singleorderCustomer  = [];
        }
        this.is_show = true
        this.change.detectChanges();

      });

    }

    // fnGeteventTicket(){
    //   let requestObject={
    //     "event_id":this.selectedEventCode,
    //   }
    //   this.superadminService.fnGeteventTicket(requestObject).subscribe((response:any) => {
    //     if(response.data == true){
    //       this.eventTicket = response.response;
    //       this.eventTicket.forEach(element => {
    //         element.qty = 0;
    //       });
    //     }else{
    //       this.eventTicket = [];
    //     }
    //   });
    // }

 
}

@Component({
  selector: 'cancel-order',
  templateUrl: './cancel-order.html',
})
export class cancelOrderDialog { 
  singleorderCustomer:any;
  isLoaderAdmin=false;
  orderDetail:any = [];
  cancelreason;
  eventData:any = [];

  constructor(
    public dialogRef: MatDialogRef<cancelOrderDialog>,
    private http: HttpClient,
    public superadminService : SuperadminService,
    private ErrorService : ErrorService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.singleorderCustomer = this.data;
      console.log(this.singleorderCustomer)
      this.eventData = this.data.events ? this.data.events : [];
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
  //  this.fnGetsingleOrder();
  }
  
   
  // fnGetsingleOrder(){
    
  //   this.isLoaderAdmin = true;
  //   let requestObject={
  //     "unique_code":this.data.unique_code,
  //   }

  //   this.superadminService.fnGetsingleOrder(requestObject).subscribe((response:any) => {
  //     if(response.data == true){
  //       this.singleorderCustomer = response.response;
  //     }else{
  //       this.ErrorService.errorMessage(response.response);
  //     }
  //   this.isLoaderAdmin = false;
  //   });

  // }

  cancelthisOrder(){

    this.isLoaderAdmin = true;

    let requestObject  = { 
      'unique_code' : this.data.unique_code,
      'notes' : this.cancelreason,
      'status' : 'C'
    }

    this.superadminService.cancelOrder(requestObject).subscribe((response:any) => {
      if(response.data == true){
         this.ErrorService.successMessage(response.response);
         this.dialogRef.close();
      }else{
          this.ErrorService.errorMessage(response.response);
      }
      this.isLoaderAdmin = false;
    });
    
  }


}

@Component({
  selector: 'edit-order',
  templateUrl: './edit-order.html',
})
export class EditorderDialog { 

  editTicket: FormGroup;
  onlynumeric = /^-?(0|[1-9]\d*)?$/;
  singleorderCustomer:any;
  eventForm:any = [];
  eventSpecificForm:any = [];
  selectedEventCode = localStorage.getItem('selectedEventCode');
  is_submit = false;
  boxoffice_id   = localStorage.getItem('boxoffice_id');
  isLoaderAdmin = false;
  addressArr = {
    'address': 'Address Line 1',
    'address1': 'City',
    'address2': 'State',
    'zipcode': 'Zip Code',
  };
  is_address_hide = false;
  attendeeForm:any =  [];
  addressStyleArry:any;
  customerAddress:any;
  constructor(
    public dialogRef: MatDialogRef<EditorderDialog>,
    private http: HttpClient,
    public superadminService : SuperadminService,
    private _formBuilder:FormBuilder,
    private errorMessage:ErrorService,
    private change:ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) {
      let emailPattern=/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
      this.editTicket = this._formBuilder.group({
        name:["", Validators.required],
        email:["", [Validators.required, Validators.email, Validators.pattern(emailPattern)]],
        address:["", Validators.required],
        address1:["", Validators.required],
        address2:["", Validators.required],
        zipcode:["", [Validators.required,Validators.minLength(5),Validators.maxLength(6)]],
        phone:['',[Validators.required,Validators.pattern(this.onlynumeric),Validators.minLength(6),Validators.maxLength(15)]],
      });

      
    }

    onNoClick(): void {
      this.editTicket.reset();
      this.dialogRef.close();
    }
    
    ngOnInit() {
      this.fnGetsingleOrder();
      this.getCheckoutFormSettings();
    }

   

    getCheckoutFormSettings(){

      this.isLoaderAdmin = true;
      let requestObject = {
        'event_id' : this.selectedEventCode,
        'option_key' : 'checkout_form_type',
        'boxoffice_id' : 'NULL'
      }

      this.superadminService.getSingleEventSettings(requestObject).subscribe((response:any) => {
        if(response.data == true){

          let checkout_form_type =  JSON.parse(response.response); 

          if(checkout_form_type == 'global'){
            let arrgumentObject = {
              'event_id' : 'NULL',
              'option_key' : 'checkout_form',
              'boxoffice_id' : this.boxoffice_id
            }
            this.getEventForm(arrgumentObject);
          }else{
            let arrgumentObject = {
              'event_id' : this.selectedEventCode,
              'option_key' : 'checkout_form',
              'boxoffice_id' : 'NULL'
            }
            this.getEventForm(arrgumentObject);
          }

        } else if(response.data == false){
          this.errorMessage.errorMessage(response.response);
        }
        this.isLoaderAdmin = false;
      });

    } 

    getEventForm(requestObject){
     
      this.isLoaderAdmin = true;
      this.superadminService.getSingleEventSettings(requestObject).subscribe((response:any) => {
        if(response.data == true){
          var data =   JSON.parse(response.response);
          this.eventForm = data[0].buyer_questions;

          if(this.eventForm[2].is_deleted && this.eventForm[2].is_deleted == true){
            this.is_address_hide = true;
            this.editTicket.controls["address"].setValidators(null);
            this.editTicket.controls["address1"].setValidators(null);
            this.editTicket.controls["address2"].setValidators(null);
            this.editTicket.controls["zipcode"].setValidators(null);

            this.editTicket.controls["address"].setValue(null);
            this.editTicket.controls["address1"].setValue(null);
            this.editTicket.controls["address2"].setValue(null);
            this.editTicket.controls["zipcode"].setValue(null);

          }

          if(this.eventForm[2].addressForamteStyle == 'UK'){
          
            this.addressArr = {
              'address': 'Address Line 1',
              'address1': 'Address Line 2',
              'address2': 'Address Line 3',
              'zipcode': 'Zip Code',
            };
  
          }else if(this.eventForm[2].addressForamteStyle == 'Cadadian'){
  
            this.addressArr = {
              'address': 'Address Line 1',
              'address1': 'City',
              'address2': 'Province',
              'zipcode': 'Postal Code',
            };
  
          }

          this.change.detectChanges();
        } else if(response.data == false){
          this.errorMessage.errorMessage(response.response);
        }
      this.isLoaderAdmin = false;
      });

    }

    
    fnGetsingleOrder(){
      this.isLoaderAdmin = true;

      let requestObject={
        "unique_code":this.data.unique_code,
      }
      
      this.superadminService. fnGetsingleOrder(requestObject).subscribe((response:any) => {
        if(response.data == true){

          this.singleorderCustomer = response.response.order_info;
          if(this.singleorderCustomer.customer_info){
            this.eventSpecificForm =  JSON.parse(this.singleorderCustomer.customer_info);
          }
        
          this.attendeeForm = JSON.parse(this.singleorderCustomer.attendee_info);

          this.editTicket.controls['name'].setValue(this.singleorderCustomer.customer.name)
          this.editTicket.controls['email'].setValue(this.singleorderCustomer.customer.email)
          this.editTicket.controls['phone'].setValue(this.singleorderCustomer.customer.phone)
          if(this.singleorderCustomer.customer.usa_address != null){
            this.customerAddress = JSON.parse(this.singleorderCustomer.customer.usa_address)
            this.customerAddress['style']= 'USA';
            this.editTicket.controls['address'].setValue(this.customerAddress.address1)
            this.editTicket.controls['address1'].setValue(this.customerAddress.city)
            this.editTicket.controls['address2'].setValue(this.customerAddress.state)
            this.editTicket.controls['zipcode'].setValue(this.customerAddress.zipcode)
          }else if(this.singleorderCustomer.customer.uk_address != null){
            this.customerAddress = JSON.parse(this.singleorderCustomer.customer.uk_address)
            this.customerAddress['style']= 'UK';
            this.editTicket.controls['address'].setValue(this.customerAddress.address1)
            this.editTicket.controls['address1'].setValue(this.customerAddress.address2)
            this.editTicket.controls['address2'].setValue(this.customerAddress.address3)
            this.editTicket.controls['zipcode'].setValue(this.customerAddress.zipcode)
          }else if(this.singleorderCustomer.customer.ca_address != null){
            this.customerAddress = JSON.parse(this.singleorderCustomer.customer.ca_address)
            this.customerAddress['style']= 'CA';
            this.editTicket.controls['address'].setValue(this.customerAddress.address1)
            this.editTicket.controls['address1'].setValue(this.customerAddress.city)
            this.editTicket.controls['address2'].setValue(this.customerAddress.province)
            this.editTicket.controls['zipcode'].setValue(this.customerAddress.postalcode)
          }
          
          // this.editTicket.controls['address'].setValue(this.singleorderCustomer.customer.address)
          // this.editTicket.controls['address1'].setValue(this.singleorderCustomer.customer.address1)
          // this.editTicket.controls['address2'].setValue(this.singleorderCustomer.customer.address2)
          // this.editTicket.controls['zipcode'].setValue(this.singleorderCustomer.customer.zipcode)

          this.change.detectChanges();

        }else{
          this.errorMessage.errorMessage(response.response);
        }
      this.isLoaderAdmin = false;
      });
    }

    optionsArr(arr){
      return arr.split(/\r?\n/);
    }
  
    
    CheckBoxArr(arr){
      var optionToArray = [];
      arr.split(/\r?\n/).forEach(element => {
        optionToArray.push({ 'value': element,'is_check':false});
      });
      return optionToArray;
    }
    
    async updateOrder(){

      this.is_submit = true;
      var is_error = false;
  
      if(this.editTicket.invalid){
        this.editTicket.get('name').markAsTouched();
        this.editTicket.get('email').markAsTouched();
        this.editTicket.get('phone').markAsTouched();
        this.editTicket.get('address').markAsTouched();
        this.editTicket.get('address1').markAsTouched();
        this.editTicket.get('address2').markAsTouched();
        this.editTicket.get('zipcode').markAsTouched();
        this.errorMessage.errorMessage('please fill out required fields.');
        return
      }
      
     

      await this.eventSpecificForm.forEach(element => {
          if(element.type=='checkbox'){
            var checkBoxArr = [];
            element.selector.forEach(CheckBoxelement => {
              if(CheckBoxelement.is_check){
                checkBoxArr.push(CheckBoxelement.value)
              }
            });
            if(checkBoxArr.length > 0){
              element.value =  JSON.stringify(checkBoxArr); 
            }
          }
          if(element.value==''  && element.required){
            is_error = true;
          }
      });

      await this.attendeeForm.forEach(element => {
          if(element.type=='checkbox'){
            var checkBoxArr = [];
            element.selector.forEach(CheckBoxelement => {
              if(CheckBoxelement.is_check){
                checkBoxArr.push(CheckBoxelement.value)
              }
            });
            if(checkBoxArr.length > 0){
              element.value =  JSON.stringify(checkBoxArr); 
            }
          }
          if(element.value==''  && element.required){
            is_error = true;
          }
      });

      if(is_error){
        this.errorMessage.errorMessage('please fill out required fields.');
        return false;
      }
      
      var name = this.editTicket.get("name").value.split(" ");
      if(this.eventForm[2].addressForamteStyle == 'UK'){
        this.addressStyleArry = {
          "address1" : this.editTicket.get("address").value,
          "address2" : this.editTicket.get("address1").value,
          "address3" : this.editTicket.get("address2").value,
          "zipcode" : this.editTicket.get("zipcode").value,
          'style' : this.eventForm[2].addressForamteStyle
        }
      }else if(this.eventForm[2].addressForamteStyle == 'US'){
        this.addressStyleArry = {
          "address1" : this.editTicket.get("address").value,
          "city" : this.editTicket.get("address1").value,
          "state" : this.editTicket.get("address2").value,
          "zipcode" : this.editTicket.get("zipcode").value,
          'style' : this.eventForm[2].addressForamteStyle
        }
      }else if(this.eventForm[2].addressForamteStyle == 'Cadadian'){
        this.addressStyleArry = {
          "address1" : this.editTicket.get("address").value,
          "city" : this.editTicket.get("address1").value,
          "province" : this.editTicket.get("address2").value,
          "postalcode" : this.editTicket.get("zipcode").value,
          'style' : this.eventForm[2].addressForamteStyle
        }
      }

      let requestObject = {
        'event_id' : this.selectedEventCode,
        'boxoffice_id' : this.boxoffice_id,
        'order_id' : this.data.unique_code,
        'firstname' : name[0] ? name[0] : '',
        'lastname' : name[1] ? name[1] : '',
        'phone' : this.editTicket.get("phone").value,
        'email' : this.editTicket.get("email").value,
        'address' : JSON.stringify(this.addressStyleArry),
        // 'address' : this.editTicket.get("address").value,
        // 'address1' : this.editTicket.get("address1").value,
        // 'address2' : this.editTicket.get("address2").value,
        // 'zipcode' : this.editTicket.get("zipcode").value,
        "customer_info" : JSON.stringify(this.eventSpecificForm),
        'attendee_info' : JSON.stringify(this.attendeeForm)
      }

      this.isLoaderAdmin = true;

      this.superadminService.orderUpdate(requestObject).subscribe((response:any) => {
        if(response.data == true){
          this.errorMessage.successMessage(response.response);
          this.editTicket.reset();
          this.eventSpecificForm = null;
          this.attendeeForm = null;
          this.dialogRef.close();

        } else if(response.data == false){
          this.errorMessage.errorMessage(response.response);
        }
        this.isLoaderAdmin = false;
      });

    }

}



@Component({
  selector: 'confirm-payment-received',
  templateUrl: './confirm-payment-received.html',
})
export class ConfirmpaymentreceivedDialog { 
  
  transaction_id="";
  orderData:any = [];
  isLoaderAdmin:boolean=false;
  constructor(
    public dialogRef: MatDialogRef<ConfirmpaymentreceivedDialog>,
    public superadminService:SuperadminService,
    public errorService:ErrorService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.orderData = this.data;

    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {


  }

  fnUpdateStatus(){
    this.isLoaderAdmin = true;
    
    let requestObject={
      "unique_code": this.data.unique_code,
      "payment_status" :  "paid",
      "transaction_id": this.transaction_id 
    }

    this.superadminService.fnUpdatePaymentStatus(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.errorService.successMessage('Payment status updated.');
        this.dialogRef.close();
      }else{
        this.errorService.successMessage(response.response);
      }this.isLoaderAdmin = false;
    });
    
  }
}
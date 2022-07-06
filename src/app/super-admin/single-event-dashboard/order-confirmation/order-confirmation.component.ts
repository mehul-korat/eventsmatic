import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators,FormControl } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {SingleEventServiceService} from '../_services/single-event-service.service';
import { ErrorService } from '../../../_services/error.service';
import { AuthenticationService } from '../../../_services/authentication.service'
import {DomSanitizer} from '@angular/platform-browser';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-order-confirmation',
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.scss']
})
export class OrderConfirmationComponent implements OnInit {
isLoaderAdmin:boolean=false;
confirmationType :any ='GlobalOrderConfirmation';
attachEventInvoice = false;
ticketEventVouchersPDF = false;
currentUser:any;
globalOrderEmail:string = '';
eventOrderEmail:string = '';
boxOfficeCode = localStorage.getItem('boxoffice_id');   
event_id = localStorage.getItem('selectedEventCode');   
KisshtHtml;
eventOrderEmailPre;
eventDetail:any = [];
invoiceAddress:any;
invoiceValidation:boolean=false;
config: AngularEditorConfig = {
  editable: true,
  spellcheck: true,
  height: "15rem",
  minHeight: "5rem",
  placeholder: "Enter text here...",
  translate: "no",
  defaultParagraphSeparator: "p",
  defaultFontName: "Arial",
  toolbarHiddenButtons: [],
  sanitize: false,
  customClasses: [
    {
      name: "quote",
      class: "quote"
    },
    {
      name: "redText",
      class: "redText"
    },
    {
      name: "titleText",
      class: "titleText",
      tag: "h1"
    }
  ]
};
constructor(
  private _formBuilder: FormBuilder,
  private eventServiceService : SingleEventServiceService,
  private ErrorService: ErrorService,
  public dialog: MatDialog,
  private auth : AuthenticationService,
  private sanitizer:DomSanitizer

  ) { 
    this.auth.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit(): void {
    this.fnGetEventDetail();
    this.fngetEventEmail();
  }

  fnEditOrderConfirmation(event){
    this.isLoaderAdmin = true;
    this.confirmationType = event.value;
    let requestObjectconfirmationType = {
      "option_key": "confirmationType",
      "event_id" : this.event_id,
      "json_type":"Y",
      "option_value" : { 'confirmationType' : this.confirmationType }
    };
    this.eventServiceService.updateSetting(requestObjectconfirmationType).subscribe((response:any) => {
      if(response.data == true){
        this.ErrorService.successMessage(response.response);
      } else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
    });
    this.isLoaderAdmin = false;
  }

  fngetGlobleEmail(option_key){
    this.isLoaderAdmin = true;
    let requestObject = {
      "boxoffice_id": this.boxOfficeCode,
      "option_key": option_key,
      "event_id": 'null',
    };

    this.eventServiceService.getSettings(requestObject).subscribe((response:any) => {
      if(response.data == true){
          this.KisshtHtml = this.sanitizer.bypassSecurityTrustHtml(response.response);
      } else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
    });
    this.isLoaderAdmin = false;
  }

  fngetEventEmail(){
    this.isLoaderAdmin = true;
    let requestObject = {
      "boxoffice_id": "null",
      "option_key": 'event_confirmation',
      "event_id" : this.event_id,
    };

    this.eventServiceService.getSettings(requestObject).subscribe((response:any) => {
      if(response.data == true){
          this.eventOrderEmail = response.response;
          this.eventOrderEmailPre = this.sanitizer.bypassSecurityTrustHtml(response.response);
      } else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
    });

    let requestObjectData = {
      "boxoffice_id": "null",
      "option_key": "event_confirmation_setting",
      "event_id" : this.event_id,
    };

    this.eventServiceService.getSettings(requestObjectData).subscribe((response:any) => {
      if(response.data == true){
        let data  = JSON.parse(response.response);
        this.attachEventInvoice = data.attachInvoice;
        this.ticketEventVouchersPDF = data.ticketVouchersPDF;
      } else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
    });

    let requestObjectconfirmationType = {
      "boxoffice_id": "null",
      "option_key": "confirmationType",
      "event_id" : this.event_id,
    };

    this.eventServiceService.getSettings(requestObjectconfirmationType).subscribe((response:any) => {
      if(response.data == true){
        let data  = JSON.parse(response.response);
        this.confirmationType = data.confirmationType;
        
      } else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
    });
    let requestObjectInvoiceAddres = {
      "boxoffice_id": "null",
      "option_key": "invoive_address",
      "event_id" : this.event_id,
    };

    this.eventServiceService.getSettings(requestObjectInvoiceAddres).subscribe((response:any) => {
      if(response.data == true){
        this.invoiceAddress  = response.response
        
      } else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
    });
    this.isLoaderAdmin = false;

  }

  fnEventEmail(){
    if(this.invoiceAddress){
      var myValueData = this.invoiceAddress.split(/\r*\n/);
      if(myValueData.length > 7){
        this.invoiceValidation = true;
        this.ErrorService.errorMessage('Please correct Invoice Address, Too many lines. Maximum 6.');
        return;
      }
    }
    this.isLoaderAdmin = true;
    let requestObject = {
        "option_key": "event_confirmation",
        "json_type" : "N",
        "event_id" : this.event_id,
        "option_value" : this.eventOrderEmail
    };

    this.eventServiceService.updateSetting(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.ErrorService.successMessage(response.response);
      } else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
    });
    let requestObjectData = {
        "option_key": "event_confirmation_setting",
        "event_id" : this.event_id,
        "json_type":"Y",
        "option_value" : { 'ticketVouchersPDF' : this.ticketEventVouchersPDF, 'attachInvoice' : this.attachEventInvoice}
    };

    this.eventServiceService.updateSetting(requestObjectData).subscribe((response:any) => {
      if(response.data == true){
        this.ErrorService.successMessage(response.response);
      } else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
    });
    let invoiceRequestObject = {
        "option_key": "invoive_address",
        "event_id" : this.event_id,
        "json_type":"N",
        "option_value" : this.invoiceAddress
    };

    this.eventServiceService.updateSetting(invoiceRequestObject).subscribe((response:any) => {
      if(response.data == true){
        this.ErrorService.successMessage(response.response);
      } else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
    });
    this.fngetEventEmail();
    this.isLoaderAdmin = false;
  }

  fnGetEventDetail(){
    this.isLoaderAdmin = true;
    let requestObject = {
      'unique_code' : this.event_id,
    }
    this.eventServiceService.getSingleEvent(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.eventDetail = response.response.event[0];
        if(this.eventDetail.online_event == "Y"){
          this.fngetGlobleEmail('global_confirmation_online');
        }else{
          this.fngetGlobleEmail('global_confirmation');
        }
      } else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
    });
    this.isLoaderAdmin = false;
  }


}

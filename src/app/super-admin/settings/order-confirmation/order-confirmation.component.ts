import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators,FormControl } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {SettingService} from '../_services/setting.service';
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

  attachInvoice = false;
  ticketVouchersPDF = false;
  currentUser:any;
  globalOrderEmail:string = '';
  globalOrderEmailOnline:string = '';
  globalOrderPreOnline:any;
  boxOfficeCode = localStorage.getItem('boxoffice_id');   
  globalOrderPre:any;
  templateType:string = 'In-person';
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
    private SettingService : SettingService,
    private ErrorService: ErrorService,
    public dialog: MatDialog,
    private auth : AuthenticationService,
    private sanitizer:DomSanitizer

  ) { 
    this.auth.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit(): void {
    this.fngetGlobleEmail();
  }

  fngetGlobleEmail(){

    let requestObject = {
      "boxoffice_id": this.boxOfficeCode,
      "option_key": "global_confirmation",
      "event_id": 'null',
    };

    this.SettingService.getSettingsValue(requestObject).subscribe((response:any) => {
      if(response.data == true){
          this.globalOrderEmail = response.response;
          this.globalOrderPre = this.sanitizer.bypassSecurityTrustHtml(response.response);
      } else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
    });


    let reqObject = {
      "boxoffice_id": this.boxOfficeCode,
      "option_key": "global_confirmation_online",
      "event_id": 'null',
    };

    this.SettingService.getSettingsValue(reqObject).subscribe((response:any) => {
      if(response.data == true){
          this.globalOrderEmailOnline = response.response;
          this.globalOrderPreOnline = this.sanitizer.bypassSecurityTrustHtml(response.response);
      } else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
    });

    
    let requestObjectData = {
      "boxoffice_id": this.boxOfficeCode,
      "option_key": "global_confirmation_setting",
      "event_id": 'null',
    };

    this.SettingService.getSettingsValue(requestObjectData).subscribe((response:any) => {
      if(response.data == true){
        let data  = JSON.parse(response.response);
        this.attachInvoice = data.attachInvoice;
        this.ticketVouchersPDF = data.ticketVouchersPDF;

      } else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
    });

    let invoiceRequestObject = {
      "boxoffice_id": this.boxOfficeCode,
      "option_key": "invoive_address",
      "event_id": 'null',
    };

    this.SettingService.getSettingsValue(invoiceRequestObject).subscribe((response:any) => {
      if(response.data == true){
        this.invoiceAddress = response.response;

      } else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
    });

  }


  fnGlobleEmail(){

    if(this.globalOrderEmail == ''){
      this.ErrorService.errorMessage('Please Enter Global order confirmation.');
      return;
    }
    

    if(this.invoiceAddress){
      var myValueData = this.invoiceAddress.split(/\r*\n/);
      if(myValueData.length > 7){
        this.invoiceValidation = true;
        this.ErrorService.errorMessage('Please correct Invoice Address, Too many lines. Maximum 6.');
        return;
      }
    }
    
    

    /////////////// Update Email //////////////////

    let requestObject = {
        "boxoffice_id": this.boxOfficeCode,
        "option_key": this.templateType=='online' ? 'global_confirmation_online' : "global_confirmation",
        "json_type":"N",
        "option_value" : this.templateType=='online' ? this.globalOrderEmailOnline : this.globalOrderEmail, 
    };

    this.SettingService.updateSetting(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.ErrorService.successMessage(response.response);
      } else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
    });

    /////////////// Update Email Attachment //////////////////

    let requestObjectData = {
        "boxoffice_id": this.boxOfficeCode,
        "option_key": "global_confirmation_setting",
       // "event_id": 'null',
        "json_type":"Y",
        "option_value" : { 'ticketVouchersPDF' : this.ticketVouchersPDF, 'attachInvoice' : this.attachInvoice}
    };

    this.SettingService.updateSetting(requestObjectData).subscribe((response:any) => {
      if(response.data == true){
        this.ErrorService.successMessage(response.response);
      } else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
    });

    /////////////// Update Invoice Address //////////////////

    let invoiceRequestObject = {
        "boxoffice_id": this.boxOfficeCode,
        "option_key": "invoive_address",
       // "event_id": 'null',
        "json_type":"N",
        "option_value" : this.invoiceAddress
    };

    this.SettingService.updateSetting(invoiceRequestObject).subscribe((response:any) => {
      if(response.data == true){
        this.ErrorService.successMessage(response.response);
      } else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
    });


  }


}

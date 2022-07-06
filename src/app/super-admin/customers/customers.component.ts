import { Component, OnInit,Inject} from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormControl} from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { SuperadminService } from '../_services/superadmin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorService } from '../../_services/error.service';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { Router, RouterOutlet ,ActivatedRoute} from '@angular/router';
import { map, catchError } from 'rxjs/operators';
import { AuthenticationService } from '../../_services/authentication.service';
import { environment } from '../../../environments/environment';
import { ExportToCsv } from 'export-to-csv';
import { ConfirmationDialogComponent } from '../../_components/confirmation-dialog/confirmation-dialog.component';
import { DatePipe} from '@angular/common';
import * as moment from 'moment'; 
import {MatChipInputEvent} from '@angular/material/chips';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Observable, throwError } from 'rxjs';

export interface DialogData {
  animal: string;
  name: string;
}

export interface Tag {
  
}

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
  providers: [DatePipe]
})
export class CustomersComponent implements OnInit {
  addCustomerForm:FormGroup;
  onlynumeric = /^-?(0|[1-9]\d*)?$/
  boxofficeId:any;
  customerDetails:any;
  selectedCustomerDetails:any;
  updateResponseMsg:any;
  selectedCustomerCode:any;
  editCustomerForm:boolean = false;
  deleteCustomer:any;
  isLoaderAdmin:boolean = false;
  selectedCustomerArr:any;
  addFormButtonDiv : boolean = true;
  customerImageUrl:any;
  allEventListData:any;
  filterEventlist:any;
  filterCustomerEvent:any = '';
  selecetdFilterCustomer:any = 'all';
  search = {
    keyword: ""
  };
  lastEventDateTime:any;
  addNewTag: boolean = false;
  tagsnew: any=[];
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  tags: Tag[] = [];
  currentUser:any;
  eventActiveTab = 'all';
  editAddressType:any='US'
  keepMe:any;
  addressArr = {
    'address': 'Address Line 1',
    'address1': 'City',
    'address2': 'State',
    'zipcode': 'Zip Code',
  };
  constructor(
    private formBuilder:FormBuilder,
    private SuperadminService : SuperadminService,
    public router: Router,
    private ErrorService: ErrorService,
    public dialog: MatDialog,
    private _snackBar:MatSnackBar,
    private datePipe: DatePipe,
  ) {
    this.keepMe = localStorage.getItem('keepMeSignIn')
    if (this.keepMe == 'true') {
      this.currentUser =  JSON.parse(localStorage.getItem('currentUser'))
    } else {
      this.currentUser =  JSON.parse(sessionStorage.getItem('currentUser'))
    }
    // this.currentUser = JSON.parse(this.currentUser);

    let newCustomerAction = window.location.search.split("?customer")
    if(newCustomerAction.length > 1){
        this.addFormButtonDiv=false;
    }

    if(this.currentUser.type == 'member' && this.currentUser.permission != 'A'){
      this.router.navigate(['/super-admin']);
    }

    if(localStorage.getItem('boxoffice_id')){
      this.boxofficeId = localStorage.getItem('boxoffice_id');
    }else{
      this.ErrorService.errorMessage('Select Box-office first.');
      this.router.navigate(["/super-admin/boxoffice"]);
    }
    
    let emailPattern=/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/ 
    this.addCustomerForm = this.formBuilder.group({
		  cust_name:['',Validators.required],
      phone:['',[Validators.required,Validators.pattern(this.onlynumeric),Validators.minLength(6),Validators.maxLength(15)]],
      email:['',[Validators.required,Validators.email,Validators.pattern(emailPattern)]],
      // address:['',[Validators.required]],
      address:["", Validators.required],
      address1:["", Validators.required],
      address2:["", Validators.required],
      zipcode:["", [Validators.required,Validators.minLength(5),Validators.maxLength(7)]],
      tags:[''],
    });  
   }
	
	add(event: MatChipInputEvent): void {
      const input = event.input;
      const value = event.value;
      
      // Add our fruit
      if ((value || '').trim()) {
        this.tags.push(value);
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }
      console.log(this.tags);
      
    }

    remove(tg: Tag): void {
      const index = this.tags.indexOf(tg);

      if (index >= 0) {
        this.tags.splice(index, 1);
      }
      console.log(this.tags);
    }
	
   onTabChange(event){
    let clickedIndex = event.index;
    if(clickedIndex == 0){      
    }else if(clickedIndex == 1){      
    }
  }
   

  addFormButton(){
    this.addFormButtonDiv = this.addFormButtonDiv ? false : true;
    this.addCustomerForm.reset();
    this.editCustomerForm =false; 
    this.fnSelectCustomer(this.selectedCustomerCode);
    
  }

  customerSearch(){
    this.getAllCustomersDetails();
  }
  
  ngOnInit(): void {
    this.getAllCustomersDetails();
    this. fngetCustomersEventlist();
  }

  ImportFileUpload() {
    const dialogRef = this.dialog.open(DialogImportFileUpload, {
      width: '500px',
      
    });

     dialogRef.afterClosed().subscribe(result => {
       this.getAllCustomersDetails();
     });
  }

  fnChangeImage(){
    const dialogRef = this.dialog.open(DialogCustomerImageUpload, {
      width: '500px',
      
    });
  
     dialogRef.afterClosed().subscribe(result => {
        if(result != undefined){
            this.customerImageUrl = result;
            //console.log(result);
           }
     });
  }

  submitForm(){	 
    if(this.addCustomerForm.invalid){
      console.log(this.addCustomerForm)
      //this.addCustomerForm.get("firstname").markAsTouched();
      //this.addCustomerForm.get("lastname").markAsTouched();
	  this.addCustomerForm.get("cust_name").markAsTouched();
      this.addCustomerForm.get("phone").markAsTouched();
      this.addCustomerForm.get("email").markAsTouched();
      this.addCustomerForm.get("address").markAsTouched();
      this.addCustomerForm.get("tags").markAsTouched();
      return false;
    }else{
      if(this.editCustomerForm == true){
        if(this.customerImageUrl){
          var cust_name = this.addCustomerForm.get('cust_name').value;
          var cust_name = cust_name.split(" ");
          var firstname=cust_name[0];
          var lastname=cust_name[1];
          if(cust_name[1]=='undefined' || cust_name[1]==undefined){
            lastname="";
          }
         

          let requestObject={			
            "firstname":firstname,
            "lastname":lastname,			
            "email":this.addCustomerForm.get('email').value,
            "phone":this.addCustomerForm.get('phone').value,
            "image": this.customerImageUrl,
            "unique_code": this.selectedCustomerCode,
			      "tags": JSON.stringify(this.tags),           
            "boxoffice_id": this.boxofficeId,
            "uk_address": null,
            "usa_address": null,
            "ca_address": null,
          }; 
          
          let addressStyleArry = {}
          if(this.editAddressType == 'UK'){
            addressStyleArry = {
              "address1" : this.addCustomerForm.get("address").value,
              "address2" : this.addCustomerForm.get("address1").value,
              "address3" : this.addCustomerForm.get("address2").value,
              "zipcode" : this.addCustomerForm.get("zipcode").value,
              'style' : this.editAddressType
            }
            requestObject['uk_address'] = addressStyleArry;
          }else if(this.editAddressType == 'US'){
            addressStyleArry = {
              "address1" : this.addCustomerForm.get("address").value,
              "city" : this.addCustomerForm.get("address1").value,
              "state" : this.addCustomerForm.get("address2").value,
              "zipcode" : this.addCustomerForm.get("zipcode").value,
              'style' : this.editAddressType
            }
            requestObject['usa_address'] = addressStyleArry;
          }else if(this.editAddressType == 'Cadadian'){
            addressStyleArry = {
              "address1" : this.addCustomerForm.get("address").value,
              "city" : this.addCustomerForm.get("address1").value,
              "province" : this.addCustomerForm.get("address2").value,
              "postalcode" : this.addCustomerForm.get("zipcode").value,
              'style' : this.editAddressType
            }
            requestObject['ca_address'] = addressStyleArry;
          }
          console.log(requestObject)
          this.fnUpdateCustomer(requestObject)
        }else{
          var cust_name = this.addCustomerForm.get('cust_name').value;
		  var cust_name = cust_name.split(" ");
		  var firstname=cust_name[0];
		  var lastname=cust_name[1];
		  if(cust_name[1]=='undefined' || cust_name[1]==undefined){
			  lastname="";
		  }
          let requestObject={			
            "firstname":firstname,
            "lastname":lastname,			
            "email":this.addCustomerForm.get('email').value,
            "phone":this.addCustomerForm.get('phone').value,
            "unique_code": this.selectedCustomerCode,
			      "tags": JSON.stringify(this.tags),            
            "boxoffice_id": this.boxofficeId,
            "uk_address": null,
            "usa_address": null,
            "ca_address": null,
          };
          
          let addressStyleArry = {}
          if(this.editAddressType == 'UK'){
            addressStyleArry = {
              "address1" : this.addCustomerForm.get("address").value,
              "address2" : this.addCustomerForm.get("address1").value,
              "address3" : this.addCustomerForm.get("address2").value,
              "zipcode" : this.addCustomerForm.get("zipcode").value,
              'style' : this.editAddressType
            }
            requestObject['uk_address'] = addressStyleArry;
          }else if(this.editAddressType == 'US'){
            addressStyleArry = {
              "address1" : this.addCustomerForm.get("address").value,
              "city" : this.addCustomerForm.get("address1").value,
              "state" : this.addCustomerForm.get("address2").value,
              "zipcode" : this.addCustomerForm.get("zipcode").value,
              'style' : this.editAddressType
            }
            requestObject['usa_address'] = addressStyleArry;
          }else if(this.editAddressType == 'Cadadian'){
            addressStyleArry = {
              "address1" : this.addCustomerForm.get("address").value,
              "city" : this.addCustomerForm.get("address1").value,
              "province" : this.addCustomerForm.get("address2").value,
              "postalcode" : this.addCustomerForm.get("zipcode").value,
              'style' : this.editAddressType
            }
            requestObject['ca_address'] = addressStyleArry;
          }
          console.log(requestObject)
          this.fnUpdateCustomer(requestObject)
        }
      }else if(this.editCustomerForm == false){
        if(this.customerImageUrl){
          var cust_name = this.addCustomerForm.get('cust_name').value;
          var cust_name = cust_name.split(" ");
          var firstname=cust_name[0];
          var lastname=cust_name[1];
          if(cust_name[1]=='undefined' || cust_name[1]==undefined){
            lastname="";
          }
          let requestObject={			
            "firstname":firstname,
            "lastname":lastname,			
            "phone": this.addCustomerForm.get("phone").value,
            "email": this.addCustomerForm.get("email").value,
			      "tags": JSON.stringify(this.tags),
            "image": this.customerImageUrl,
            "boxoffice_id": this.boxofficeId,
            "uk_address": null,
            "usa_address": null,
            "ca_address": null,
          } //"tags": this.addCustomerForm.get("tags").value,

          
          let addressStyleArry = {}
          if(this.editAddressType == 'UK'){
            addressStyleArry = {
              "address1" : this.addCustomerForm.get("address").value,
              "address2" : this.addCustomerForm.get("address1").value,
              "address3" : this.addCustomerForm.get("address2").value,
              "zipcode" : this.addCustomerForm.get("zipcode").value,
              'style' : this.editAddressType
            }
            requestObject['uk_address'] = addressStyleArry;
          }else if(this.editAddressType == 'US'){
            addressStyleArry = {
              "address1" : this.addCustomerForm.get("address").value,
              "city" : this.addCustomerForm.get("address1").value,
              "state" : this.addCustomerForm.get("address2").value,
              "zipcode" : this.addCustomerForm.get("zipcode").value,
              'style' : this.editAddressType
            }
            requestObject['usa_address'] = addressStyleArry;
          }else if(this.editAddressType == 'Cadadian'){
            addressStyleArry = {
              "address1" : this.addCustomerForm.get("address").value,
              "city" : this.addCustomerForm.get("address1").value,
              "province" : this.addCustomerForm.get("address2").value,
              "postalcode" : this.addCustomerForm.get("zipcode").value,
              'style' : this.editAddressType
            }
            requestObject['ca_address'] = addressStyleArry;
          }
          console.log(requestObject)
		  
          this.fnCreateCustomer(requestObject)
        }else{
          var cust_name = this.addCustomerForm.get('cust_name').value;
          var cust_name = cust_name.split(" ");
          var firstname=cust_name[0];
          var lastname=cust_name[1];
          if(cust_name[1]=='undefined' || cust_name[1]==undefined){
            lastname="";
          }
          let requestObject={			
            "firstname":firstname,
            "lastname":lastname,
            "phone": this.addCustomerForm.get("phone").value,
            "email": this.addCustomerForm.get("email").value,
            "tags": JSON.stringify(this.tags),
            "boxoffice_id": this.boxofficeId,
            "uk_address": null,
            "usa_address": null,
            "ca_address": null,
          }
          let addressStyleArry = {}
          if(this.editAddressType == 'UK'){
            addressStyleArry = {
              "address1" : this.addCustomerForm.get("address").value,
              "address2" : this.addCustomerForm.get("address1").value,
              "address3" : this.addCustomerForm.get("address2").value,
              "zipcode" : this.addCustomerForm.get("zipcode").value,
              'style' : this.editAddressType
            }
            requestObject['uk_address'] = addressStyleArry;
          }else if(this.editAddressType == 'US'){
            addressStyleArry = {
              "address1" : this.addCustomerForm.get("address").value,
              "city" : this.addCustomerForm.get("address1").value,
              "state" : this.addCustomerForm.get("address2").value,
              "zipcode" : this.addCustomerForm.get("zipcode").value,
              'style' : this.editAddressType
            }
            requestObject['usa_address'] = addressStyleArry;
          }else if(this.editAddressType == 'Cadadian'){
            addressStyleArry = {
              "address1" : this.addCustomerForm.get("address").value,
              "city" : this.addCustomerForm.get("address1").value,
              "province" : this.addCustomerForm.get("address2").value,
              "postalcode" : this.addCustomerForm.get("zipcode").value,
              'style' : this.editAddressType
            }
            requestObject['ca_address'] = addressStyleArry;
          }
          console.log(requestObject)
          this.fnCreateCustomer(requestObject)
        }
      }
    }
  }
  
	fnAddNewTag(){
    this.addNewTag = true;
  }  
  
  fnCreateCustomer(requestObject){
    this.isLoaderAdmin = true;
    this.SuperadminService.createCustomersForm(requestObject).subscribe((response:any) => {
    if(response.data == true){
      this.ErrorService.successMessage(response.response.message);
      if(this.tags.length && this.tags.length > 0){
        this.tags.length = 0;
      }
      this.addCustomerForm.reset();
      this.customerImageUrl = null;
	  this.selectedCustomerCode =  response.response.unique_code;
      this.getAllCustomersDetails(this.selectedCustomerCode);
	  
      //this.fnSelectCustomer(this.selectedCustomerCode);
      this.addFormButtonDiv = this.addFormButtonDiv ? false : true;
    }else if(response.data == false){
      this.ErrorService.errorMessage(response.response);     
      }
    this.isLoaderAdmin = false;
    });
 }

 
 getAllCustomersDetails(unique_code=""){
    
    this.isLoaderAdmin = true;
    
    let requestObject ={
      'search':this.search.keyword,
      "boxoffice_id": this.boxofficeId,
      "event_id":this.filterCustomerEvent,
    };
     
    this.SuperadminService.getAllCustomersDetails(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.customerDetails = response.response;
		
        if(unique_code==""){
            this.selectedCustomerCode =  this.customerDetails[0].unique_code
        }
        let newCustomerAction = window.location.search.split("?customer")
        if(newCustomerAction.length > 1){
            this.addFormButtonDiv=false;
        }else{
          this.fnSelectCustomer(this.selectedCustomerCode);
        }
      }else if(response.data == false){
        // this.ErrorService.errorMessage(response.response);
        this.customerDetails = null;
        this.addFormButtonDiv = false;
      }
      this.isLoaderAdmin = false;
    });
}

 editCustomerDetails(){
  this.addFormButtonDiv = this.addFormButtonDiv ? false : true;  
  this.editCustomerForm = true;
  this.isLoaderAdmin = true;
  let requestObject = {
    "unique_code": this.selectedCustomerCode,
  };
  this.SuperadminService.getSingleCustomersDetails(requestObject).subscribe((response:any) => {
    
    if(response.data == true){
      this.selectedCustomerDetails = response.response.customer;
      console.log('this.selectedCustomerDetails',this.selectedCustomerDetails)
      this.selectedCustomerDetails.formatedAddress = '';
      if(this.selectedCustomerDetails.usa_address){
        this.editAddressType = 'US';
        console.log(this.editAddressType)
        this.selectedCustomerDetails.formatedAddress = JSON.parse(this.selectedCustomerDetails.usa_address);
        this.addressArr = {
          'address': 'Address Line 1',
          'address1': 'City',
          'address2': 'State',
          'zipcode': 'Zip Code',
        };
        console.log(this.selectedCustomerDetails.formatedAddress)
        console.log(this.selectedCustomerDetails.formatedAddress.address1)
        this.addCustomerForm.controls['address'].setValue(this.selectedCustomerDetails.formatedAddress.address1)
        this.addCustomerForm.controls['address1'].setValue(this.selectedCustomerDetails.formatedAddress.city)
        this.addCustomerForm.controls['address2'].setValue(this.selectedCustomerDetails.formatedAddress.state)
        this.addCustomerForm.controls['zipcode'].setValue(this.selectedCustomerDetails.formatedAddress.zipcode)
      }else if(this.selectedCustomerDetails.uk_address){
        this.editAddressType = 'UK';
        this.addressArr = {
          'address': 'Address Line 1',
          'address1': 'Address Line 2',
          'address2': 'Address Line 3',
          'zipcode': 'Zip Code',
        };
        this.selectedCustomerDetails.formatedAddress = JSON.parse(this.selectedCustomerDetails.uk_address);
        this.addCustomerForm.controls['address'].setValue(this.selectedCustomerDetails.formatedAddress.address1)
        this.addCustomerForm.controls['address1'].setValue(this.selectedCustomerDetails.formatedAddress.address2)
        this.addCustomerForm.controls['address2'].setValue(this.selectedCustomerDetails.formatedAddress.address3)
        this.addCustomerForm.controls['zipcode'].setValue(this.selectedCustomerDetails.formatedAddress.zipcode)
      }else if(this.selectedCustomerDetails.ca_address){
        this.editAddressType = 'CA';
        this.addressArr = {
          'address': 'Address Line 1',
          'address1': 'City',
          'address2': 'Province',
          'zipcode': 'Postal Code',
        };
        this.selectedCustomerDetails.formatedAddress = JSON.parse(this.selectedCustomerDetails.ca_address);
        this.addCustomerForm.controls['address'].setValue(this.selectedCustomerDetails.formatedAddress.address1)
        this.addCustomerForm.controls['address1'].setValue(this.selectedCustomerDetails.formatedAddress.city)
        this.addCustomerForm.controls['address2'].setValue(this.selectedCustomerDetails.formatedAddress.province)
        this.addCustomerForm.controls['zipcode'].setValue(this.selectedCustomerDetails.formatedAddress.postalcode)
      }
      console.log(this.addCustomerForm)
      if(this.selectedCustomerDetails.lastname!=''){
        this.addCustomerForm.controls['cust_name'].setValue(this.selectedCustomerDetails.firstname+' '+this.selectedCustomerDetails.lastname)
      }else{
        this.addCustomerForm.controls['cust_name'].setValue(this.selectedCustomerDetails.firstname)
      }
      this.addCustomerForm.controls['email'].setValue(this.selectedCustomerDetails.email)
      this.addCustomerForm.controls['phone'].setValue(this.selectedCustomerDetails.phone)
      //this.addCustomerForm.controls['tags'].setValue(JSON.parse(this.selectedCustomerDetails.tags))
      if(this.selectedCustomerDetails.tags && (this.selectedCustomerDetails.tags != '' || this.selectedCustomerDetails.tags != null)){
	      this.tags = JSON.parse(this.selectedCustomerDetails.tags);
      }
      // this.customerImageUrl.setValue(this.selectedCustomerDetails.image)
      
    }  else if(response.data == false){
      this.selectedCustomerDetails = null;
      this.ErrorService.errorMessage(response.response);
    }
  this.isLoaderAdmin = false;
  });
}

fnSelectCustomer(selectedCustomerCode){

  this.isLoaderAdmin = true;
  this.selectedCustomerCode = selectedCustomerCode;
    
  if(!selectedCustomerCode){
    return false;
  }

  let requestObject =  {
    "unique_code": selectedCustomerCode,
  };
  this.SuperadminService.getSingleCustomersDetails(requestObject).subscribe((response:any) => {
    if(response.data == true){
      this.selectedCustomerDetails = response.response.customer;
      this.allEventListData = response.response;
      if(this.selectedCustomerDetails.tags && (this.selectedCustomerDetails.tags != '' || this.selectedCustomerDetails.tags != null)){
        console.log(this.selectedCustomerDetails.tags);
        this.selectedCustomerDetails.tags = JSON.parse(this.selectedCustomerDetails.tags);
      }
      if(this.allEventListData.lastOrder){

      this.lastEventDateTime = moment(this.allEventListData.lastOrder.start_date +' '+this.allEventListData.lastOrder.start_time).format('d MMM y, hh:mm a');
      }
      if(this.selectedCustomerDetails.uk_address){
        this.selectedCustomerDetails.uk_address = JSON.parse(this.selectedCustomerDetails.uk_address)
        console.log(this.selectedCustomerDetails.uk_address)
      }
      if(this.selectedCustomerDetails.ca_address){
        this.selectedCustomerDetails.ca_address = JSON.parse(this.selectedCustomerDetails.ca_address)
        console.log(this.selectedCustomerDetails.ca_address)
      }
      console.log(this.selectedCustomerDetails.usa_address)
      if(this.selectedCustomerDetails.usa_address){
        this.selectedCustomerDetails.usa_address = JSON.parse(this.selectedCustomerDetails.usa_address)
        console.log(this.selectedCustomerDetails.usa_address)
      }
      // this.lastEventDateTime = this.datePipe.transform(new Date(this.allEventListData.lastOrder.start_date), 'MMM d, y')+', '+this.datePipe.transform(new Date(this.allEventListData.lastOrder.start_time), 'h:mm:ss a')
      this.addFormButtonDiv = true;
    }else if(response.data == false){
      this.ErrorService.errorMessage(response.response);
    }
    this.isLoaderAdmin = false;
  });
  
}


fnUpdateCustomer(requestObject){	
  this.isLoaderAdmin = true;
    this.SuperadminService.updateCustomerDetails(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.updateResponseMsg = response.response.message;
        this.editCustomerForm = false;
        this.ErrorService.successMessage(this.updateResponseMsg);
        this.tags.length = 0;
        this.addCustomerForm.reset();
        this.customerImageUrl = null;
        this.selectedCustomerCode =  response.response.unique_code;
        this.getAllCustomersDetails(this.selectedCustomerCode);
        this.addFormButtonDiv = this.addFormButtonDiv ? false : true;
      }else if(response.data == false){
        this.ErrorService.errorMessage(response.response.message);
      }
      this.isLoaderAdmin = false;
    });
}


deleteCustomerDetails(){
  const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
    width: '400px',
    data: "Are you sure you want to delete Customer?"
  });
  dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.fnDeleteCustomer();
      }
  });
}


  fnDeleteCustomer(){
    this.isLoaderAdmin = true;
    let requestObject={
      "unique_code": this.selectedCustomerCode,
    }
    this.SuperadminService.deleteCustomerDetails(requestObject).subscribe((response:any)=>{
      if(response.data == true){
        // this.deleteCustomer = response.response
        this.ErrorService.successMessage(response.response);
        this.getAllCustomersDetails();
      }else if(response.data == false){
        this.ErrorService.errorMessage(response.response);

      }
      this.isLoaderAdmin = false;
    });
  }

  ExportFile(){
    const options = { 
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true, 
      showTitle: false,
      filename: 'Exported Customers',
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
    };
    const csvExporter = new ExportToCsv(options);
    this.isLoaderAdmin = true;
    let requestObject ={
      "boxoffice_id": this.boxofficeId,
      "event_id": this.selecetdFilterCustomer,
    };
    this.SuperadminService.fnExportCustomer(requestObject).subscribe((response:any)=>{
      if(response.data == true){
        this.selectedCustomerArr = response.response
        csvExporter.generateCsv(this.selectedCustomerArr);
      }
      else if(response.data == false && response.response !== 'api token or userid invaild'){
        this._snackBar.open(response.response, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass : ['red-snackbar']
        });
      }
        this.isLoaderAdmin = false;
    });
  }
  
  
  eventList(selectedTab){

    this.eventActiveTab = selectedTab;

    this.isLoaderAdmin = true;
    let requestObject = {
      "unique_code": this.selectedCustomerCode
    }
    this.SuperadminService.getSingleCustomersDetails(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.allEventListData = response.response
      
      }else if(response.data == false){
        this.allEventListData.length = 0;
        // this.ErrorService.errorMessage(response.response);
      }
    this.isLoaderAdmin = false;
    });
  }

  fnFilterCustomer(event){
    this.selecetdFilterCustomer = event.value
    if(event.value == 'all'){
      this.filterCustomerEvent = '';
      this.getAllCustomersDetails();
    }else{
      this.filterCustomerEvent = event.value
      this.getAllCustomersDetails();
    }
  }

  fngetCustomersEventlist(){
    this.isLoaderAdmin = true;
    let requestObject ={
      "boxoffice_id":this.boxofficeId,
    }
    this.SuperadminService. fngetCustomersEventlist(requestObject).subscribe((response:any) =>{
      if(response.data == true){
        this.filterEventlist = response.response
        //console.log(this.filterEventlist);
      }
    this.isLoaderAdmin = false;
    });
  }

}


@Component({
  selector: 'import-file-upload',
  templateUrl: '../_dialogs/import-file-upload.html',
})

export class DialogImportFileUpload { 
  boxOfficeCode:any;
  fileToUpload:any;
  boxofficeId:any;
  isLoaderAdmin:boolean = false;
  importCustomer:any;
  fileDanger : boolean = false;
  currentUser:any;
 constructor(
  public dialogRef: MatDialogRef<DialogImportFileUpload>,
  public http: HttpClient,
  private _snackBar: MatSnackBar,
  private authenticationService : AuthenticationService,
  private ErrorService: ErrorService,
  private SuperadminService : SuperadminService,
  @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    if(localStorage.getItem('boxoffice_id')){
      this.boxofficeId = localStorage.getItem('boxoffice_id');   
    }
    
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  private handleError(error: HttpErrorResponse) {
    return throwError('Error! something went wrong.');
  }

  handleFileInput(files): void {
    
    this.fileToUpload = files.item(0);
    console.log(this.fileToUpload)
    if(this.fileToUpload.type != "application/vnd.ms-excel"){
      this.fileDanger = true;
      this._snackBar.open("Please select CSV file", "X", {
        duration: 2000,
        verticalPosition:'top',
        panelClass :['red-snackbar']
      });
      return;
    }else{
      
      this.fileDanger = false;
    }

  }

  fileupload(){
    
    if(this.fileToUpload.type != "application/vnd.ms-excel"){

      this._snackBar.open("Please select CSV file", "X", {
        duration: 2000,
        verticalPosition:'top',
        panelClass :['red-snackbar']
      });
      return;
    }
    
    const formData =  new FormData();
    formData.append('file', this.fileToUpload);
    formData.append('boxoffice_id',(this.boxofficeId));

    this.isLoaderAdmin = true;
    this.SuperadminService.fnImportCustomer(formData).subscribe((response:any)=>{
      if(response.data == true){
        this.importCustomer = response.response
        this.ErrorService.successMessage(response.response);
        this.dialogRef.close();
      }else if(response.data == false){
        this.ErrorService.errorMessage(response.response);

      }
      this.isLoaderAdmin = false;
    });


  //  let requestObject={
  //    "boxoffice_id":this.boxofficeId,
  //    "file":this.fileToUpload,
  //  }
   
   
  // this.isLoaderAdmin = true;
  // const formData: FormData = new FormData();
  // formData.append('file', this.fileToUpload);
  // formData.append('boxoffice_id',(this.boxofficeId));

  // let headers = new HttpHeaders({
  //   'Content-Type': 'application/json',
  //   'admin-id' : this.currentUser.user_id,
  //   'api-token' : this.currentUser.token
  // });

  // this.http.post(`${environment.apiUrl}/import-customers`,formData ,{}).pipe(map((response : any) =>{
  //   this.isLoaderAdmin = false;
  //   if(response.data  == true){
  //     this._snackBar.open("CSV file is uploaded", "X", {
  //       duration: 2000,
  //       verticalPosition:'top',
  //       panelClass :['green-snackbar']
  //     });
  //     this.dialogRef.close();
  //   }
  // }),catchError(this.handleError)).subscribe((res) => {
  //   this.isLoaderAdmin = false;
  // });  
  

    
}

}

@Component({
  selector: 'customer-image-upload',
  templateUrl: '../_dialogs/image-upload.html',
})
export class DialogCustomerImageUpload {

  uploadForm: FormGroup;  
  imageSrc: string;
  profileImage: string;
  
constructor(
  public dialogRef: MatDialogRef<DialogCustomerImageUpload>,
  private _formBuilder:FormBuilder,
  private _snackBar:MatSnackBar,
  @Inject(MAT_DIALOG_DATA) public data: any) {}

  onNoClick(): void {
      this.dialogRef.close(this.profileImage);
    }
    ngOnInit() {
      this.uploadForm = this._formBuilder.group({
        profile: ['']
      });
    }
    get f() {
      return this.uploadForm.controls;
    }
    
onFileChange(event) {
  const reader = new FileReader();
  if (event.target.files && event.target.files.length) {
    if(event.target.files[0].type == 'image/jpeg' || event.target.files[0].type == 'image/png' || event.target.files[0].type == 'image/jpg'){
      //console.log(event.target.files)
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
          this.imageSrc = reader.result as string;
          this.uploadForm.patchValue({
              fileSource: reader.result
          });
      };
    }else{
      this._snackBar.open('Only JPEG, JPG, PNG files is allowed.', "X", {
        duration: 2000,
        verticalPosition: 'top',
        panelClass : ['red-snackbar']
      });
      event.target.files = undefined
      return false
    }
    
  }
}
uploadImage() {
  this.profileImage = this.imageSrc
  this.imageSrc= null;
  this.dialogRef.close(this.profileImage);
}


}
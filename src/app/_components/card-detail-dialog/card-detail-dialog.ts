import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { ServiceService } from '../../_services/service.service';
import { ErrorService } from '../../_services/error.service';
import { SettingService } from '../../super-admin/settings/_services/setting.service';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './card-detail-dialog.html',
  styleUrls: ['./card-detail-dialog.scss']
})
export class CardDetailDialogComponent implements OnInit {
  cardDetail:FormGroup;
  currentYear:any= new Date().getFullYear()
  exYearList:any=[];
  countryList:any=[];
  isLoaderAdmin:boolean=false;
  status:any;
  constructor(public dialogRef: MatDialogRef<CardDetailDialogComponent>,
    private _formBuilder:FormBuilder,
    private serviceService: ServiceService,
    private errorService: ErrorService,
    private settingService: SettingService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      console.log(this.data)
      this.status = this.data.status;
      for(let i = 0; i<20; i++){
        let year = this.currentYear+i;
        this.exYearList.push(year) 
      }
      
     }

  ngOnInit() { 
    this.getAllCountry();
  	this.cardDetail = this._formBuilder.group({
      firstname:['',[Validators.required]],
      lastname:['',[Validators.required]],
      number:['',[Validators.required, Validators.minLength(16), Validators.maxLength(16)]],
      exMonth:['',[Validators.required]],
      exYear:['',[Validators.required]],
      cvv:['',[Validators.required,Validators.minLength(3), Validators.maxLength(3)]],
      address1:['',[Validators.required]],
      address2:[''],
      city:['',[Validators.required]],
      zip:['',[Validators.required]],
      state:['',[Validators.required]],
      country:['',[Validators.required]],
    })
  }
  
onNoClick(): void {
    this.dialogRef.close();
  }

  getAllCountry(){
    this.isLoaderAdmin = true;
    this.serviceService.getAllCountry().subscribe((response:any) => {
      if(response.data == true){
        this.countryList = response.response;
      }
      else if(response.data == false){
        this.errorService.errorMessage(response.response)
      }
      this.isLoaderAdmin = false;
    })
  }



  submitCard(){
    if(this.cardDetail.invalid){
      this.cardDetail.get("firstname").markAsTouched();
      this.cardDetail.get("lastname").markAsTouched();
      this.cardDetail.get("number").markAsTouched();
      this.cardDetail.get("exMonth").markAsTouched();
      this.cardDetail.get("exYear").markAsTouched();
      this.cardDetail.get("cvv").markAsTouched();
      this.cardDetail.get("address1").markAsTouched();
      this.cardDetail.get("address2").markAsTouched();
      this.cardDetail.get("city").markAsTouched();
      this.cardDetail.get("zip").markAsTouched();
      this.cardDetail.get("state").markAsTouched();
      this.cardDetail.get("country").markAsTouched();
      return false;
    }
    if(this.status == 'new'){
      let requestObject = {
        'boxoffice_code':localStorage.getItem('boxoffice_id'), 
        'card_first_name' : this.cardDetail.get("firstname").value,
        'card_last_name' : this.cardDetail.get("lastname").value,
        'card_number' : this.cardDetail.get("number").value,
        'expiry_month' : this.cardDetail.get("exMonth").value,
        'expiry_year' : this.cardDetail.get("exYear").value,
        'cvv' : this.cardDetail.get("cvv").value,
        'card_address' : this.cardDetail.get("address1").value,
        'card_address2' : this.cardDetail.get("address2").value,
        'card_city' : this.cardDetail.get("city").value,
        'card_zip' : this.cardDetail.get("zip").value,
        'card_state' : this.cardDetail.get("state").value,
        'card_country' : this.cardDetail.get("country").value,
      }
      this.addCard(requestObject);
    }else if(this.status == 'update'){
      let requestObject = {
        'boxoffice_code':localStorage.getItem('boxoffice_id'), 
        'first_name' : this.cardDetail.get("firstname").value,
        'last_name' : this.cardDetail.get("lastname").value,
        'card_number' : this.cardDetail.get("number").value,
        'expiry_month' : this.cardDetail.get("exMonth").value,
        'expiry_year' : this.cardDetail.get("exYear").value,
        'cvv' : this.cardDetail.get("cvv").value,
        'card_address' : this.cardDetail.get("address1").value,
        'card_address2' : this.cardDetail.get("address2").value,
        'billing_city' : this.cardDetail.get("city").value,
        'billing_zip' : this.cardDetail.get("zip").value,
        'billing_state' : this.cardDetail.get("state").value,
        'billing_country' : this.cardDetail.get("country").value,
      }
      this.updateCard(requestObject);
    }
   
  }

  addCard(requestObject){
     this.isLoaderAdmin = true;
    this.settingService.submitCardDetail(requestObject).subscribe((response:any) => {
      if(response.data == true){
        // this.countryList = response.response;
        this.errorService.successMessage(response.response)
        this.dialogRef.close('success');
      }
      else if(response.data == false){
        this.errorService.errorMessage(response.response)
      }
      this.isLoaderAdmin = false;
    })
  }

  updateCard(requestObject){
     this.isLoaderAdmin = true;
    this.settingService.updateCardDetail(requestObject).subscribe((response:any) => {
      if(response.data == true){
        // this.countryList = response.response;
        this.errorService.successMessage(response.response)
        this.dialogRef.close('success');
      }
      else if(response.data == false){
        this.errorService.errorMessage(response.response)
      }
      this.isLoaderAdmin = false;
    })
  }
}

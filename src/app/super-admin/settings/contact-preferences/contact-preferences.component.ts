import { Component, OnInit } from '@angular/core';
import { FormControl,FormArray,FormGroup, FormBuilder, Validators, ValidatorFn} from '@angular/forms';
import { SettingService } from '../_services/setting.service';
import { ErrorService } from '../../../_services/error.service';

@Component({
  selector: 'app-contact-preferences',
  templateUrl: './contact-preferences.component.html',
  styleUrls: ['./contact-preferences.component.scss']
})
export class ContactPreferencesComponent implements OnInit {
  contactPreferenceOption:any;
  contactPreferenceFrom : FormGroup;
  isLoaderAdmin:boolean = false;
  boxOfficeCode:any;
  contactPreferenceSettingDetail:any

  constructor(
    private _formBuilder : FormBuilder,
    private SettingService : SettingService,
    private ErrorService : ErrorService
  ) { 
    this.contactPreferenceFrom = this._formBuilder.group({
      email_id:['',[Validators.required, Validators.email]],
      contact_pre_option:['',[Validators.required]],
    })
    if(localStorage.getItem('boxoffice_id')){
      this.boxOfficeCode = localStorage.getItem('boxoffice_id')
    }
    
    this.getContactPreferenceSetting();
  }

  fnSubmitContactPreference(){

    if(this.contactPreferenceFrom.valid){

        let contactPreferenceSetting = {
          "email_id":this.contactPreferenceFrom.get('email_id').value,
          "contact_pre_option" : this.contactPreferenceOption
          // "instructions":this.contactPreferenceFrom.get('instructions').value,
        }
        let requestObject = {
          "boxoffice_id"  : this.boxOfficeCode,
          "option_key"    :  "contactPreference",
          "option_value" : contactPreferenceSetting,
          "event_id" :  null,
          'json_type' : 'Y'
        }
        this.updatecontactPreferenceSetting(requestObject);
        this.contactPreferenceFrom.reset();
    }else{
      this.contactPreferenceFrom.get('email_id').markAllAsTouched();
      // this.contactPreferenceFrom.get('instructions').markAllAsTouched();
      return false;
    }

  }

  updatecontactPreferenceSetting(requestObject){
    this.isLoaderAdmin = true;
    this.SettingService.updateSetting(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.ErrorService.successMessage('Contact Preference Updated');
        this.getContactPreferenceSetting();
      } else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
      this.isLoaderAdmin = false;
    });

  }

  getContactPreferenceSetting(){
    let requestObject={
      "boxoffice_id"  : this.boxOfficeCode,
      "option_key"    :  "contactPreference",
      "event_id" :  'NULL',
      'json_type' : 'Y'
    }
    this.isLoaderAdmin = true;
    this.SettingService.getSettingsValue(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.contactPreferenceSettingDetail = JSON.parse(response.response)
        this.contactPreferenceFrom.controls["email_id"].setValue(this.contactPreferenceSettingDetail.email_id)
        this.contactPreferenceFrom.controls["contact_pre_option"].setValue(this.contactPreferenceSettingDetail.contact_pre_option)
        this.contactPreferenceOption = this.contactPreferenceSettingDetail.contact_pre_option
        if(this.contactPreferenceOption === "diffrent_email"){
          this.contactPreferenceFrom.controls["email_id"].setValidators([Validators.required,Validators.email])
        }else{
          this.contactPreferenceFrom.controls["email_id"].setValidators(null);
          this.contactPreferenceFrom.controls["email_id"].updateValueAndValidity();
        }
        this.contactPreferenceFrom.updateValueAndValidity();
      } else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
      this.isLoaderAdmin = false;
    });

  }


  fnSelectionChange(event){
    this.contactPreferenceOption = event.value;
    if(this.contactPreferenceOption === "diffrent_email"){
      this.contactPreferenceFrom.controls["email_id"].setValidators([Validators.required,Validators.email])
    }else{
      this.contactPreferenceFrom.controls["email_id"].setValidators(null);
      this.contactPreferenceFrom.controls["email_id"].updateValueAndValidity();
    }
    this.contactPreferenceFrom.updateValueAndValidity();
  }
  ngOnInit(): void {
  }

}

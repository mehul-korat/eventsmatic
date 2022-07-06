import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ErrorService } from '../../../_services/error.service'
import { SettingService } from '../_services/setting.service';
import {DomSanitizer} from "@angular/platform-browser";
@Component({
  selector: 'app-websites-embed-codes',
  templateUrl: './websites-embed-codes.component.html',
  styleUrls: ['./websites-embed-codes.component.scss']
})
export class WebsitesEmbedCodesComponent implements OnInit {
  CustomiseButtonDiv : Boolean = true;
  EditButtonDiv : Boolean = true;
  bgColor = '#A207A8';
  bgTextColor = '#F8F8F8';
  headerColor ='#E72586';
  headerTextColor = 'F3F3F3';  
  btnColor = '#49DD54';
  btnTextColor = '#FFFFFF';
  embededCode:any;
  embededCodePreview:any;
  boxOfficeId:any;
  isLoaderAdmin:any;
  allEvents:any;
  editWidgetsoptionForm:FormGroup;
  customiseWidgetForm:FormGroup;
  embedCodeOption:any;
  constructor(
    private _formBuilder:FormBuilder,
    private SettingService : SettingService,
    private ErrorService : ErrorService,
    private sanitizer:DomSanitizer
  ) { 
    if (localStorage.getItem('boxoffice_id')) {
      this.boxOfficeId = localStorage.getItem('boxoffice_id');
      
      // const enc = new Base64();   
      // this.encodedBusinessId = enc.encode(this.businessId);
      // console.log(this.encodedBusinessId);
      
      this.editWidgetsoptionForm = this._formBuilder.group({
        fullWidget:[''],
        optionalWidget:[''],
        eventTitle:['']
      })

      this.customiseWidgetForm = this._formBuilder.group({
        selectTheme:['']
      })
      this.getWidgetOption();

    }
  }

  fnUpadateWidget(){
    if(this.editWidgetsoptionForm.valid){
      let editWidget = {
        "fullWidget":this.editWidgetsoptionForm.get('fullWidget').value,
        "optionalWidget":this.editWidgetsoptionForm.get('optionalWidget').value,
        "eventTitle":this.editWidgetsoptionForm.get('eventTitle').value,
      }
      let requestObject = {
        "boxoffice_id"  : this.boxOfficeId,
        "option_key"    :  "webEmbedCode",
        "option_value" : editWidget,
        "event_id" :  null,
        'json_type' : 'Y'
      }
      this.updateWebEmbedCodes(requestObject);

      // this.editWidgetsoptionForm.reset();

    }else{
      this.editWidgetsoptionForm.get('fullWidget').markAllAsTouched();
      this.editWidgetsoptionForm.get('optionalWidget').markAllAsTouched();
      this.editWidgetsoptionForm.get('eventTitle').markAllAsTouched();
    }
  }

  transform(embededCode) {
    return  this.sanitizer.bypassSecurityTrustHtml(embededCode);
  }

  copyEmbedCode(val: string){
    let selBox = document.createElement('textarea');
      selBox.style.position = 'fixed';
      selBox.style.left = '0';
      selBox.style.top = '0';
      selBox.style.opacity = '0';
      selBox.value = val;
      document.body.appendChild(selBox);
      selBox.focus();
      selBox.select();
      document.execCommand('copy');
      document.body.removeChild(selBox);
      this.ErrorService.successMessage('Copied.');
    }


  fnUpadateCustomiseWidget(){
    if(this.customiseWidgetForm.valid){
      let cutomiseWidget = {
        "selectTheme":this.customiseWidgetForm.get('selectTheme').value,
        "bgColor":this.bgColor,
        "bgTextColor":this.bgTextColor,
        "headerColor":this.headerColor,
        "headerTextColor":this.headerTextColor,
        "btnColor":this.btnColor,
        "btnTextColor":this.btnTextColor
      }
      let requestObject = {
        "boxoffice_id"  : this.boxOfficeId,
        "option_key"    :  "webEmbedCodeAppearance",
        "option_value" : cutomiseWidget,
        "event_id" :  null,
        'json_type' : 'Y'
      }
      this.updateWebEmbedCodes(requestObject);

      this.customiseWidgetForm.reset();
      // this.CustomiseButton()

    }else{
      this.customiseWidgetForm.get('selectTheme').markAllAsTouched();
    }
  }

  updateWebEmbedCodes(requestObject){
    this.isLoaderAdmin = true;
    this.SettingService.updateSetting(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.ErrorService.successMessage(response.response)
        this.getWidgetOption();
        this.EditButton()
      } else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
      this.isLoaderAdmin = false;
    });
  }

  getWidgetOption(){
    let requestObject ={
      'boxoffice_id' : this.boxOfficeId,
      'event_id' :'NULL',
      'option_key':'webEmbedCode',
    }
    this.isLoaderAdmin = true;
    this.SettingService.getSettingsValue(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.embedCodeOption = JSON.parse(response.response)
        this.editWidgetsoptionForm.controls['fullWidget'].setValue(this.embedCodeOption.fullWidget)
        this.editWidgetsoptionForm.controls['optionalWidget'].setValue(this.embedCodeOption.optionalWidget)
        this.editWidgetsoptionForm.controls['eventTitle'].setValue(this.embedCodeOption.eventTitle)

        if(this.embedCodeOption.eventTitle == 'all'){
          this.embededCode = "<iframe height='100%' style='height:100vh' width='100%' src='"+environment.bookingPageUrl+"/box-office/"+this.boxOfficeId+"?iframe=true' frameborder='0'></iframe>";
          this.embededCodePreview = this.transform(this.embededCode);
        }else{
          this.embededCode = "<iframe height='100%' style='height:100vh' width='100%' src='"+environment.bookingPageUrl+"/event/"+this.embedCodeOption.eventTitle+"?iframe=true' frameborder='0'></iframe>";
          this.embededCodePreview = this.transform(this.embededCode);
        }
        console.log(this.embededCodePreview)
      } else if(response.data == false){
        // this.ErrorService.errorMessage(response.response);
      }
    });
      this.isLoaderAdmin = false;
  }

  getEventsList(){
    this.isLoaderAdmin = true;
    let requestObject = {
      'boxoffice_id' : this.boxOfficeId,
      }
     this.SettingService.getEventsList(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.allEvents = response.response
        console.log(this.allEvents);
      }
      else if(response.data == false){
      // this.ErrorService.errorMessage(response.response);
      this.allEvents.length = 0
      }
      this.isLoaderAdmin = false;
    })
  }

  fnChangeTheme(event){
    if(event.value == 'Classic Blue'){
    this.bgColor = '#082945';
    this.bgTextColor = '#F8F8F8';
    this.headerColor ='#0f4c81';
    this.headerTextColor = 'F3F3F3';  
    this.btnColor = '#0f4c81';
    this.btnTextColor = '#FFFFFF';
  }else if(event.value == 'Green Shades'){
    this.bgColor = '#89b163';
    this.bgTextColor = '#121212';
    this.headerColor ='#466e1e';
    this.headerTextColor = 'f3ebeb';  
    this.btnColor = '#808976';
    this.btnTextColor = '#FFFFFF';
  }else if(event.value == 'Gray Scale'){
    this.bgColor = '#dcdcdc';
    this.bgTextColor = '#121212';
    this.headerColor ='#646a5f';
    this.headerTextColor = 'f3ebeb';  
    this.btnColor = '#808976';
    this.btnTextColor = '#FFFFFF';
  }else if(event.value == 'Sunshine'){
    this.bgColor = '#e4bc3f ';
    this.bgTextColor = '#121212';
    this.headerColor ='#e29606';
    this.headerTextColor = 'f3ebeb';  
    this.btnColor = '#e29606 ';
    this.btnTextColor = '#FFFFFF';
  }else if(event.value == 'Black and White'){
    this.bgColor = '#FFFFFF ';
    this.bgTextColor = '#000000';
    this.headerColor ='#000000';
    this.headerTextColor = '#FFFFFF';  
    this.btnColor = '#000000';
    this.btnTextColor = '#FFFFFF';
  }else if(event.value == 'Turquoise'){
    this.bgColor = '#40e0d0 ';
    this.bgTextColor = '#000000';
    this.headerColor ='#00c4b1';
    this.headerTextColor = '#FFFFFF';  
    this.btnColor = '#00c4b1';
    this.btnTextColor = '#FFFFFF';
  }else if(event.value == 'Firenze'){
    this.bgColor = '#369c8a ';
    this.bgTextColor = '#000000';
    this.headerColor ='#0a6857';
    this.headerTextColor = '#FFFFFF';  
    this.btnColor = '#0a6857';
    this.btnTextColor = '#FFFFFF';
  }else if(event.value == 'Phonedro'){
    this.bgColor = '#b890f7 ';
    this.bgTextColor = '#000000';
    this.headerColor ='#6d0080';
    this.headerTextColor = '#FFFFFF';  
    this.btnColor = '#6d0080';
    this.btnTextColor = '#FFFFFF';
  }

  }


  CustomiseButton() {
    this.CustomiseButtonDiv = this.CustomiseButtonDiv ? false : true;
 }

 EditButton(){
   this.EditButtonDiv = this.EditButtonDiv ? false : true;
 }

  ngOnInit(): void {
    this.getEventsList()
  }

}

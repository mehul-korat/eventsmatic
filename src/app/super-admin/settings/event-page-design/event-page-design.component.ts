import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SettingService } from '../_services/setting.service';
import { ErrorService } from '../../../_services/error.service';
import { DatePipe} from '@angular/common';
import { environment } from '../../../../environments/environment';
import * as moment from 'moment'; 
import {DomSanitizer,SafeResourceUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-event-page-design',
  templateUrl: './event-page-design.component.html',
  styleUrls: ['./event-page-design.component.scss'],
  providers: [DatePipe]
})
export class EventPageDesignComponent implements OnInit {

  eventPageType:any='listing';
  eventPageView:any = 'desktop';
  selectedFont:any ='Roboto, sans-serif';
  allEventList: any=[];
  boxOfficeId: any;
  boxOfficeName: any;
  eventImage:any;
  frontURL:any
  isLoaderAdmin:boolean = false;
  eventId:any;
  eventStartTime:any;
  eventEndTime:any;
  eventDetail:any;
  eventDiscriptionHtml:any;
  customizerThemePanel:boolean=true;
  themeAppearanceColor:any;
  displayCol:any= '2';
  displayView:any= 'verticle';
  selectedTheme:any= 'theme1';
  headerColor = '#A207A8';
  headerTextColor = '#F3F3F3';  
  pageColor = '#F8F8F8';
  pageTextColor ='#E72586';
  btnColor = '#49DD54';
  btnTextColor = '#FFFFFF';
  bgColor = '#FFFFFF';
  eventLocationSrc:SafeResourceUrl;
  singleEventOnline:boolean= false;
  themeSelectionOption:any = 'themeSelection';
  boxOfficeUrl:any;
  eventSettings:any;
  recurringEvent:any='N';
  box_office_name:any;
  boxOfficeDetail:any;
  currencySymbol:any;
  thumbZoomLavel:any;
  bannerZoomLavel:any;
  waitingListSettings:any;
  joinWaitingList:boolean= false;
  updated:boolean=true;
  hide_tailor_logo:any='N';
  constructor(
    private SettingService:SettingService,
    private ErrorService:ErrorService,
    private datePipe: DatePipe,
    private change : ChangeDetectorRef,
    private sanitizer:DomSanitizer,
  ) { 
    if(localStorage.getItem('boxoffice_id')){
      this.boxOfficeId = localStorage.getItem('boxoffice_id');
    }
    if(localStorage.getItem('boxoffice_name')){
      this.boxOfficeName = localStorage.getItem('boxoffice_name');
    }
    this.fnGetUpcomingEventList();
    this.getThemeAppearanceColor();
    this.fnGetBoxOfficeDetail();
    this.boxOfficeUrl= environment.bookingPageUrl+'/box-office/'+this.boxOfficeId
  }

  ngOnInit(): void {
  }


  fnEventPageType(event){
    this.eventPageType = event.value;
    if(event.value == 'single' && this.allEventList.length>0){

      this.getEvent(this.allEventList[0].unique_code);
    }else if(event.value == 'single' && this.allEventList.length==0){
      alert('Please create an event.')
      this.eventPageType = 'listing';
    }
  }

  fnEventPageView(event){
    this.eventPageView = event.value
  }

  fnGetUpcomingEventList(){
    this.isLoaderAdmin = true;
    let requestObject = {
      'boxoffice_id'  :this.boxOfficeId,
      'filter' : 'all'
    }
    this.SettingService.fnGetAllEventListView(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.allEventList = response.response;
        this.getEvent(this.allEventList[0].unique_code);
        this.frontURL  = environment.bookingPageUrl+'/event/'+this.allEventList[0].unique_code
        this.allEventList.forEach(element => {
          if(element.images.length == 0){
            element.images = undefined
          }
          element.start_date = this.datePipe.transform(element.start_date,"EEE MMM d, y")
          // element.start_time = this.datePipe.transform(element.start_time,"h:mm:ss a")
          // element.end_date = this.datePipe.transform(element.end_date,"EEE MMM d, y")
          // element.end_time = this.datePipe.transform(element.end_time,"h:mm:ss a")
          if(element.images.length == 0)
            element.images = undefined
          });
      }else if(response.data == false){
        this.allEventList.length = 0;
        // this.ErrorService.errorMessage(response.response);
      }
    this.isLoaderAdmin = false;
    });
  }

  fnChangeTheme(theme){
    this.selectedTheme = theme;
    this.fnSetThemeSetting();
  }

  fnThemeDirection(direction){
      this.themeSelectionOption =direction;
  }

  fnChangeFont(event){
    this.selectedFont = event.value
  }

  onChangeColumn(event){
    this.displayCol = event.value
  }

  onChangeView(event){
    this.displayView = event.value
  }

  getThemeAppearanceColor(){
    let requestObject ={
      'boxoffice_id' : this.boxOfficeId,
      'event_id' :'NULL',
      'option_key':'themeColorAppearance',
    }
    this.isLoaderAdmin = true;
    this.SettingService.getSettingsValue(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.themeAppearanceColor = JSON.parse(response.response)
        this.selectedFont = this.themeAppearanceColor.font;
        this.bgColor = this.themeAppearanceColor.bgColor;
        this.pageColor = this.themeAppearanceColor.pageColor;
        this.pageTextColor = this.themeAppearanceColor.pageTextColor;
        this.headerColor = this.themeAppearanceColor.headerColor;
        this.displayCol = this.themeAppearanceColor.displayCol?this.themeAppearanceColor.displayCol:'2';
        this.displayView = this.themeAppearanceColor.displayView?this.themeAppearanceColor.displayView:'verticle';
        this.headerTextColor = this.themeAppearanceColor.headerTextColor;
        this.btnColor = this.themeAppearanceColor.btnColor;
        this.btnTextColor = this.themeAppearanceColor.btnTextColor;
        this.selectedTheme = this.themeAppearanceColor.theme;
        this.updated = this.themeAppearanceColor.updated?this.themeAppearanceColor.updated:false;
        localStorage.companycolours=JSON.stringify(this.themeAppearanceColor);
          this.update_SCSS_var();
      } else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
      this.isLoaderAdmin = false;
    });
  }
  OnHeaderColorChange(){
    this.updated = true;
  }

  
  fnUpadateThemeAppearanceColor(){
      let themeAppearance = {
        "font":this.selectedFont,
        "bgColor":this.bgColor,
        "pageColor":this.pageColor,
        "pageTextColor":this.pageTextColor,
        "headerColor":this.headerColor,
        "headerTextColor":this.headerTextColor,
        "btnColor":this.btnColor,
        "btnTextColor":this.btnTextColor,
        "displayCol":this.displayCol,
        "displayView":this.displayView,
        'theme': this.selectedTheme,
        'updated': this.updated
      }
      let requestObject = {
        "boxoffice_id"  : this.boxOfficeId,
        "option_key"    :  "themeColorAppearance",
        "option_value" : themeAppearance,
        "event_id" :  null,
        'json_type' : 'Y'
      }
      this.updateThemeAppearance(requestObject);

  }

  updateThemeAppearance(requestObject){
    this.isLoaderAdmin = true;
    this.SettingService.updateSetting(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.ErrorService.successMessage(response.response);
        this.getThemeAppearanceColor();
      } else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
      this.isLoaderAdmin = false;
    });
  }


  update_SCSS_var() {
    const data = JSON.parse(localStorage.companycolours);
    for (const [key, value] of Object.entries(data)) {
      this.setPropertyOfSCSS('--' + key, value);
      // document.documentElement.style.setProperty('--' + key, value);
    }
  }

  setPropertyOfSCSS(key, value) {
    if (key[0] != '-') {
      key = '--' + key;
    }
    if (value) {
      document.documentElement.style.setProperty(key, value);
    }
    return getComputedStyle(document.documentElement).getPropertyValue(key);
  }


  getEvent(unique_code){
    this.isLoaderAdmin = true;
    let requestObject = {
       'unique_code' : unique_code
    }

    this.SettingService.getSingleEvent(requestObject).subscribe((response:any) => {

      if(response.data == true){

        this.eventDetail = response.response.event[0];
        this.eventStartTime = moment(this.eventDetail.start_date + ' '+ this.eventDetail.start_time).format('MMMM Do YYYY, h:mm a');
        this.eventEndTime = moment(this.eventDetail.end_date +' '+this.eventDetail.end_time).format('MMMM Do YYYY, h:mm a');
        this.eventDiscriptionHtml = this.sanitizer.bypassSecurityTrustHtml(this.eventDetail.description);
        this.eventSettings = this.eventDetail.event_setting;
        this.recurringEvent = this.eventDetail.event_occurrence_type
        this.getWaitingListSetting();
        this.eventDetail.description = this.eventDetail.description.replace(/< \/?[^>]+>/gi, '');
        console.log(this.eventDetail.description.replace(/< \/?[^>]+>/gi, ''));
        if(this.eventDetail.online_event == 'Y'){
          this.singleEventOnline = true;
        }else{
          this.singleEventOnline = false;
        }

        if(this.eventDetail.images[0]){
          this.eventImage = this.eventDetail.images[0].image;
        }else{
          this.eventImage = '/assets/images/Event-preview/preview-main.png';
        }
        if(this.eventSettings.event_thumb_zoom){
          this.thumbZoomLavel = this.eventSettings.event_thumb_zoom
        }
        if(this.eventSettings.event_banner_zoom){
          this.bannerZoomLavel = this.eventSettings.event_banner_zoom
        }
        if(this.eventDetail.online_event == 'N'){
          var address = [this.eventDetail.venue_name ,this.eventDetail.country[0].name,this.eventDetail.postal_code];
          this.fnGoogleMap(address.join('+'));
        }else{
           
        }
        this.change.detectChanges();
      } else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
      this.isLoaderAdmin = false;

    });

  }
  fnGoogleMap(address){
    this.isLoaderAdmin = true;
    this.SettingService.googleMap(address).subscribe((response:any) => {
      if(response.status =='OK'){
        var results = response.results[0].geometry.location;
         this.eventLocationSrc =  this.sanitizer.bypassSecurityTrustResourceUrl('https://maps.google.com/maps?q='+results.lat+','+results.lng+'&z=15&output=embed');
      }
      this.isLoaderAdmin = false;
    });
  }
 
  fnGetBoxOfficeDetail(){
    this.isLoaderAdmin = true;
    let requestObject = {
      'unique_code' : this.boxOfficeId,
    }
    
    this.SettingService.getSingleBoxofficeDetails(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.boxOfficeDetail = response.response[0];
        if(!this.currencySymbol){
          this.currencySymbol =this.boxOfficeDetail.currency.CurrencyCode
          this.hide_tailor_logo = this.boxOfficeDetail.hide_tailor_logo
        }
      } else if(response.data == false){
      }
    this.isLoaderAdmin = false;
    });

  }

  getWaitingListSetting(){
    let requestObject = {
      'event_id' : this.eventId,
      'option_key' : 'waitListForm',
      'boxoffice_id' : 'NULL'
    }

    this.isLoaderAdmin = true;
    this.SettingService.getSettingsValue(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.waitingListSettings =  JSON.parse(response.response); 
        if(this.waitingListSettings.show_when_ticket_available == 'Y'){
          if(this.eventDetail && this.waitingListSettings.active_watlist == 'Y' && this.eventDetail.soldout_status){
            this.joinWaitingList= true;
          }else{
            this.joinWaitingList= false;
          }
        }else{
          if(this.waitingListSettings.active_watlist == 'Y'){
            this.joinWaitingList= true;
          }else{
            this.joinWaitingList= false;
          }
        }
        //console.log(this.waitingListSettings)
      } else if(response.data == false){
        this.waitingListSettings = undefined;
       // this.errorService.errorMessage(response.response);
      }
      this.isLoaderAdmin = false;
    });
  }

  public fnSetDefaultSettings(){
    let themeAppearance = {
      "font":"Poppins, sans-serif",
      "bgColor":"#e4e4e4",
      "pageColor":"#ffffff",
      "pageTextColor":"#000000",
      "headerColor":"#973c56",
      "headerTextColor":"#ffffff",
      "btnColor":"#973c56",
      "btnTextColor":"#FFFFFF",
      "displayCol":"2",
      "displayView":"verticle",
      'theme': "theme1",
      'updated': false
    }
    let requestObject = {
      "boxoffice_id"  : this.boxOfficeId,
      "option_key"    :  "themeColorAppearance",
      "option_value" : themeAppearance,
      "event_id" :  null,
      'json_type' : 'Y'
    }
    this.updateThemeAppearance(requestObject);
  }
  public fnSetDefaultColorSetting(){
    let themeAppearance = {
      "font":"Poppins, sans-serif",
      "bgColor":"#e4e4e4",
      "pageColor":"#ffffff",
      "pageTextColor":"#000000",
      "headerColor":"#973c56",
      "headerTextColor":"#ffffff",
      "btnColor":"#973c56",
      "btnTextColor":"#FFFFFF",
      "displayCol":"2",
      "displayView":"verticle",
      'theme': this.selectedTheme,
      'updated': false
    }
    let requestObject = {
      "boxoffice_id"  : this.boxOfficeId,
      "option_key"    :  "themeColorAppearance",
      "option_value" : themeAppearance,
      "event_id" :  null,
      'json_type' : 'Y'
    }
    this.updateThemeAppearance(requestObject);
  }
  public fnSetThemeSetting(){
    let themeAppearance = {
      "font":this.selectedFont,
      "bgColor":this.bgColor,
      "pageColor":this.pageColor,
      "pageTextColor":this.pageTextColor,
      "headerColor":this.headerColor,
      "headerTextColor":this.headerTextColor,
      "btnColor":this.btnColor,
      "btnTextColor":this.btnTextColor,
      "displayCol":this.displayCol,
      "displayView":this.displayView,
      'theme': this.selectedTheme,
      'updated': this.updated
    }
    let requestObject = {
      "boxoffice_id"  : this.boxOfficeId,
      "option_key"    :  "themeColorAppearance",
      "option_value" : themeAppearance,
      "event_id" :  null,
      'json_type' : 'Y'
    }
    this.updateThemeAppearance(requestObject);
  }

  transformTime24To12(time: any): any {
    if(time != null){
      let hour = (time.split(':'))[0];
      let min = (time.split(':'))[1];
      let part = 'AM';
      let finalhrs = hour
      if(hour == 0){
        finalhrs = 12
      }
      if(hour == 12){
        finalhrs = 12;
        part = 'PM';
      }
      if(hour > 12){
        finalhrs  = hour - 12
        part = 'PM' 
      }
      return `${finalhrs}:${min} ${part}`
    }else{
      return "";
    }
  }

}

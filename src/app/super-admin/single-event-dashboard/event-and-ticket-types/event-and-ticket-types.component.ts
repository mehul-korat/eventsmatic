import { Component, OnInit, Inject,ChangeDetectorRef, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { SingleEventServiceService } from '../_services/single-event-service.service';
import { ErrorService } from '../../../_services/error.service';
import { DatePipe} from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators,FormControl, FormArray } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { element } from 'protractor';
import { SingleEventDashboard } from '../single-event-dashboard'
import { environment } from '../../../../environments/environment';
import { take, takeUntil } from 'rxjs/operators';
import * as moment from 'moment'; 
import { ConfirmationDialogComponent } from '../../../_components/confirmation-dialog/confirmation-dialog.component';
import { Observable, throwError, ReplaySubject, Subject } from 'rxjs';
import { AngularEditorConfig } from '@kolkov/angular-editor';

export interface ListTimeZoneListArry {
  id: string;
  name: string;
}


@Component({
  selector: 'app-event-and-ticket-types',
  templateUrl: './event-and-ticket-types.component.html',
  styleUrls: ['./event-and-ticket-types.component.scss'],
  providers: [DatePipe]
})
export class EventAndTicketTypesComponent implements OnInit, AfterViewInit {
  @ViewChild('ticket_premodule') jump: ElementRef;
  value = 50;
  apiUrl = environment.apiFolderUrl; 
  bufferValue = 75;
  salesTax = [];
  salesTaxVal = [];
  selectedEvent : any;
  boxOfficeCode : any;
  thumbZoomLavel:any = '100'
  bannerZoomLavel:any = '100'
  singleEventDetail:any;
  singleEventSetting:any;
  singleEventTickets:any;
  allCountry:any;
  allTimeZone:any;
  allDefaultImages:any;
  fullDayTimeSlote:any;
  editEventForm:FormGroup;
  customSalesTaxForm: FormGroup;
  customSalesTaxArr: FormArray;
  eventImageType:any = 'noImage';
  selecetdDefaultImage:any;
  isLoaderAdmin:boolean = false;
  redirectURL:any = 'N';
  hideEventSearch:any = 'N';
  customSalesTax:any = 'N';
  accessCode:any = 'N';
  donation:any = 'N';
  shareButtonStatus: any = 'N';
  olPlatForm : any = 'N';
  eventStartTime:any=0;
  minEventStartDate:any = Date();
  minEventEndDate:any = new Date();
  startEndSameDate:boolean = false;
  eventTicketAlertMSG :boolean = true;
  eventTicketList= [];
  newEventImageUrl :any;
  selectedTicketDetail:any;
  getCurrancy:any;
  selectedImage:any;
  deletedSalesTaxIndex:any=[];
  startdateToday:boolean=false;
  currentTime:any;
  onlynumericAmount = /^(\d*\.)?\d+$/
  selectedStartDate:any =new Date();
  todayDate:any =new Date();
  startTimeForCheck:any;
  recurringEvent:any='N';
  protected listTimeZoneListArry: ListTimeZoneListArry[];
  public timeZoneFilterCtrl: FormControl = new FormControl();
  public listTimeZoneList: ReplaySubject<ListTimeZoneListArry[]> = new ReplaySubject<ListTimeZoneListArry[]>(1);
  protected _onDestroy = new Subject<void>();
  currentDate:any;
  eventStartDate:any;
  SingleEventStartTime:any;
  currentTimeToday:any;
  eventStarted:any;
  goto: any;
  scrollContainer: any;
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
    private SingleEventServiceService: SingleEventServiceService,
    private ErrorService: ErrorService,
    private datePipe: DatePipe,
    private SingleEventDashboard: SingleEventDashboard,
    private router: Router,
    private _formBuilder: FormBuilder,
    public dialog: MatDialog,
    private change: ChangeDetectorRef,
    private route: ActivatedRoute
  ) { 

      if(localStorage.getItem('boxoffice_id')){
        this.boxOfficeCode = localStorage.getItem('boxoffice_id');
      }
      if(localStorage.getItem('selectedEventCode')){
        this.selectedEvent = localStorage.getItem('selectedEventCode')
      }

      //  let newEventAction = window.location.search.split("?goto")
      //	console.log(newEventAction);
  	  //  console.log('calll' + newEventAction);
      // if(newEventAction.length > 1){		
      //   const firstInvalidControl: HTMLElement = this.el.nativeElement.querySelector(
      //     "#ticket_module"
      //   );
    
      //   firstInvalidControl.scrollTop = 0;
      // }

      this.editEventForm = this._formBuilder.group({
        event_name: ['',[Validators.required]],
        event_start_date: ['',Validators.required],
        event_start_time: ['',Validators.required],
        event_end_date: ['',Validators.required],
        event_end_time: ['',Validators.required],
        vanue_name: ['',Validators.required],
        vanue_zip: ['',Validators.required],
        vanue_country: ['',Validators.required],
        online_platform: [''],
        online_link: [''],
        description: ['',Validators.required],
        timezone: ['',Validators.required],
        donation_title: [''],
        currency: ['',[Validators.required]],
        transaction_fee: ['',Validators.pattern(this.onlynumericAmount)],
        donation_amount: [''],
        donation_description: [''],
        book_btn_title: ['',Validators.required],
        // ticket_available: ['',Validators.required],
        // ticket_unavailable: ['',Validators.required],
        redirect_url: [''],
        access_code: [''],
      });
      this.customSalesTaxForm = this._formBuilder.group({
        customSalesTaxArr: this._formBuilder.array([this.createSalesTaxItem()])
      });
    }



  ngOnInit(): void {
    this.getAllCountry();
    this.getAllTimeZone();
    this.getDefaultImages();
    this.getTimeSlote();
    this.getAllCurrancy();
	  //this.fnTiket();
  }

  ngAfterViewInit() {
      console.log(this.jump);
      this.scrollContainer = this.jump.nativeElement;

      // check if the query is present
      this.route.queryParams.subscribe((params)=> {
          if (params['goto']) {
            // scroll the div
            this.scrollContainer.scrollIntoView({ behavior: "smooth", block: "start" });
          }
      });
  }
  transformTime24To12(time: any): any {
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
  }

  // fnRecurringEvent(event){
  //   if(event.checked == true){
  //     this.recurringEvent = 'Y';
  //     this.editEventForm.controls["event_start_date"].setValidators(null);
  //     this.editEventForm.controls["event_start_time"].setValidators(null);
  //     this.editEventForm.controls["event_end_date"].setValidators(null);
  //     this.editEventForm.controls["event_end_time"].setValidators(null);
  //     this.editEventForm.controls["event_start_date"].updateValueAndValidity();
  //     this.editEventForm.controls["event_start_time"].updateValueAndValidity();
  //     this.editEventForm.controls["event_end_date"].updateValueAndValidity();
  //     this.editEventForm.controls["event_end_time"].updateValueAndValidity();
  //   }else{
  //     this.recurringEvent = 'N';
  //     this.editEventForm.controls["vanue_name"].setValidators(Validators.required);
  //     this.editEventForm.controls["event_start_date"].setValidators(Validators.required);
  //     this.editEventForm.controls["event_start_time"].setValidators(Validators.required);
  //     this.editEventForm.controls["event_end_date"].setValidators(Validators.required);
  //     this.editEventForm.controls["event_end_time"].setValidators(Validators.required);
  //     this.editEventForm.controls["event_start_date"].updateValueAndValidity();
  //     this.editEventForm.controls["event_start_time"].updateValueAndValidity();
  //     this.editEventForm.controls["event_end_date"].updateValueAndValidity();
  //     this.editEventForm.controls["event_end_time"].updateValueAndValidity();
  //   }
  //   this.editEventForm.updateValueAndValidity();
  // }

  
  // private scrollToFirstInvalidControl() {
  //   const firstInvalidControl: HTMLElement = this.jump.nativeElement.querySelector(
  //     "form .ng-invalid"
  //   );

  //   firstInvalidControl.focus(); //without smooth behavior
  // }

	/*ngOnInit() {
		console.log('callll fntiket');
		let pos = document.body.scrollHeight;
		window.scrollTo( 0 ,0);
		console.log(pos);
	}*/
	
	// fnTiket(){
	// 	console.log('scroll calll');
	// 	//jQuery( "#ticket_module" ).scrollTop(10);
	// 	//this.scrollTopPosition = event.target.scrollTop;
	// 	//setTimeout(this.scrollBottom(), 500)
	// 	let newEventAction = window.location.search.split("?goto")
	// 	//	console.log(newEventAction);
	// 	console.log('calll' + newEventAction);
	// 	if(newEventAction.length > 1){	
	// 		//let pos = document.body.scrollHeight;
	// 		window.scrollTo( 0 ,500);
	// 		//this.fnTiket();	
	// 	   //document.getElementById("ticket_module").focus();		 
	// 	}
			
		//document.querySelector('body').scrollTo(0,1500)		
	//}
	
  fnCancelEvent(){
    this.getSingleEvent();

  }

  createSalesTaxItem(amount=null, label=null) {
    return this._formBuilder.group({
      amount: [amount,[Validators.required,Validators.pattern('[0-9.]{0,100}')]],
      label: [label,[Validators.required]]
    })
  }

  

  fnSalesTaxAdd(){
    this.customSalesTaxArr = this.customSalesTaxForm.get('customSalesTaxArr') as FormArray;
    this.customSalesTaxArr.push(this.createSalesTaxItem());
    this.salesTax = this.customSalesTaxForm.value.customSalesTaxArr;
  }

  fnDeleteTax(index){
    this.deletedSalesTaxIndex.push(index);
    this.salesTax.splice(index, 1);
    this.customSalesTaxForm.get('customSalesTaxArr') as FormArray;
    this.customSalesTaxForm.value.customSalesTaxArr.splice(index, 1);
  }

  
  getAllCountry(){
    this.SingleEventServiceService.getAllCountry().subscribe((response:any) => {
      if(response.data == true){
        this.allCountry = response.response
      }
    });
  }

  getDefaultImages(){
    this.SingleEventServiceService.getDefaultImages().subscribe((response:any) => {
      if(response.data == true){
        this.allDefaultImages= response.response
      }
    });
  }

  getAllCurrancy(){
    this.SingleEventServiceService.getAllCurrancy().subscribe((response:any) => {
      if(response.data == true){
        this.getCurrancy= response.response
      }
    });
  }

  getTimeSlote(){
    let requestObject = {
      'interval'  :'30',
    }
    this.SingleEventServiceService.getTimeSlote(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.fullDayTimeSlote= response.response;
        // this.fullDayTimeSlote.forEach(element => {
        //   element = this.transformTime24To12(element)
        // });
        this.getSingleEvent();

      }
    });
  }

  getAllTimeZone(){
    this.SingleEventServiceService.getAllTimeZone().subscribe((response:any) => {
      if(response.data == true){
        this.listTimeZoneListArry = response.response
        // load the initial bank list
        this.listTimeZoneList.next(this.listTimeZoneListArry.slice());
        this.timeZoneFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
        this.filterTimezones();
      });
      }
    });
  }
  
    /**
   * Sets the initial value after the filteredBanks are loaded initially
   */
  protected setInitialValue() {
    this.listTimeZoneList
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(() => {
      });
  }

  protected filterTimezones() {
    if (!this.listTimeZoneListArry) {
      return;
    }
    // get the search keyword
    let search = this.timeZoneFilterCtrl.value;
    if (!search) {
      this.listTimeZoneList.next(this.listTimeZoneListArry.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.listTimeZoneList.next(
      this.listTimeZoneListArry.filter(listTimeZoneListArry => listTimeZoneListArry.name.toLowerCase().indexOf(search) > -1)
    );
  }

  

  fnChangeThumbZoom(event){
    this.thumbZoomLavel = event.value
  }

  fnChangeBannerZoom(event){
    this.bannerZoomLavel = event.value
  }



  getSingleEvent(){

    let requestObject = {
      'unique_code'  :this.selectedEvent,
    }
    this.SingleEventServiceService.getSingleEvent(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.singleEventDetail= response.response.event[0];
        this.eventStarted = response.response.event_started;
        //console.log(this.eventStarted);
        if(this.singleEventDetail.images.length !== 0){
          if(this.singleEventDetail.images[0].type == 'default'){
            this.eventImageType = this.singleEventDetail.images[0].image_name
          }else if(this.singleEventDetail.images[0].type == 'upload'){
            this.eventImageType = 'newUploadImage';
          }
        }else{
          this.singleEventDetail.images = undefined
        }
        if(this.singleEventDetail.event_occurrence_type){
          this.recurringEvent = this.singleEventDetail.event_occurrence_type
        }
        this.singleEventSetting= this.singleEventDetail.event_setting;
        this.eventTicketList= response.response.tickets;
        if(this.eventTicketList){
          this.eventTicketAlertMSG= false;
        }
        if(this.singleEventDetail.event_occurrence_type && this.singleEventDetail.event_occurrence_type == 'N'){
          
          if(this.singleEventDetail.start_date == this.singleEventDetail.end_date){
            this.startEndSameDate = true;
          }else{
            this.startEndSameDate = false;
          }

          this.editEventForm.controls['event_start_date'].setValue(this.singleEventDetail.start_date)
          this.editEventForm.controls['event_end_date'].setValue(this.singleEventDetail.end_date)

          if(this.fullDayTimeSlote){
          var start_time = this.singleEventDetail.start_time.split(":")
          var start_time_key =  Object.keys(this.fullDayTimeSlote).find(key => this.fullDayTimeSlote[key] == start_time[0]+":"+start_time[1]);
          // alert(start_time_key + '   start time')
          
          var end_time = this.singleEventDetail.end_time.split(":")
          var end_time_key =  Object.keys(this.fullDayTimeSlote).find(key => this.fullDayTimeSlote[key] == end_time[0]+":"+end_time[1]);
          // alert(end_time_key + '   end time')
          }
          
          this.editEventForm.controls['event_start_time'].setValue(start_time_key)
          this.editEventForm.controls['event_end_time'].setValue(end_time_key)
          
          // // alert(this.singleEventDetail.start_time + 'start time')
          // // if(this.singleEventDetail.start_time){
          //   var start_time = this.singleEventDetail.start_time.split(":")
          //   var start_time_key =  Object.keys(this.fullDayTimeSlote).find(key => this.fullDayTimeSlote[key] == start_time[0]+":"+start_time[1]);
          //   this.editEventForm.controls['event_start_date'].setValue(this.singleEventDetail.start_date)
          //   this.editEventForm.controls['event_start_time'].setValue(end_time_key)
          // // }
          // alert(this.singleEventDetail.end_time + 'end time')
          // // if(this.singleEventDetail.end_time){
          //   var end_time = this.singleEventDetail.end_time.split(":")
          //   console.log(end_time)
          //   var end_time_key =  Object.keys(this.fullDayTimeSlote).find(key => this.fullDayTimeSlote[key] == end_time[0]+":"+end_time[1]);
          //   this.editEventForm.controls['event_end_date'].setValue(this.singleEventDetail.end_date);
          //   this.editEventForm.controls['event_end_time'].setValue(start_time_key)
          //   alert(parseInt(end_time_key))
          // // }
         
          this.selectedStartDate = moment(new Date()).format('MM-DD-YYYY');
          this.selectedStartDate = moment(new Date(this.singleEventDetail.start_date)).format('MM-DD-YYYY');
          this.currentTime = this.datePipe.transform(new Date(),"h:mm a")
          this.currentTime = this.transformTime(this.currentTime)
          this.startTimeForCheck = this.transformTime2Part(this.singleEventDetail.start_time)
          if(this.eventStarted){
            this.minEventStartDate = this.singleEventDetail.start_date
          }else{
            this.minEventStartDate = new Date();
          }

        }else{
          this.editEventForm = this._formBuilder.group({
            event_name: ['',[Validators.required]],
            vanue_name: ['',Validators.required],
            vanue_zip: ['',Validators.required],
            vanue_country: ['',Validators.required],
            online_platform: [''],
            online_link: [''],
            description: ['',Validators.required],
            timezone: ['',Validators.required],
            donation_title: [''],
            currency: ['',[Validators.required]],
            transaction_fee: ['',Validators.pattern(this.onlynumericAmount)],
            donation_amount: [''],
            donation_description: [''],
            book_btn_title: ['',Validators.required],
            redirect_url: [''],
            access_code: [''],
          });
        }
       

        this.bannerZoomLavel = this.singleEventSetting.event_banner_zoom?this.singleEventSetting.event_banner_zoom:'100';
        this.thumbZoomLavel = this.singleEventSetting.event_thumb_zoom?this.singleEventSetting.event_thumb_zoom:'100';
       
        
        this.olPlatForm = this.singleEventDetail.online_event;
        this.editEventForm.controls['event_name'].setValue(this.singleEventDetail.event_title)
        if(this.olPlatForm == 'N'){
          this.editEventForm.controls['vanue_name'].setValue(this.singleEventDetail.venue_name)
          this.editEventForm.controls['vanue_zip'].setValue(this.singleEventDetail.postal_code)
          this.editEventForm.controls['vanue_country'].setValue(this.singleEventDetail.country[0].id)
        }else{
          this.editEventForm.controls['online_platform'].setValue(this.singleEventDetail.platform)
          this.editEventForm.controls['online_link'].setValue(this.singleEventDetail.event_link)
        }
        this.editEventForm.controls['description'].setValue(this.singleEventDetail.description)
        this.editEventForm.controls['currency'].setValue(this.singleEventSetting.currency)
        this.editEventForm.controls['transaction_fee'].setValue(this.singleEventSetting.transaction_fee)
        this.editEventForm.controls['timezone'].setValue(this.singleEventSetting.timezone)
        this.editEventForm.controls['donation_title'].setValue(this.singleEventSetting.donation_title)
        this.editEventForm.controls['donation_amount'].setValue(this.singleEventSetting.donation_amt)
        this.editEventForm.controls['donation_description'].setValue(this.singleEventSetting.donation_description)
        this.editEventForm.controls['book_btn_title'].setValue(this.singleEventSetting.event_button_title)
        // this.editEventForm.controls['ticket_available'].setValue(this.singleEventSetting.ticket_avilable)
        // this.editEventForm.controls['ticket_unavailable'].setValue(this.singleEventSetting.ticket_unavilable)
        this.editEventForm.controls['redirect_url'].setValue(this.singleEventSetting.redirect_url)
        this.editEventForm.controls['access_code'].setValue(this.singleEventSetting.access_code)
        this.redirectURL= this.singleEventSetting.redirect_confirm_page;
        this.hideEventSearch= this.singleEventSetting.hide_office_listing;
        this.customSalesTax= this.singleEventSetting.custom_sales_tax;
        this.accessCode= this.singleEventSetting.customer_access_code;
        this.donation= this.singleEventSetting.make_donation;
        this.shareButtonStatus= this.singleEventSetting.hide_share_button;
        
        if(this.redirectURL == 'Y'){
          this.fnRedirectURL(true);
        }else{
          this.fnRedirectURL(false);
        }
        if(this.accessCode == 'Y'){
          this.fnAccessCode(true);
        }else{
          this.fnAccessCode(false);
        }
        if(this.donation == 'Y'){
          this.fnChangeDonation(true);
        }else{
          this.fnChangeDonation(false);
        }
        if(this.olPlatForm == 'Y'){
          this.fnolPlatform(true);
        }else{
          this.fnolPlatform(false);
        }
        this.salesTaxVal = JSON.parse(this.singleEventSetting.sales_tax);
        this.salesTax.length = 0;

        this.customSalesTaxArr = this.customSalesTaxForm.get('customSalesTaxArr') as FormArray;

        while (this.customSalesTaxArr.length !== 0) {
          this.customSalesTaxArr.removeAt(0)
        }
        this.salesTaxVal.forEach(element=>{
          this.customSalesTaxArr.push(this.createSalesTaxItem(element.amount, element.label));
        });
        this.salesTax = this.customSalesTaxForm.value.customSalesTaxArr;
      //  this.customSalesTaxArr.removeAt(this.createSalesTaxItem[0]);
        this.salesTax.shift();
        this.change.detectChanges();
      }
    });

  }

  fnSelectImage(imageType){
    this.eventImageType = imageType
    if(this.eventImageType === 'newUploadImage'){
      this.selecetdDefaultImage = undefined;
    }else if(this.eventImageType === 'noImage'){
      this.selecetdDefaultImage = undefined;
      this.newEventImageUrl = "";
    }else{
      this.newEventImageUrl = undefined;
    }
  }
  
  fnSelectDefaultImage(imageName){
    this.selectedImage = imageName
    this.selecetdDefaultImage = imageName;
  }

  

   // time formate 12 to 24
   transformTime(time: any): any {
    let hour = (time.split(':'))[0];
    let temp = (time.split(':'))[1];
    let min = (temp.split(' '))[0];
    let part = (time.split(' '))[1];
    if(part == 'PM' && hour !== '12'){
      hour = Number(hour)+12;
    }
    return `${hour}:${min}`
  }

   // time formate 12 to 24
   transformTime2Part(time: any): any {
    let hour = (time.split(':'))[0];
    let min = (time.split(':'))[1];
    
    return `${hour}:${min}`
  }
  


  // add Event Fns
  
  fnChangeEventStartDate(){
    this.minEventEndDate = this.datePipe.transform(new Date(this.editEventForm.get('event_start_date').value),"yyyy-MM-dd");
    this.todayDate = this.datePipe.transform(new Date(),"yyyy-MM-dd")
    this.selectedStartDate = this.datePipe.transform(new Date(this.editEventForm.get('event_start_date').value),"yyyy-MM-dd")
    if(this.selectedStartDate == this.todayDate){
      this.editEventForm.get('event_start_time').setValue('');
      this.startdateToday=true;
      this.currentTime = this.datePipe.transform(new Date(),"h:mm a")
      this.currentTime = this.transformTime(this.currentTime)
    }else{
      this.startdateToday=false;
    }
    this.editEventForm.get('event_end_date').setValue('');
    this.editEventForm.get('event_end_time').setValue('');
  }

  fnChangeEventEndDate(){
    let startDate = this.datePipe.transform(new Date(this.editEventForm.get('event_start_date').value),"yyyy-MM-dd");
    let endDate = this.datePipe.transform(new Date(this.editEventForm.get('event_end_date').value),"yyyy-MM-dd");
    if(startDate == endDate){
      this.startEndSameDate = true;
    }else{
      this.startEndSameDate = false;
    }
    
    this.editEventForm.get('event_end_time').setValue('');
  }
  
  

  fnOnChangeTime(i){
    //console.log(i)
    this.editEventForm.get('event_end_time').setValue('');
  }


  
  fnChangeDonation(checked){
    if(checked == true){
      this.donation = 'Y' ;
      this.editEventForm.controls["donation_title"].setValidators(Validators.required);
      this.editEventForm.controls["donation_amount"].setValidators([Validators.required,Validators.pattern(this.onlynumericAmount)]);
      // this.editEventForm.controls["donation_description"].setValidators(Validators.required);
      this.editEventForm.controls["donation_title"].updateValueAndValidity();
      this.editEventForm.controls["donation_amount"].updateValueAndValidity();
      this.editEventForm.controls["donation_description"].updateValueAndValidity();
    }else{
      this.donation = 'N' 
      this.editEventForm.controls["donation_title"].setValidators(null);
      this.editEventForm.controls["donation_amount"].setValidators(null);
      this.editEventForm.controls["donation_description"].setValidators(null);
      this.editEventForm.controls["donation_title"].updateValueAndValidity();
      this.editEventForm.controls["donation_amount"].updateValueAndValidity();
      this.editEventForm.controls["donation_description"].updateValueAndValidity();
    }
    this.editEventForm.updateValueAndValidity();
  }

  fnRedirectURL(checked){
    if(checked == true){
      this.redirectURL = 'Y' 
      this.editEventForm.controls["redirect_url"].setValidators(Validators.required);
      this.editEventForm.controls["redirect_url"].updateValueAndValidity();
    }else{
      this.redirectURL = 'N' 
      this.editEventForm.controls["redirect_url"].setValidators(null);
      this.editEventForm.controls["redirect_url"].updateValueAndValidity();
    }
    this.editEventForm.updateValueAndValidity();
  }

  fnAccessCode(checked){
    if(checked == true){
      this.accessCode = 'Y' 
      this.editEventForm.controls["access_code"].setValidators(Validators.required);
      this.editEventForm.controls["access_code"].updateValueAndValidity();
  
    }else{
      this.accessCode = 'N' 
      this.editEventForm.controls["access_code"].setValidators(null);
      this.editEventForm.controls["access_code"].updateValueAndValidity();
    }
    this.editEventForm.updateValueAndValidity();
  }

  fnShareButtonStatus(event){
    if(event.checked == true){
      this.shareButtonStatus = 'Y' 
    }else{
      this.shareButtonStatus = 'N' 
    }
  }

  fnCustomSalesTax(event){
    if(event.checked == true){
      this.customSalesTax = 'Y';
      this.customSalesTaxForm = this._formBuilder.group({
        customSalesTaxArr: this._formBuilder.array([this.createSalesTaxItem()])
      });
    }else{
      this.customSalesTax = 'N' 
    }
  }

  fnHideEventSearch(event){
    if(event.checked == true){
      this.hideEventSearch = 'Y' 
    }else{
      this.hideEventSearch = 'N' 
    }
  }
  
  fnolPlatform(checked){
    if(checked == true){
      this.olPlatForm = 'Y';
      this.editEventForm.controls["online_platform"].setValidators(Validators.required);
      this.editEventForm.controls["vanue_name"].setValidators(null);
      this.editEventForm.controls["vanue_zip"].setValidators(null);
      this.editEventForm.controls["vanue_country"].setValidators(null);
      this.editEventForm.controls["online_platform"].updateValueAndValidity();
      this.editEventForm.controls["vanue_name"].updateValueAndValidity();
      this.editEventForm.controls["vanue_zip"].updateValueAndValidity();
      this.editEventForm.controls["vanue_country"].updateValueAndValidity();
    }else{
      this.olPlatForm = 'N';
      this.editEventForm.controls["online_platform"].setValidators(null);
      this.editEventForm.controls["vanue_name"].setValidators(Validators.required);
      this.editEventForm.controls["vanue_zip"].setValidators(Validators.required);
      this.editEventForm.controls["vanue_country"].setValidators(Validators.required);
      this.editEventForm.controls["online_platform"].updateValueAndValidity();
      this.editEventForm.controls["vanue_name"].updateValueAndValidity();
      this.editEventForm.controls["vanue_zip"].updateValueAndValidity();
      this.editEventForm.controls["vanue_country"].updateValueAndValidity();
    }
    this.editEventForm.updateValueAndValidity();
  }

  
  fnDeleteTicket(ticketCode, index){
  const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
    width: '400px',
    data: "Are you sure want to delete ticket?",
    panelClass: 'confirmation-dialog'
  });
  dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.deleteTicket(ticketCode, index);
      }
  });
}
  
  deleteTicket(ticketCode, index){

    if(ticketCode=='' || ticketCode==null){
      return false;
    }
    
    this.isLoaderAdmin = true;
    
    let requestObject = {
      'unique_code' : ticketCode
    }

    this.SingleEventServiceService.deleteTicket(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.ErrorService.successMessage(response.response);
        this.getSingleEvent();
        // if (index > -1) {
        //     this.eventTicketList.splice(index, 1);
        // }
      }
      else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
    })
      this.isLoaderAdmin = false;
  }

  fnSaveEvent(){
    //console.log('1')
    this.customSalesTaxArr = this.customSalesTaxForm.get('customSalesTaxArr') as FormArray;
    this.salesTax = this.customSalesTaxForm.value.customSalesTaxArr;
    if(this.customSalesTax == 'Y'){
      if(this.salesTax[this.salesTax.length-1].amount == '' && this.salesTax[this.salesTax.length-1].label == ''){
        this.salesTax.splice(this.salesTax.length-1, 1);
      }else if(this.salesTax[this.salesTax.length-1].amount == '' && this.salesTax[this.salesTax.length-1].label != ''){
        this.ErrorService.errorMessage('Sales tax amount is blank.');
        return false;
      }else if(this.salesTax[this.salesTax.length-1].amount != '' && this.salesTax[this.salesTax.length-1].label == ''){
        this.ErrorService.errorMessage('Sales tax lable is blank.');
        return false;
      }
    }
    //console.log(this.editEventForm)
    
    
    if(this.editEventForm.invalid){
      //console.log('invalid')
      if(this.recurringEvent == 'N'){
        this.editEventForm.get('event_name').markAsTouched();
        this.editEventForm.get('event_start_date').markAsTouched();
        this.editEventForm.get('event_start_time').markAsTouched();
        this.editEventForm.get('event_end_date').markAsTouched();
        this.editEventForm.get('event_end_time').markAsTouched();
        this.editEventForm.get('description').markAsTouched();
        this.editEventForm.get('timezone').markAsTouched();
        this.editEventForm.get('book_btn_title').markAsTouched();
        // this.editEventForm.get('ticket_available').markAsTouched();
        // this.editEventForm.get('ticket_unavailable').markAsTouched();
        this.editEventForm.get('donation_title').markAsTouched();
        this.editEventForm.get('donation_amount').markAsTouched();
        this.editEventForm.get('donation_description').markAsTouched();
        this.editEventForm.get('redirect_url').markAsTouched();
        this.editEventForm.get('access_code').markAsTouched();
        this.editEventForm.get('vanue_name').markAsTouched();
        this.editEventForm.get('vanue_zip').markAsTouched();
        this.editEventForm.get('vanue_country').markAsTouched();
        
        //this.scrollToFirstInvalidControl();
        return false;
      }else{
        this.editEventForm.get('event_name').markAsTouched();
        this.editEventForm.get('description').markAsTouched();
        this.editEventForm.get('timezone').markAsTouched();
        this.editEventForm.get('book_btn_title').markAsTouched();
        this.editEventForm.get('donation_title').markAsTouched();
        this.editEventForm.get('donation_amount').markAsTouched();
        this.editEventForm.get('donation_description').markAsTouched();
        this.editEventForm.get('redirect_url').markAsTouched();
        this.editEventForm.get('access_code').markAsTouched();
        this.editEventForm.get('vanue_name').markAsTouched();
        this.editEventForm.get('vanue_zip').markAsTouched();
        this.editEventForm.get('vanue_country').markAsTouched();
        
        //this.scrollToFirstInvalidControl();
        return false;
      }
      
    }
    // if(this.customSalesTaxForm.invalid){
    //   this.ErrorService.errorMessage('Enter valide Sales tax.')
    //   return false;
    // }
    if(this.recurringEvent == 'N'){
      //console.log(this.datePipe.transform(new Date(this.editEventForm.get('event_end_date').value),"yyyy-MM-dd"))
    let requestObject = {
      'unique_code' : this.singleEventDetail.unique_code,
      'boxoffice_id':this.boxOfficeCode,
      'event_title':this.editEventForm.get('event_name').value,
      'start_date':this.datePipe.transform(new Date(this.editEventForm.get('event_start_date').value),"yyyy-MM-dd"),
      'end_date': this.datePipe.transform(new Date(this.editEventForm.get('event_end_date').value),"yyyy-MM-dd"),
      'start_time': this.fullDayTimeSlote[this.editEventForm.get('event_start_time').value],
      'end_time': this.fullDayTimeSlote[this.editEventForm.get('event_end_time').value],
      'venue_name':this.editEventForm.get('vanue_name').value,
      'postal_code':this.editEventForm.get('vanue_zip').value,
      'country':this.editEventForm.get('vanue_country').value,
      'online_event':this.olPlatForm,
      'description':this.editEventForm.get('description').value,
      'platform':this.editEventForm.get('online_platform').value,
      'event_link':this.editEventForm.get('online_link').value,
      'event_status':this.singleEventDetail.event_status,
      'timezone':this.editEventForm.get('timezone').value,
      'make_donation':this.donation,
      'event_button_title':this.editEventForm.get('book_btn_title').value,
      'event_thumb_zoom':this.thumbZoomLavel,
      'event_banner_zoom':this.bannerZoomLavel,
      'donation_title':this.editEventForm.get('donation_title').value,
      'donation_amt':this.editEventForm.get('donation_amount').value,
      'donation_description':this.editEventForm.get('donation_description').value,
      'currency':this.editEventForm.get('currency').value,
      'transaction_fee':this.editEventForm.get('transaction_fee').value,
      'redirect_confirm_page':this.redirectURL,
      'redirect_url':this.editEventForm.get('redirect_url').value,
      'hide_office_listing':this.hideEventSearch,
      'customer_access_code':this.accessCode,
      'access_code':this.editEventForm.get('access_code').value,
      'hide_share_button':this.shareButtonStatus,
      'custom_sales_tax':this.customSalesTax,
      'sales_tax':this.salesTax,
      'image' : this.newEventImageUrl,
      'event_occurrence_type':this.recurringEvent,
      'default_img' : this.selecetdDefaultImage,
      };
      //console.log(requestObject)
      this.updateEvent(requestObject);
    }else{
      let requestObject = {
        'unique_code' : this.singleEventDetail.unique_code,
        'boxoffice_id':this.boxOfficeCode,
        'event_title':this.editEventForm.get('event_name').value,
        'venue_name':this.editEventForm.get('vanue_name').value,
        'postal_code':this.editEventForm.get('vanue_zip').value,
        'country':this.editEventForm.get('vanue_country').value,
        'online_event':this.olPlatForm,
        'description':this.editEventForm.get('description').value,
        'platform':this.editEventForm.get('online_platform').value,
        'event_link':this.editEventForm.get('online_link').value,
        'event_status':this.singleEventDetail.event_status,
        'timezone':this.editEventForm.get('timezone').value,
        'make_donation':this.donation,
        'event_button_title':this.editEventForm.get('book_btn_title').value,
        'event_thumb_zoom':this.thumbZoomLavel,
        'event_banner_zoom':this.bannerZoomLavel,
        'donation_title':this.editEventForm.get('donation_title').value,
        'donation_amt':this.editEventForm.get('donation_amount').value,
        'donation_description':this.editEventForm.get('donation_description').value,
        'currency':this.editEventForm.get('currency').value,
        'transaction_fee':this.editEventForm.get('transaction_fee').value,
        'redirect_confirm_page':this.redirectURL,
        'redirect_url':this.editEventForm.get('redirect_url').value,
        'hide_office_listing':this.hideEventSearch,
        'customer_access_code':this.accessCode,
        'access_code':this.editEventForm.get('access_code').value,
        'hide_share_button':this.shareButtonStatus,
        'custom_sales_tax':this.customSalesTax,
        'sales_tax':this.salesTax,
        'image' : this.newEventImageUrl,
        'event_occurrence_type':this.recurringEvent,
        'default_img' : this.selecetdDefaultImage,
      };
      this.updateEvent(requestObject);
    }
  }


  updateEvent(requestObject){ 
    this.isLoaderAdmin = true;
    this.SingleEventServiceService.updateEvent(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.ErrorService.successMessage(response.response);
        this.SingleEventDashboard.fnGetEventDetail();
        this.getSingleEvent();
      }else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
    });
    this.isLoaderAdmin = false;

  }

  fnEditTicket(index){
    if(this.recurringEvent == 'N'){
      this.selectedTicketDetail = this.eventTicketList[index];
      const dialogRef = this.dialog.open(AddNewTicketType,{
        width: '1100px',
        data : {
          boxOfficeCode : this.boxOfficeCode,
          fullDayTimeSlote : this.fullDayTimeSlote,
          selectedEventId : this.singleEventDetail.unique_code,
          recurringEvent:this.recurringEvent,
          selectedTicketDetail : this.selectedTicketDetail,
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if(result){
          if (index > -1) {
              this.eventTicketList.splice(index, 1);
          }
          this.eventTicketList.push(result)
          this.eventTicketAlertMSG = false;
          this.getSingleEvent();
        }
      });
    }else{
      this.selectedTicketDetail = this.eventTicketList[index];
      const dialogRef = this.dialog.open(AddNewTicketType,{
        width: '1100px',
        data : {
          boxOfficeCode : this.boxOfficeCode,
          fullDayTimeSlote : this.fullDayTimeSlote,
          selectedEventId : this.singleEventDetail.unique_code,
          selectedTicketDetail : this.selectedTicketDetail,
          recurringEvent:this.recurringEvent
        }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          if (index > -1) {
              this.eventTicketList.splice(index, 1);
          }
          this.eventTicketList.push(result)
          this.eventTicketAlertMSG = false;
          this.getSingleEvent();
        }
      });
    }
  }


  
  
  openAddNewTicketTypeDialog() {
    if(this.recurringEvent == 'N'){
      if(
      this.editEventForm.get('event_name').value == '' ||
      this.editEventForm.get('event_start_date').value == '' ||
      this.editEventForm.get('event_start_time').value == '' ||
      this.editEventForm.get('event_end_date').value == '' ||
      this.editEventForm.get('event_end_time').value == ''
      ){
        this.ErrorService.errorMessage('Please fill above details first');
        return false;
      }
      const dialogRef = this.dialog.open(AddNewTicketType,{
        width: '1100px',
        data : {
          boxOfficeCode : this.boxOfficeCode,
          fullDayTimeSlote : this.fullDayTimeSlote,
          selectedEventId : this.singleEventDetail.unique_code,
          recurringEvent:this.recurringEvent,
          startDate : this.datePipe.transform(new Date(this.editEventForm.get('event_start_date').value),"yyyy-MM-dd"),
          endDate : this.datePipe.transform(new Date(this.editEventForm.get('event_end_date').value),"yyyy-MM-dd"),
          startTime : this.editEventForm.get('event_start_time').value,
          endTime : this.editEventForm.get('event_end_time').value,
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if(result){
          
          // this.getSingleEvent();
          this.eventTicketList.push(result);
          this.eventTicketAlertMSG = false;
          this.getSingleEvent();

        }else{
          this.getSingleEvent();
        }
      });
    }else{
      const dialogRef = this.dialog.open(AddNewTicketType,{
        width: '1100px',
        data : {
          boxOfficeCode : this.boxOfficeCode,
          fullDayTimeSlote : this.fullDayTimeSlote,
          recurringEvent:this.recurringEvent,
          selectedEventId : this.singleEventDetail.unique_code,
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if(result){
          this.eventTicketList.push(result)
          this.eventTicketAlertMSG = false;
        }
      });
    }
  }

  // openAddNewTicketGroupDialog() {
  //   const dialogRef = this.dialog.open(AddNewTicketGroup,{
  //     width: '700px',
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //   });
  // }
  

  fnUploadEventImage(){
    const dialogRef = this.dialog.open(DialogEditEventImageUpload, {
      width: '500px',
      
    });
  
     dialogRef.afterClosed().subscribe(result => {
        if(result != undefined){
            this.newEventImageUrl = result;
            this.selecetdDefaultImage  = undefined;
           }
     });
  }

}



@Component({
  selector: 'profile-image-upload',
  templateUrl: '../_dialogs/image-upload.html',
})
export class DialogEditEventImageUpload {

  uploadForm: FormGroup;  
  imageSrc: string;
  profileImage: string;
  
constructor(
  public dialogRef: MatDialogRef<DialogEditEventImageUpload>,
  private _formBuilder:FormBuilder,
  private ErrorService : ErrorService,
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
    var file_type = event.target.files[0].type;
    if(file_type!='image/jpeg' &&  file_type!='image/png' && file_type!='image/jpg' &&  file_type!='image/gif'){
      this.ErrorService.errorMessage("Sorry, only JPG, JPEG, PNG & GIF files are allowed.");
        return;
    }
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
        const [file] = event.target.files;
        reader.readAsDataURL(file);
        reader.onload = () => {
            this.imageSrc = reader.result as string;
            this.uploadForm.patchValue({
                fileSource: reader.result
            });
        };
    }
  }
  uploadImage() {
    this.profileImage = this.imageSrc
    this.dialogRef.close(this.profileImage);
  }


}




@Component({
  selector: 'add-new-ticket-type',
  templateUrl: '../_dialogs/add-new-ticket-type.html',
  providers: [DatePipe]
})
export class AddNewTicketType {
  isLoaderAdmin:boolean = false;
  allCouponCodeList:any;
  boxOfficeCode:any
  addTicketForm:FormGroup;
  minDate= new Date();
  assignedCouponCodes :any = [];
  showQTY:any = 'N';
  soldOut:any = 'N';
  showDes:any = 'N';
  advanceSetting:any = 'N';
  recurringEvent:any = 'N';
  recurringUntil:any = 'N';
  recurringAfter:any = 'N';
  // onlynumeric = /^-?(0|[1-9]\d*)?$/
  onlynumeric = /^[0-9]+(?:\.[0-9]+)?$/
  fullDayTimeSlote:any;
  newTicketData:any;
  selectedTicketDetail:any;
  editTicket : boolean = false;
  selectedEventId:any;
  minAvailDate:any;
  maxAvailDate= new Date();
  minUnavailDate= new Date();
  maxUnavailDate= new Date();
  ticketAvalStatus:any;
  ticketUnavalStatus:any;
  eventStartDate:any;
  eventStartTime:any;
  eventEndDate:any;
  eventEndTime:any;
  onlynumericAmount = /^(\d*\.)?\d+$/
  availUnavailDateSame:boolean=false;
  untilDate:any;
  afterDate:any;
  constructor(
    public dialogRef: MatDialogRef<AddNewTicketType>,
    private _formBuilder: FormBuilder,
    private ErrorService: ErrorService,
    private datePipe: DatePipe,
    private SingleEventServiceService: SingleEventServiceService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      if(this.data.recurringEvent == 'N'){
        this.boxOfficeCode = this.data.boxOfficeCode;
        this.fullDayTimeSlote = this.data.fullDayTimeSlote;
        this.eventStartDate = this.data.startDate;
        this.eventStartTime = this.data.startTime;
        this.eventEndDate = this.data.endDate;
        this.eventEndTime = this.data.endTime;
        this.maxAvailDate = this.eventStartDate;
        this.maxUnavailDate = this.eventEndDate;
        this.selectedTicketDetail = this.data.selectedTicketDetail
        this.selectedEventId = this.data.selectedEventId
      }else{

        this.boxOfficeCode = this.data.boxOfficeCode;
        this.fullDayTimeSlote = this.data.fullDayTimeSlote;
        this.recurringEvent = this.data.recurringEvent;
        this.selectedTicketDetail = this.data.selectedTicketDetail
        this.selectedEventId = this.data.selectedEventId
        //console.log(this.selectedTicketDetail)
      }
      //console.log(this.selectedTicketDetail)
      if(this.recurringEvent == 'N'){
        if(this.selectedTicketDetail){
          if(this.selectedTicketDetail.discount.length !== 0){
            this.assignedCouponCodes = this.selectedTicketDetail.discount
          }
          this.editTicket = true;
          this.advanceSetting = this.selectedTicketDetail.advance_setting
          this.soldOut = this.selectedTicketDetail.sold_out
          this.showQTY = this.selectedTicketDetail.show_qty
          this.ticketAvalStatus = this.selectedTicketDetail.ticket_avilable
          this.selectedEventId = this.data.selectedEventId
          this.ticketUnavalStatus = this.selectedTicketDetail.ticket_unavilable
          
          this.addTicketForm = this._formBuilder.group({
            title: [this.selectedTicketDetail.ticket_name,[Validators.required]],
            price: [this.selectedTicketDetail.prize,[Validators.required,Validators.pattern(this.onlynumericAmount)]],
            qty: [this.selectedTicketDetail.qty,[Validators.required,Validators.pattern(this.onlynumeric)]],
            description: [this.selectedTicketDetail.description,[]],
            fee: [this.selectedTicketDetail.booking_fee,[Validators.pattern(this.onlynumericAmount)]],
            status: [this.selectedTicketDetail.status],
            min_order: [this.selectedTicketDetail.min_per_order,[Validators.pattern(this.onlynumeric)]],
            max_order: [this.selectedTicketDetail.max_per_order,[Validators.pattern(this.onlynumeric)]],
            ticket_available: [this.selectedTicketDetail.ticket_avilable,[Validators.required]],
            ticket_unavailable: [this.selectedTicketDetail.ticket_unavilable,[Validators.required]],
            until_date: [this.selectedTicketDetail.untill_date],
            until_time: [this.selectedTicketDetail.untill_time],
            until_interval: [this.selectedTicketDetail.untill_interval],
            after_date: [this.selectedTicketDetail.after_date],
            after_time: [this.selectedTicketDetail.after_time],
            after_interval: [this.selectedTicketDetail.after_interval]
          });
        }else{
          this.editTicket = false;
          this.addTicketForm = this._formBuilder.group({
            title: ['',[Validators.required]],
            price: ['',[Validators.required,Validators.pattern(this.onlynumericAmount)]],
            qty: ['',[Validators.required,Validators.pattern(this.onlynumeric)]],
            description: [''],
            fee: ['',[Validators.pattern(this.onlynumericAmount)]],
            status: [''],
            min_order: ['',[Validators.pattern(this.onlynumeric)]],
            max_order: ['',[Validators.pattern(this.onlynumeric)]],
            ticket_available: ['',[Validators.required]],
            ticket_unavailable: ['',[Validators.required]],
            until_date: [null],
            until_time: [null],
            until_interval: [''],
            after_date: [null],
            after_time: [null],
            after_interval: ['']
          });
        } 
      }else{
        if(this.selectedTicketDetail){
          if(this.selectedTicketDetail.discount && this.selectedTicketDetail.discount.length !== 0){
            this.assignedCouponCodes = this.selectedTicketDetail.discount
          }
          this.editTicket = true;
          this.recurringUntil = this.selectedTicketDetail.hide_until_set_date_and_time_status;
          this.recurringAfter = this.selectedTicketDetail.hide_after_set_date_and_time_status;
          this.advanceSetting = this.selectedTicketDetail.advance_setting
          this.soldOut = this.selectedTicketDetail.sold_out
          this.showQTY = this.selectedTicketDetail.show_qty
          this.selectedEventId = this.data.selectedEventId
          
          this.addTicketForm = this._formBuilder.group({
            title: [this.selectedTicketDetail.ticket_name,[Validators.required]],
            price: [this.selectedTicketDetail.prize,[Validators.required,Validators.pattern(this.onlynumericAmount)]],
            qty: [this.selectedTicketDetail.qty,[Validators.required,Validators.pattern(this.onlynumeric)]],
            description: [this.selectedTicketDetail.description,[]],
            fee: [this.selectedTicketDetail.booking_fee,[Validators.pattern(this.onlynumericAmount)]],
            status: [this.selectedTicketDetail.status],
            min_order: [this.selectedTicketDetail.min_per_order,[Validators.pattern(this.onlynumeric)]],
            max_order: [this.selectedTicketDetail.max_per_order,[Validators.pattern(this.onlynumeric)]],
            recurring_until_date: [this.selectedTicketDetail.hide_until_date],
            recurring_until_time: [this.selectedTicketDetail.hide_until_time],
            recurring_after_date: [this.selectedTicketDetail.hide_after_date],
            recurring_after_time: [this.selectedTicketDetail.hide_after_time],
          });
        }else{
          this.editTicket = false;
          this.addTicketForm = this._formBuilder.group({
            title: ['',[Validators.required]],
            price: ['',[Validators.required,Validators.pattern(this.onlynumericAmount)]],
            qty: ['',[Validators.required,Validators.pattern(this.onlynumeric)]],
            description: [''],
            fee: ['',[Validators.pattern(this.onlynumericAmount)]],
            status: [''],
            min_order: ['',[Validators.pattern(this.onlynumeric)]],
            max_order: ['',[Validators.pattern(this.onlynumeric)]],
            recurring_until_date: [null],
            recurring_until_time: [null],
            recurring_after_date: [null],
            recurring_after_time: [null],
          });
        }
      }
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

 

  ngOnInit() {
    this.getAllCouponCodes();
  }
  
  fnChangeQTY(event){
    this.addTicketForm.controls['min_order'].setValue(null);
    this.addTicketForm.controls['max_order'].setValue(null);
  }
  
  fnChangeMinOr(event){
    if(parseInt(this.addTicketForm.get('min_order').value) > parseInt(this.addTicketForm.get('qty').value)){
      this.ErrorService.errorMessage('Minimum order should not greater then quantity.');
      this.addTicketForm.controls['min_order'].setValue('');
    }
    this.addTicketForm.controls['max_order'].setValue('');
  }
  
  fnChangeMaxOr(event){
    if(parseInt(this.addTicketForm.get('max_order').value) > parseInt(this.addTicketForm.get('qty').value)){
      this.ErrorService.errorMessage('Maximum order should not greater then quantity.');
      this.addTicketForm.controls['max_order'].setValue('');
    }else if(parseInt(this.addTicketForm.get('max_order').value) < parseInt(this.addTicketForm.get('min_order').value)){
      this.ErrorService.errorMessage('Maximum order should not less then min order.');
      this.addTicketForm.controls['max_order'].setValue('');
    }

  }

  transformTime24To12(time: any): any {
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
  }

  fnAvailDateChange(event){
    this.minUnavailDate = event.value
    // if(this.recurringEvent == 'Y'){
    // this.minAvailDate = new Date();
    // }
    if(this.recurringEvent == 'N'){
      this.untilDate = this.datePipe.transform(new Date(this.addTicketForm.get('until_date').value),"yyyy-MM-dd");
      //console.log(this.untilDate)
      //console.log(this.eventStartDate)
      this.addTicketForm.controls['until_time'].setValue(null);
      this.addTicketForm.controls['after_date'].setValue(null);
      this.addTicketForm.controls['after_time'].setValue(null);
    }
    
  }
  fnAvailTimeChange(event){
    if(this.recurringEvent == 'N'){
      this.addTicketForm.controls['after_time'].setValue(null);
    }
    
  }
  fnUnavailDateChange(event){
    if(this.recurringEvent == 'N'){
      this.afterDate = this.datePipe.transform(new Date(this.addTicketForm.get('after_date').value),"yyyy-MM-dd");
      this.addTicketForm.controls['after_time'].setValue(null);
      if(this.datePipe.transform(new Date(event.value),"yyyy-MM-dd") == this.datePipe.transform(new Date(this.addTicketForm.get('until_date').value),"yyyy-MM-dd")){
        this.availUnavailDateSame = true;
      }else{
        this.availUnavailDateSame = false;
      }
    }
    // this.minUnavailDate = event.value
  }

  getAllCouponCodes(){
    this.isLoaderAdmin = true;
    let requestObject = {
      'search':'',
      'boxoffice_id' : this.boxOfficeCode
    }
    this.SingleEventServiceService.getAllCouponCodes(requestObject).subscribe((response:any) => {
      if(response.data == true){
      this.allCouponCodeList = response.response
      }
      else if(response.data == false){
      // this.ErrorService.errorMessage(response.response);
      this.allCouponCodeList = null;
      }
    })
      this.isLoaderAdmin = false;
  }

  fnAddCoupon(event, couponCode){
    if(event.checked == true){
      this.assignedCouponCodes.push(couponCode)
    }else{
      const index = this.assignedCouponCodes.indexOf(couponCode, 0);
      if (index > -1) {
          this.assignedCouponCodes.splice(index, 1);
      }
    }
  }

  fnChangeShowQTY(event){
    if(event.checked == true){
      this.showQTY = 'Y';
    }else{
      this.showQTY = 'N';
    }
  }

  fnChangeSoldOut(event){
    if(event.checked == true){
      this.soldOut = 'Y';
    }else{
      this.soldOut = 'N';
    }
  }

  fnChangeAdvSetting(event){
    if(event.checked == true){
      this.advanceSetting = 'Y';
    }else{
      this.advanceSetting = 'N';
    }
  }

  fnChangeRecurringUntil(event){
    if(event.checked == true){
      this.recurringUntil = 'Y';
      this.addTicketForm.controls["recurring_until_date"].setValidators(Validators.required);
      this.addTicketForm.controls["recurring_until_time"].setValidators(Validators.required);
      this.addTicketForm.controls["recurring_until_date"].updateValueAndValidity();
      this.addTicketForm.controls["recurring_until_time"].updateValueAndValidity();

    }else{
      this.recurringUntil = 'N';
      this.addTicketForm.controls["recurring_until_date"].setValidators(null);
      this.addTicketForm.controls["recurring_until_time"].setValidators(null);
      this.addTicketForm.controls["recurring_until_date"].updateValueAndValidity();
      this.addTicketForm.controls["recurring_until_time"].updateValueAndValidity();

    }
    this.addTicketForm.updateValueAndValidity();
  }

  fnChangeRecurringAfter(event){
    if(event.checked == true){
      this.recurringAfter = 'Y';
      this.addTicketForm.controls["recurring_after_date"].setValidators(Validators.required);
      this.addTicketForm.controls["recurring_after_time"].setValidators(Validators.required);
      this.addTicketForm.controls["recurring_after_date"].updateValueAndValidity();
      this.addTicketForm.controls["recurring_after_time"].updateValueAndValidity();

    }else{
      this.recurringAfter = 'N';
      this.addTicketForm.controls["recurring_after_date"].setValidators(null);
      this.addTicketForm.controls["recurring_after_time"].setValidators(null);
      this.addTicketForm.controls["recurring_after_date"].updateValueAndValidity();
      this.addTicketForm.controls["recurring_after_time"].updateValueAndValidity();
    }
    this.addTicketForm.updateValueAndValidity();
  }

  
  getTicketAvailTooltip(ticketAvalStatus){
    if(ticketAvalStatus == 'PB'){
      return 'When the event is published';
    }else if(ticketAvalStatus == 'SDT'){
      return 'At a scheduled date and time';
    }else if(ticketAvalStatus == 'SIB'){
      return 'At a scheduled interval before the event starts';
    }
  }

  getTicketUnavailTooltip(ticketUnavalStatus){
    if(ticketUnavalStatus == 'TOS'){
      return 'When the event is taken off, or the event passes';
    }else if(ticketUnavalStatus == 'SDT'){
      return 'At a scheduled date and time';
    }else if(ticketUnavalStatus == 'SIB'){
      return 'At a scheduled interval before the event starts';
    }
  }

  fnTicketAvailableStatus(event){
    this.ticketAvalStatus = event.value;
    this.addTicketForm.controls['until_date'].setValue(null);
    this.addTicketForm.controls['until_time'].setValue(null);
    this.addTicketForm.controls['until_interval'].setValue('');
    this.addTicketForm.controls['after_date'].setValue(null);
    this.addTicketForm.controls['after_time'].setValue(null);
    this.addTicketForm.controls['after_interval'].setValue('');
    this.addTicketForm.controls['ticket_unavailable'].setValue('');
    if(event.value == 'SDT'){
      this.addTicketForm.controls["until_date"].setValidators(Validators.required);
      this.addTicketForm.controls["until_time"].setValidators(Validators.required);
      this.addTicketForm.controls["until_interval"].setValidators(null);
      this.addTicketForm.controls["until_date"].updateValueAndValidity();
      this.addTicketForm.controls["until_time"].updateValueAndValidity();
      this.addTicketForm.controls["until_interval"].updateValueAndValidity();

    }else if(event.value == 'SIB'){
      this.addTicketForm.controls["until_interval"].setValidators(Validators.required);
      this.addTicketForm.controls["until_date"].setValidators(null);
      this.addTicketForm.controls["until_time"].setValidators(null);
      this.addTicketForm.controls["until_interval"].updateValueAndValidity();
      this.addTicketForm.controls["until_date"].updateValueAndValidity();
      this.addTicketForm.controls["until_time"].updateValueAndValidity();
    }else{
      this.addTicketForm.controls["until_interval"].setValidators(null);
      this.addTicketForm.controls["until_date"].setValidators(null);
      this.addTicketForm.controls["until_time"].setValidators(null);
      this.addTicketForm.controls["until_interval"].updateValueAndValidity();
      this.addTicketForm.controls["until_date"].updateValueAndValidity();
      this.addTicketForm.controls["until_time"].updateValueAndValidity();
    }
    this.addTicketForm.updateValueAndValidity();
  }

  fnTicketUnavailableStatus(event){
    this.ticketUnavalStatus = event.value;
    this.addTicketForm.controls['after_date'].setValue(null);
    this.addTicketForm.controls['after_time'].setValue(null);
    this.addTicketForm.controls['after_interval'].setValue('');
    if(event.value == 'SDT'){
      this.addTicketForm.controls["after_date"].setValidators(Validators.required);
      this.addTicketForm.controls["after_time"].setValidators(Validators.required);
      this.addTicketForm.controls["after_interval"].setValidators(null);
      this.addTicketForm.controls["after_date"].updateValueAndValidity();
      this.addTicketForm.controls["after_time"].updateValueAndValidity();
      this.addTicketForm.controls["after_interval"].updateValueAndValidity();
    }else if(event.value == 'SIB'){
      this.addTicketForm.controls["after_interval"].setValidators(Validators.required);
      this.addTicketForm.controls["after_date"].setValidators(null);
      this.addTicketForm.controls["after_time"].setValidators(null);
      this.addTicketForm.controls["after_interval"].updateValueAndValidity();
      this.addTicketForm.controls["after_date"].updateValueAndValidity();
      this.addTicketForm.controls["after_time"].updateValueAndValidity();
    }else{
      this.addTicketForm.controls["after_interval"].setValidators(null);
      this.addTicketForm.controls["after_date"].setValidators(null);
      this.addTicketForm.controls["after_time"].setValidators(null);
      this.addTicketForm.controls["after_interval"].updateValueAndValidity();
      this.addTicketForm.controls["after_date"].updateValueAndValidity();
      this.addTicketForm.controls["after_time"].updateValueAndValidity();
    }
    this.addTicketForm.updateValueAndValidity();
  }

  fnUntilIntervalChange(event){
    this.addTicketForm.controls['after_interval'].setValue('');
  }
  

  fnSubmitAddTicketForm(){
    console.log(this.addTicketForm)
    if(this.addTicketForm.invalid){
      if(this.recurringEvent == 'N'){
        this.addTicketForm.get('title').markAsTouched();
        this.addTicketForm.get('price').markAsTouched();
        this.addTicketForm.get('qty').markAsTouched();
        this.addTicketForm.get('description').markAsTouched();
        this.addTicketForm.get('fee').markAsTouched();
        this.addTicketForm.get('status').markAsTouched();
        this.addTicketForm.get('min_order').markAsTouched();
        this.addTicketForm.get('max_order').markAsTouched();
        this.addTicketForm.get('until_date').markAsTouched();
        this.addTicketForm.get('until_time').markAsTouched();
        this.addTicketForm.get('after_date').markAsTouched();
        this.addTicketForm.get('after_time').markAsTouched();
        this.addTicketForm.get('until_interval').markAsTouched();
        this.addTicketForm.get('after_interval').markAsTouched();
        this.addTicketForm.get('ticket_available').markAsTouched();
        this.addTicketForm.get('ticket_unavailable').markAsTouched();
      }else{
        this.addTicketForm.get('title').markAsTouched();
        this.addTicketForm.get('price').markAsTouched();
        this.addTicketForm.get('qty').markAsTouched();
        this.addTicketForm.get('description').markAsTouched();
        this.addTicketForm.get('fee').markAsTouched();
        this.addTicketForm.get('status').markAsTouched();
        this.addTicketForm.get('min_order').markAsTouched();
        this.addTicketForm.get('max_order').markAsTouched();
        this.addTicketForm.get('recurring_until_date').markAsTouched();
        this.addTicketForm.get('recurring_until_time').markAsTouched();
        this.addTicketForm.get('recurring_after_date').markAsTouched();
        this.addTicketForm.get('recurring_after_time').markAsTouched();
      }
      return false;
    }

    if(this.recurringEvent == 'N'){
    if(this.editTicket){
      if(this.addTicketForm.get('until_date').value){
        this.addTicketForm.controls['until_date'].setValue(this.datePipe.transform(new Date(this.addTicketForm.get('until_date').value),"yyyy-MM-dd"))
      }
      if(this.addTicketForm.get('after_date').value){
        this.addTicketForm.controls['after_date'].setValue(this.datePipe.transform(new Date(this.addTicketForm.get('after_date').value),"yyyy-MM-dd"))
      }
      let requestObject = {
        'unique_code': this.selectedTicketDetail.unique_code,
        'event_id': this.selectedEventId,
        'box_office_id': this.boxOfficeCode,
        'ticket_name': this.addTicketForm.get('title').value,
        'prize': this.addTicketForm.get('price').value,
        'qty': this.addTicketForm.get('qty').value,
        'advance_setting': this.advanceSetting,
        'description':  this.addTicketForm.get('description').value,
        'booking_fee':  this.addTicketForm.get('fee').value,
        'status':  this.addTicketForm.get('status').value,
        'min_per_order':  this.addTicketForm.get('min_order').value,
        'max_per_order':this.addTicketForm.get('max_order').value,
        'hide_untill': 'Y',
        'hide_after':  'Y',
        'ticket_avilable':this.addTicketForm.get('ticket_available').value,
        'ticket_unavilable':this.addTicketForm.get('ticket_unavailable').value,
        'untill_date':this.addTicketForm.get('until_date').value,
        'untill_time': this.addTicketForm.get('until_time').value,
        'after_date':  this.addTicketForm.get('after_date').value,
        'after_time':  this.addTicketForm.get('after_time').value,
        'sold_out':  this.soldOut,
        'show_qty':  this.showQTY,
        'discount':  this.assignedCouponCodes,
        'untill_interval':  this.addTicketForm.get('until_interval').value,
        'after_interval':  this.addTicketForm.get('after_interval').value,
      }
      this.UpdateTicket(requestObject);
    }else {
      if(this.addTicketForm.get('until_date').value){
        this.addTicketForm.controls['until_date'].setValue(this.datePipe.transform(new Date(this.addTicketForm.get('until_date').value),"yyyy-MM-dd"))
      }
      if(this.addTicketForm.get('after_date').value){
        this.addTicketForm.controls['after_date'].setValue(this.datePipe.transform(new Date(this.addTicketForm.get('after_date').value),"yyyy-MM-dd"))
      }
    this.newTicketData = {
      'event_id' : this.selectedEventId,
      'box_office_id': this.boxOfficeCode,
      'ticket_name': this.addTicketForm.get('title').value,
      'prize': this.addTicketForm.get('price').value,
      'qty': this.addTicketForm.get('qty').value,
      'advance_setting': this.advanceSetting,
      'description':  this.addTicketForm.get('description').value,
      'booking_fee':  this.addTicketForm.get('fee').value,
      'status':  this.addTicketForm.get('status').value,
      'min_per_order':  this.addTicketForm.get('min_order').value ? this.addTicketForm.get('min_order').value:null,
      'max_per_order':this.addTicketForm.get('max_order').value ? this.addTicketForm.get('max_order').value : null,
      'hide_untill': 'Y',
      'hide_after':  'Y',
      'ticket_avilable':this.addTicketForm.get('ticket_available').value,
      'ticket_unavilable':this.addTicketForm.get('ticket_unavailable').value,
      'untill_date': this.addTicketForm.get('until_date').value,
      'untill_time': this.addTicketForm.get('until_time').value,
      'after_date':  this.addTicketForm.get('after_date').value,
      'after_time':  this.addTicketForm.get('after_time').value,
      'sold_out':  this.soldOut,
      'show_qty':  this.showQTY,
      'discount':  this.assignedCouponCodes,
      'untill_interval':  this.addTicketForm.get('until_interval').value,
      'after_interval':  this.addTicketForm.get('after_interval').value,
    }
    this.createTicket(this.newTicketData)
    }
  }else{
    if(this.editTicket){
      let requestObject = {
        'unique_code': this.selectedTicketDetail.unique_code,
        'box_office_id': this.boxOfficeCode,
        'event_id': this.selectedEventId,
        'ticket_name': this.addTicketForm.get('title').value,
        'prize': this.addTicketForm.get('price').value,
        'qty': this.addTicketForm.get('qty').value,
        'advance_setting': this.advanceSetting,
        'description':  this.addTicketForm.get('description').value,
        'booking_fee':  this.addTicketForm.get('fee').value,
        'status':  this.addTicketForm.get('status').value,
        'min_per_order':  this.addTicketForm.get('min_order').value ? this.addTicketForm.get('min_order').value:null,
        'max_per_order':this.addTicketForm.get('max_order').value ? this.addTicketForm.get('max_order').value : null,
        'hide_untill': 'Y',
        'hide_after':  'Y',
        'ticket_avilable':null,
        'ticket_unavilable':null,
        'sold_out':  this.soldOut,
        'show_qty':  this.showQTY,
        'discount':  this.assignedCouponCodes,
        'hide_until_set_date_and_time_status': this.recurringUntil,
        'hide_after_set_date_and_time_status': this.recurringAfter,
        'hide_until_date':this.addTicketForm.get('recurring_until_date').value ? this.datePipe.transform(new Date(this.addTicketForm.get('recurring_until_date').value),"yyyy-MM-dd") : null,
        'hide_until_time': this.addTicketForm.get('recurring_until_time').value ? this.addTicketForm.get('recurring_until_time').value : null,
        'hide_after_date':  this.addTicketForm.get('recurring_after_date').value ? this.datePipe.transform(new Date(this.addTicketForm.get('recurring_after_date').value),"yyyy-MM-dd") : null,
        'hide_after_time':  this.addTicketForm.get('recurring_after_time').value ? this.addTicketForm.get('recurring_after_time').value: null,
      }
      this.UpdateTicket(requestObject);
    }else {
    this.newTicketData = {
      'event_id' : this.selectedEventId,
      'box_office_id': this.boxOfficeCode,
      'ticket_name': this.addTicketForm.get('title').value,
      'prize': this.addTicketForm.get('price').value,
      'qty': this.addTicketForm.get('qty').value,
      'advance_setting': this.advanceSetting,
      'description':  this.addTicketForm.get('description').value,
      'booking_fee':  this.addTicketForm.get('fee').value,
      'status':  this.addTicketForm.get('status').value,
      'min_per_order':  this.addTicketForm.get('min_order').value ? this.addTicketForm.get('min_order').value : null,
      'max_per_order':this.addTicketForm.get('max_order').value?this.addTicketForm.get('max_order').value:null,
      'hide_untill': 'Y',
      'hide_after':  'Y',
      'ticket_avilable':null,
      'ticket_unavilable':null,
      'discount':  this.assignedCouponCodes,
      'sold_out':  this.soldOut,
      'show_qty':  this.showQTY,
      'hide_until_set_date_and_time_status': this.recurringUntil,
      'hide_after_set_date_and_time_status': this.recurringAfter,
      'hide_until_date':this.addTicketForm.get('recurring_until_date').value ? this.datePipe.transform(new Date(this.addTicketForm.get('recurring_until_date').value),"yyyy-MM-dd") : null,
      'hide_until_time': this.addTicketForm.get('recurring_until_time').value ? this.addTicketForm.get('recurring_until_time').value : null,
      'hide_after_date':  this.addTicketForm.get('recurring_after_date').value ? this.datePipe.transform(new Date(this.addTicketForm.get('recurring_after_date').value),"yyyy-MM-dd") : null,
      'hide_after_time':  this.addTicketForm.get('recurring_after_time').value ? this.addTicketForm.get('recurring_after_time').value: null,
    }
    this.createTicket(this.newTicketData)
    }
  }
  }


  UpdateTicket(requestObject){
    this.isLoaderAdmin = true;
    this.SingleEventServiceService.UpdateTicket(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.ErrorService.successMessage(response.response);
        this.assignedCouponCodes = [];
        this.addTicketForm.reset();
        this.dialogRef.close(requestObject);
      }
      else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
    this.isLoaderAdmin = false;
    })
  }

  createTicket(requestObject){
    this.isLoaderAdmin = true;
    this.SingleEventServiceService.createTicket(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.ErrorService.successMessage('Ticket is created.');
        this.assignedCouponCodes = [];
        this.addTicketForm.reset();
        this.dialogRef.close(this.newTicketData);
      }
      else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
    this.isLoaderAdmin = false;
    })
  }
  
 
}


// @Component({
//   selector: 'add-new-ticket-group',
//   templateUrl: '../_dialogs/add-new-ticket-group.html',
//   providers: [DatePipe]
// })
// export class AddNewTicketGroup {
//   constructor(
//     public dialogRef: MatDialogRef<AddNewTicketGroup>,
//     private datePipe: DatePipe,
//     @Inject(MAT_DIALOG_DATA) public data: any) {
//     }

//   onNoClick(): void {
//     this.dialogRef.close();
//   }
//   ngOnInit() {
//   }
 
// }
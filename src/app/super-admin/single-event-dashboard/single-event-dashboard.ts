import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators,FormControl, FormArray } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { SuperadminService } from '../_services/superadmin.service';
import { ErrorService } from '../../_services/error.service';
import { DatePipe} from '@angular/common';
import { Router, RouterEvent, RouterOutlet,ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment'
import { SingleEventServiceService } from './_services/single-event-service.service';
import { CardDetailDialogComponent } from '../../_components/card-detail-dialog/card-detail-dialog';

@Component({
  selector: 'single-event-dashboard',
  templateUrl: './single-event-dashboard.html',
  styleUrls: ['./single-event-dashboard.scss'],
  providers: [DatePipe]
})
export class SingleEventDashboard implements OnInit {
  pageName :any = '';
  eventStatus='draft';
  eventSideMenu:boolean = true;
  eventId:string = localStorage.getItem('selectedEventCode');
  eventDetail:any;
  boxOfficeDetail:any;
  currentUrl: string;
  pageSlug:any;
  eventURL:any;
  eventSummery:any = [];
  currentUser:any;
  subPermission:any=[];
  isPastEvent:boolean=false;
  keepMe:any;
  selectedOccurrence:any='all';
  recurringEvent:any='N';
  constructor(
    private _formBuilder: FormBuilder,
    public dialog: MatDialog,
    private ErrorService: ErrorService,
    private router: Router,
    private DatePipe:DatePipe,
    private SuperadminService: SuperadminService,
    private SingleEventServiceService: SingleEventServiceService,

  ) {
    this.eventSideMenu = true;
    this.keepMe = localStorage.getItem('keepMeSignIn')
    if (this.keepMe == 'true') {
      this.currentUser =  JSON.parse(localStorage.getItem('currentUser'))
    } else {
      this.currentUser =  JSON.parse(sessionStorage.getItem('currentUser'))
    }
    // if(localStorage.getItem('selectedOccurrence')){
    //   this.selectedOccurrence = localStorage.getItem('selectedOccurrence');
    // }

      if(this.currentUser.type == 'member' &&  this.currentUser.permission != 'A'){
        if(localStorage.getItem('permision_EM') != 'TRUE'){
          this.router.navigate(['/super-admin']);
        }else{
          if(this.currentUser.sub_permission){
            this.subPermission = this.currentUser.sub_permission.split(',',4)
          }
        }
      }else{
        this.subPermission = 'admin';
      }
    
    this.router.events.subscribe(event => {
      if (event instanceof RouterEvent) this.handleRoute(event);
    });
    
    this.eventURL = environment.bookingPageUrl+'/event/'+this.eventId;
  }

  ngOnInit(): void {
    this.fnGetEventDetail();
    this.fnGetBoxOfficeDetail();
  }

  fnEventSummery(){

    let request = {
      'event_id' : this.eventId,
    }

    this.SingleEventServiceService.getSingleSummery(request).subscribe((response:any) => {
      if(response.data == true){
        this.eventSummery = response.response;
      } else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
    });

  }

  
  getSingleOccurrenceSummary(occurrenceCode){
    let requestObject = {
      'occurrence_id' : occurrenceCode,
      'event_id' : this.eventId,
    };
    
    this.SingleEventServiceService.singleOccurrenceDetail(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.eventSummery = response.response;
      } else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
    });    
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

  fnGetEventDetail(){

    let requestObject = {
      'unique_code' : this.eventId,
    }

    this.SingleEventServiceService.getSingleEvent(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.eventDetail = response.response.event[0];
        localStorage.setItem('isRecurrenceEvent',this.eventDetail.event_occurrence_type)
        
        this.recurringEvent = this.eventDetail.event_occurrence_type;
        if(this.eventDetail.event_occurrence_type == 'N'){
          this.isPastEvent = response.response.past;
          this.eventDetail.start_date = this.DatePipe.transform(new Date(this.eventDetail.start_date),"EEE MMM d, y")
        }
        if(this.eventDetail.images.length === 0){
          this.eventDetail.images = undefined
        }else{
        }
        this.eventStatus = this.eventDetail.event_status;
        if(this.recurringEvent == 'Y'){
          this.getSingleOccurrenceSummary(this.selectedOccurrence);
        }else{ 

          this.fnEventSummery();
        }
      } else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
    });

  }

  fnGetBoxOfficeDetail(){
    let requestObject = {
      'unique_code' : localStorage.getItem('boxoffice_id'),
    }
    this.SingleEventServiceService.getSingleBoxofficeDetails(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.boxOfficeDetail = response.response[0];
      } else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
    });
  }

  fnChangeEventStatus(status){

    let requestObject = {
      'unique_code' : this.eventId,
      'event_status' : status,
      'boxoffice_code' : localStorage.getItem('boxoffice_id'),
    }

    this.SingleEventServiceService.updateEventStatus(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.ErrorService.successMessage(response.response);
      } else if(response.data == false){
        if(response.response == 'Card details is not updated!'){
          const dialogRef = this.dialog.open(CardDetailDialogComponent, {
            width: '700px',
            data: {status : 'new'}
          });
           dialogRef.afterClosed().subscribe(result => {
            if(result == 'success'){
              this.fnChangeEventStatus(status);
            }else{
              this.fnGetEventDetail();
              this.fnGetBoxOfficeDetail();
            }
          });
        }else{
          this.ErrorService.errorMessage(response.response);
        }
      }
    });

  }
  
  fnPostUrl(postUrl){
    this.pageName = postUrl; 
  }

  fnClickOnDuplicate(){
    this.eventSideMenu = false;
  }


  goToCreateBroadcast() {
    this.router.navigate(['/super-admin/single-event-dashboard/broadcast'], { queryParams: { broadcast: 'new' } });
    this.pageName = 'broadcast';
  }

  dynamicSort(property: string) {
    let sortOrder = 1;

    if (property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
    }

    return (a, b) => {
      const result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
      return result * sortOrder;
    };
  }

  private getUrl(event: any) {
    if (event) {
      this.pageSlug = event.url.split('/' , 2)
      const url = event.url;
      const state = (event.state) ? event.state.url : null;
      const redirect = (event.urlAfterRedirects) ? event.urlAfterRedirects : null;
      const longest = [url, state, redirect].filter(value => !!value).sort(this.dynamicSort('-length'));
      if (longest.length > 0) return longest[0];
    }
  }

  private cleanUrl(url: string) {
    if (url) {
      let cleanUrl = url.substr(1);
      const slashIndex = cleanUrl.indexOf("/");
      if (slashIndex >= 0) {
        cleanUrl = cleanUrl.substr(slashIndex + 1, 8);
        return cleanUrl;
      } else {
        return null;
      }
    } else return null;
  }

  private urlIsNew(url: string) {
    return !!url && url.length > 0 && url !== this.currentUrl;
  }
  private handleRoute(event: RouterEvent) {
    const url = this.getUrl(event);
    this.currentUrl = url;
  
    if(url === '/super-admin/single-event-dashboard/duplicate'){
      this.eventSideMenu = false;
    }else{
      this.eventSideMenu = true;
    }
    if(url === '/super-admin/single-event-dashboard/event-summary' ){
      this.pageName = 'event-summary';
    }
    else if(url === '/super-admin/single-event-dashboard'){
      this.pageName= 'event-summary'
    }
    else if(url === '/super-admin/single-event-dashboard/issued-ticket'){
      this.pageName= 'issued-ticket'
    }
    else if(url === '/super-admin/single-event-dashboard/waitilist-signup'){
      this.pageName= 'waitilist-signup'
    }
    else if(url === '/super-admin/single-event-dashboard/broadcast'){
      this.pageName= 'broadcast'
    }
    else if(url === '/super-admin/single-event-dashboard/event-and-ticket-types'){
      this.pageName= 'event-and-ticket-types'
    }
    else if(url === '/super-admin/single-event-dashboard/order-confirmation'){
      this.pageName= 'order-confirmation'
    }
    else if(url === '/super-admin/single-event-dashboard/checkout-form'){
      this.pageName= 'checkout-form'
    }
    else if(url === '/super-admin/single-event-dashboard/duplicate'){
      this.pageName= 'duplicate'
    }
    else if(url === '/super-admin/single-event-dashboard/delete'){
      this.pageName= 'delete'
    }
    else if(url === '/super-admin/single-event-dashboard/manage-occurrences'){
      this.pageName= 'manage-occurrences'
    }
  }

  previewEvent(){
     window.open(this.eventURL+'?preview=true','_blank');
     return false;
  }


  
  fnShare(type) {
    if(type=='facebook'){
      window.open('http://www.facebook.com/sharer.php?u='+encodeURIComponent(this.eventURL), "_blank", "width=600,height=600");
    }else if(type=='twitter'){
      window.open('https://twitter.com/intent/tweet?text='+ this.eventDetail.venue_name +' '+encodeURIComponent(this.eventURL), "_blank", "width=600,height=600");
    }
  }
  
}



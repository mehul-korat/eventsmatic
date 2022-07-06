import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators,FormControl } from '@angular/forms';
import {SingleEventServiceService} from '../_services/single-event-service.service';
import { ErrorService } from '../../../_services/error.service';
import { ConfirmationDialogComponent } from '../../../_components/confirmation-dialog/confirmation-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import { ExportToCsv } from 'export-to-csv';
import { DatePipe} from '@angular/common';
import { SingleEventDashboard } from '../single-event-dashboard'

@Component({
  selector: 'app-waitilist-signup',
  templateUrl: './waitilist-signup.component.html',
  styleUrls: ['./waitilist-signup.component.scss'],
  providers: [DatePipe]
})
export class WaitilistSignupComponent implements OnInit {
  isLoaderAdmin:boolean=false;
  activeWaitlist:boolean=false;
  waitListForm:FormGroup;
  checkActiveWaitlist:any="N";
  hideLogo:any ="N";
  showTicket:any = "N";
  boxofficeId:any;
  getSavedlist:any;
  eventId:any; 
  waitinglistObject:any;
  getAllWaitingListData:any;
  getNewWaitingListData:any;
  getNotifyWaitingListData:any;
  clickedIndex: any = 'ALL'
  search = {
    keyword: ""
  };
  saveDisabled:boolean=false;
  allOccurrenceList:any;
  selectedOccurrence:any='all';
  recurringEvent:any='N';
  
  constructor(
    private formBuilder: FormBuilder,
    private SingleEventServiceService:SingleEventServiceService,
    private ErrorService:ErrorService,
    private datePipe: DatePipe,
    public dialog: MatDialog,
    private singleEventDashboard:SingleEventDashboard,
  ) 
  {
    if(localStorage.getItem('boxoffice_id')){
      this.boxofficeId = localStorage.getItem('boxoffice_id');   
    }
    if(localStorage.getItem('selectedOccurrence')){
      this.selectedOccurrence = localStorage.getItem('selectedOccurrence');
    }
    if(localStorage.getItem('selectedEventCode')){
      this.eventId = localStorage.getItem('selectedEventCode')
    }
    if(localStorage.getItem('isRecurrenceEvent')){
      this.recurringEvent = localStorage.getItem('isRecurrenceEvent')
    }


    this.waitListForm =this.formBuilder.group({
      btn_text:['', Validators.required],
      event_page_text:['',Validators.required],
      confirmation_msg:['',Validators.required],
    });
   }

  ngOnInit(): void {
    this.getSignupWaitingList('NEW');
    this.getSignupWaitingList('ALL');
    this.getSignupWaitingList('NOTIFY');
    this. fngetSavedwaitlist();
    this.getAllOccurrenceList();  
  }

  fnALLSearch(){
    this.getSignupWaitingList('ALL');   
    this.search.keyword;
  }
  fnNewSearch(){
    this.getSignupWaitingList('NEW');   
    this.search.keyword;
  }
  fnNotitySearch(){
    this.getSignupWaitingList('NOTIFY');   
    this.search.keyword;
  }


  fnExportData(){
    
    const options = { 
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true, 
      showTitle: true,
      title: 'waiting-signup-list CSV',
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
    };
    const csvExporter = new ExportToCsv(options);

    csvExporter.generateCsv(this.getAllWaitingListData.data);
   
  }

  fnChangeOccurrence(event){
    this.selectedOccurrence = event.value
    // if(this.selectedOccurrence != 'all'){
    //   this.path_getIssuedTicket = `${environment.apiUrl}/get-all-occurence-issue-ticket`
    // }else{
    //   this.path_getIssuedTicket =  `${environment.apiUrl}/get-all-issue-ticket`;
    // }
    localStorage.setItem('selectedOccurrence',this.selectedOccurrence);
    this.getSignupWaitingList('NEW');
    this.getSignupWaitingList('ALL');
    this.getSignupWaitingList('NOTIFY');
  }

  getSignupWaitingList(status){
    if(this.recurringEvent == 'Y' && this.selectedOccurrence != 'all'){
      this.isLoaderAdmin = true;
      let requestObject = {
         'occurrence_id' : this.selectedOccurrence,
        //  "boxoffice_id":"NULL",
         'status': status,
         'search':this.search.keyword,
      }
      this.SingleEventServiceService.getOccurrenceSignupWaitingList(requestObject).subscribe((response:any) => {
  
        if(response.data == true && response.response){
          if(status == 'ALL'){
            this.getAllWaitingListData = response.response;
            this.getAllWaitingListData.data.forEach(element => {
              element.created_at = this.datePipe.transform(element.created_at, 'MMM d, y, h:mm a');
              element.updated_at = this.datePipe.transform(element.updated_at, 'MMM d, y, h:mm a');
              console.log(element.created_at)
            });
          }else if(status == 'NEW'){
            this.getNewWaitingListData = response.response;
          }else{ 
            this.getNotifyWaitingListData = response.response;
          }
          console.log(status,this.getAllWaitingListData);
          
        } else if(response.data == false){
          // this.ErrorService.errorMessage(response.response);
          this. getAllWaitingListData = null;
        }
      })
        this.isLoaderAdmin = false;
    }else{
      this.isLoaderAdmin = true;
      let requestObject = {
         'event_id' : this.eventId,
        //  "boxoffice_id":"NULL",
         'status': status,
         'search':this.search.keyword,
      }
      this.SingleEventServiceService.getSignupWaitingList(requestObject).subscribe((response:any) => {
  
        if(response.data == true && response.response){
          if(status == 'ALL'){
            this.getAllWaitingListData = response.response;
            this.getAllWaitingListData.data.forEach(element => {
              element.created_at = this.datePipe.transform(element.created_at, 'MMM d, y, h:mm a');
              element.updated_at = this.datePipe.transform(element.updated_at, 'MMM d, y, h:mm a');
              console.log(element.created_at)
            });
          }else if(status == 'NEW'){
            this.getNewWaitingListData = response.response;
          }else{ 
            this.getNotifyWaitingListData = response.response;
          }
          console.log(status,this.getAllWaitingListData);
          
        } else if(response.data == false){
          this.ErrorService.errorMessage(response.response);
          this. getAllWaitingListData = null;
        }
      })
        this.isLoaderAdmin = false;
    }
    
  }
  
  onDeleteRec(code){
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: "Are you sure you want to delete Customer?"
    });
    dialogRef.afterClosed().subscribe(result => {
        if(result){
          this.deleteRecord(code);
        }
    });
  }

  deleteRecord(code){

    this.isLoaderAdmin=true;
    let requestObject = {
      'waitlist_id':code
    }
    this.SingleEventServiceService.deleteWaitingRec(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.ErrorService.successMessage(response.response)
        this.getSignupWaitingList('NEW');
        this.getSignupWaitingList('ALL');
        this.getSignupWaitingList('NOTIFY');
      }else if(response.data == false){
        this.ErrorService.errorMessage(response.response)
      }
    });
    this.isLoaderAdmin=false;
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

  getAllOccurrenceList(){
    this.isLoaderAdmin=true;
    let requestObject = {
      'event_id':this.eventId,
      'filter':'all'
    }
    this.SingleEventServiceService.getAllOccurrenceList(requestObject).subscribe((response:any) => {
      if(response.data == true){
          this.allOccurrenceList= response.response;
           this.allOccurrenceList.forEach(element => {
            if(element.occurance_start_time){
              element.occurance_start_time = this.transformTime24To12(element.occurance_start_time);
            }
            if(element.occurance_end_time){
              element.occurance_end_time = this.transformTime24To12(element.occurance_end_time);
            }
          });

      }else if(response.data == false){
        // this.ErrorService.errorMessage(response.response)
      }
    });
    this.isLoaderAdmin=false;
  }
  
  fnActiveWaitlist(event){
    this.activeWaitlist=event.checked
    if(event.checked == true){
      this.checkActiveWaitlist = 'Y' 
    }else{
      this.checkActiveWaitlist = 'N' 
    }
  }

  fnShowTicket(event){
    if(event.checked == true){
      this.showTicket = 'Y' 
    }else{
      this.showTicket = 'N' 
    }
  }

   

  fnSavewaitlist(){
    if(this.waitListForm.invalid){
     this.waitListForm.get('btn_text').markAllAsTouched();
     this.waitListForm.get('event_page_text').markAllAsTouched();
     this.waitListForm.get('confirmation_msg').markAllAsTouched();
     return false;
    }
    this.isLoaderAdmin=true;
    
     this.waitinglistObject = {
      "active_watlist":this.checkActiveWaitlist,
      "show_when_ticket_available":this.showTicket,
      "btn_text":this.waitListForm.get('btn_text').value,
      "event_page_text":this.waitListForm.get('event_page_text').value,
      "confirmation_msg":this.waitListForm.get('confirmation_msg').value,
    };

    let requestObject ={
      "event_id": this.eventId,
      // "boxoffice_id":"NULL",
      "option_key":'waitListForm',
      "option_value":this.waitinglistObject,
      "json_type":"Y",
  }

    this.SingleEventServiceService.setSettingOption(requestObject).subscribe((response:any) => {
      if(response.data == true){
      this.ErrorService.successMessage(response.response);
      this.fngetSavedwaitlist();
      this.saveDisabled = true;
        setTimeout(() => {
          this.saveDisabled = false
        }, 4000);
    } else if(response.data == false){
    this.ErrorService.errorMessage(response.response);
    }
    this.isLoaderAdmin=false;
});

  }

  fngetSavedwaitlist(){
    this.isLoaderAdmin=true;
    let requestObject= {
      "boxoffice_id":"NULL",
      "option_key":'waitListForm',
      "event_id": this.eventId,
    }
        this.SingleEventServiceService.getSavedlist(requestObject).subscribe((response:any) => {
          if(response.data == true){
          this.getSavedlist = JSON.parse(response.response);       
          this.waitListForm.controls['btn_text'].setValue(this.getSavedlist.btn_text)
          this.waitListForm.controls['event_page_text'].setValue(this.getSavedlist.event_page_text)
          this.waitListForm.controls['confirmation_msg'].setValue(this.getSavedlist.confirmation_msg)
          this.checkActiveWaitlist = this.getSavedlist.active_watlist;
          this.showTicket = this.getSavedlist.show_when_ticket_available;
          if(this.getSavedlist.active_watlist == 'Y'){
            this.activeWaitlist = true;
          }else{
              this.activeWaitlist = false;
          }
      } else if(response.data == false){
        // this.ErrorService.errorMessage(response.response);
        }
    });
    this.isLoaderAdmin=false;
  }

  goToCreateBroadcast(){
    this.singleEventDashboard.goToCreateBroadcast();
  }

}

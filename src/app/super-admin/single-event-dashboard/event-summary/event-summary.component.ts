import { Component, OnInit, OnChanges, ElementRef } from '@angular/core';
 import { Chart } from 'chart.js';
import { SingleEventServiceService } from '../_services/single-event-service.service';
import { FormGroup, FormBuilder, Validators,FormControl, FormArray } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { SuperadminService } from '../../_services/superadmin.service';
import { ErrorService } from '../../../_services/error.service';
import { DatePipe} from '@angular/common';
import { Router, RouterEvent } from '@angular/router';
import { environment } from '../../../../environments/environment';
import * as moment from 'moment'; 
@Component({
  selector: 'app-event-summary',
  templateUrl: './event-summary.component.html',
  styleUrls: ['./event-summary.component.scss'],
  providers: [DatePipe]
})
export class EventSummaryComponent implements OnInit {
  isLoaderAdmin:boolean=false;
  eventId:string = localStorage.getItem('selectedEventCode');
  eventDetail:any;
  eventSummery:any;
  eventURL;
  dataArray:any = [];
  boxOfficeDetail:any = [];
  Settings:any = [];
  setupStripe:boolean  = false;
  setupPayumoney:boolean  = false;
  setupPayPal:boolean  = false;
  setupOffline:boolean  = false;
  animal:any;
  currencycode = 'USD';
  recurringEvent:any='N';
  pageURL:any;
  is_show_referral_data = false;
  allOccurrenceList:any;
  upcomingOccurrenceList:any=[];
  pastOccurrenceList:any=[];
  selectedOccurrence:any='all';
  constructor(
    private _formBuilder: FormBuilder,
    public dialog: MatDialog,
    private ErrorService: ErrorService,
    private router: Router,
    private el: ElementRef,
    private SuperadminService: SuperadminService,
    private SingleEventServiceService: SingleEventServiceService,
    private datePipe:DatePipe,

  ) {
    if(localStorage.getItem('selectedOccurrence')){
      this.selectedOccurrence = localStorage.getItem('selectedOccurrence');
    }
  }
  
  

  ngOnInit(): void {
    this.fnGetEventDetail();
    this.fnGetBoxOfficeDetail();   
    this.fnGetSettings();
    
    this.fnGetEventViews(null);

  }
  private scrollToFirstInvalidControl() {
    const firstInvalidControl: HTMLElement = this.el.nativeElement.querySelector(
      "#chart_view_section"
    );

    firstInvalidControl.focus(); //without smooth behavior
  }

  redirectTOEventChart(){
    this.scrollToFirstInvalidControl();
  }
  
  fnChartView(data,arrayLable){
    let chartData = {
      "items": [
          {
            "label":"TIcket Sales",
            "data": data,
            "backgroundColor": "#FFD8AA",
            "borderColor": "rgb(151, 60, 86)",
            "fill": true,
            "lineTension": 0,
            "radius": 5
          }
      ]
    }

    for(let key in chartData.items){
      if(chartData.items.hasOwnProperty(key)){
        this.dataArray.push(chartData.items[key])
      }
    } 

    let chart  = new Chart(document.getElementById('areaChart1') as HTMLElement, {
      type: "line",
      data: {
        labels: arrayLable,
        datasets: this.dataArray
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        title: {
          display: true,
          position: "left",
          text:"TIcket sold",
          fontSize:12,
          fontColor: "#666"
        },
        legend: {
          display: true,
          position: "bottom",
          labels: {
            fontColor: "#999",
            fontSize: 14
          }
        }
      }
    });

  }

  FnRouteViewIssueTicekets(){
    this.router.navigateByUrl('/super-admin/single-event-dashboard/issued-ticket');
    // this.router.navigate(['issued-ticket']);
  }

  fnNavigateToTickets(){	  
    this.router.navigate(['/super-admin/single-event-dashboard/event-and-ticket-types'], { queryParams: { goto: 'manage_ticket' } });  
    // this.router.navigateByUrl('/super-admin/single-event-dashboard/event-and-ticket-types');
    // this.router.navigate(['issued-ticket']);
  }

  fnChartView2(data,arrayLable){

    let chartData = {
      "items": [
                {
                  "label":"Event Views",
                  "data": data,
                  "backgroundColor": "#FFD8AA",
                  "borderColor": "rgb(151, 60, 86)",
                  "fill": true,
                  "lineTension": 0,
                  "radius": 5
                }
        ]
    }

    let dataArray1:any = [];

    for(let key in chartData.items){
      if(chartData.items.hasOwnProperty(key)){
        dataArray1.push(chartData.items[key])
      }
    } 

 

    let areaChart = new Chart(document.getElementById('areaChart2') as HTMLElement, {
      type: "line",
      data: {
        labels: arrayLable,
        datasets: dataArray1
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        title: {
          display: true,
          position: "left",
          text:"Event Views",
          fontSize:12,
          fontColor: "#666"
        },
        legend: {
          display: false,
          position: "bottom",
          labels: {
            fontColor: "#999",
            fontSize: 14
          }
        }
      }
    });

  }

  fnGetEventViews(event=null){
    this.isLoaderAdmin=true;
    let requestObject = {
      'event_id' : this.eventId,
      'type' : event   ? event.value : "day"
    };
    
    this.SingleEventServiceService.getEventViews(requestObject).subscribe((response:any) => {
      if(response.data == true){

          var data = [];
          var arrayLable = [];
          response.response.forEach(element => {
            data.push(element.views);
            arrayLable.push(element.date);
          });
          
          this.fnChartView2(data,arrayLable);

      } else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
    });    
    this.isLoaderAdmin=false;
  }

  onTabChange(event){
    let clickedIndex = event.index;
    if(clickedIndex == 0){
      this.getAllOccurrenceList('upcoming');  
    }else if(clickedIndex == 1){ 
      this.getAllOccurrenceList('past');   
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
  
  getAllOccurrenceList(filter){
    this.isLoaderAdmin=true;
    let requestObject = {
      'event_id':this.eventId,
      'filter':filter
    }
    this.SingleEventServiceService.getAllOccurrenceList(requestObject).subscribe((response:any) => {
      if(response.data == true){
        if(filter == 'upcoming'){
          this.upcomingOccurrenceList= response.response;
          this.upcomingOccurrenceList.forEach(element => {
            if(element.soldout.length == 0){
              element.soldout = 'Tickets are not available'
            }
            if(element.final_revenue.length == 0){
              element.final_revenue = 'Tickets are not available'
            }
            if(element.remaining.length == 0){
              element.remaining = 'Tickets are not available'
            }
            if(element.occurance_start_time){
              element.occurance_start_time = this.transformTime24To12(element.occurance_start_time);
            }
            if(element.occurance_end_time){
              element.occurance_end_time = this.transformTime24To12(element.occurance_end_time);
            }
            // element.occurance_start_time = moment(element.occurance_start_time).format('hh:mm a');
            // element.occurance_end_time = moment(element.occurance_end_time).format('hh:mm a');
          });
        }else if(filter == 'past'){
          this.pastOccurrenceList= response.response;
          this.pastOccurrenceList.forEach(element => {
            if(element.soldout.length == 0){
              element.soldout = 'Tickets are not available'
            }
            if(element.final_revenue.length == 0){
              element.final_revenue = 'Tickets are not available'
            }
            if(element.remaining.length == 0){
              element.remaining = 'Tickets are not available'
            }
            // element.occurance_start_time = moment(element.occurance_start_time).format('hh:mm a');
            // element.occurance_end_time = moment(element.occurance_end_time).format('hh:mm a');
          });
        }else if(filter = 'all'){
          this.allOccurrenceList= response.response;
           this.allOccurrenceList.forEach(element => {
            if(element.occurance_start_time){
              element.occurance_start_time = this.transformTime24To12(element.occurance_start_time);
            }
            if(element.occurance_end_time){
              element.occurance_end_time = this.transformTime24To12(element.occurance_end_time);
            }
          });
         
        }
       
        console.log(this.allOccurrenceList)

      }else if(response.data == false){
        if(filter == 'upcoming'){
          this.upcomingOccurrenceList.length = 0;
        }else if(filter == 'past'){
          this.pastOccurrenceList.length = 0;
        }
        // this.ErrorService.errorMessage(response.response)
      }
    });
    this.isLoaderAdmin=false;
  }

  fnChangeOccurrence(value){
    this.selectedOccurrence = value
    localStorage.setItem('selectedOccurrence',this.selectedOccurrence);
    // if(this.selectedOccurrence != 'all'){
      this.getSingleOccurrenceSummary(this.selectedOccurrence);
    // }
  }

  fnGetEventDetail(){
    this.isLoaderAdmin=true;
    let requestObject = {
      'unique_code' : this.eventId,
    }
    
    this.SingleEventServiceService.getSingleEvent(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.eventDetail = response.response.event[0];
        this.recurringEvent = this.eventDetail.event_occurrence_type;
        if(this.recurringEvent == 'Y'){
          this.getAllOccurrenceList('all');   
          this.getAllOccurrenceList('upcoming');   
          this.getAllOccurrenceList('past');   
          this.fnOccurrenceSummary(this.selectedOccurrence);
        }else{
          localStorage.removeItem('selectedOccurrence');
          let request = {
            'event_id' : this.eventId,
          }
      
          this.SingleEventServiceService.getSingleSummery(request).subscribe((response:any) => {
            if(response.data == true){
              this.eventSummery = response.response;
              let data = [];
              let arrayLable = [];
              if(this.eventSummery.graphSale){
                this.eventSummery.graphSale.forEach(element => {
                  data.push(element.sale);
                  arrayLable.push(element.date);
                });
                this.fnChartView(data,arrayLable);
              }
      
              // data = [];
              // arrayLable = [];
      
              // if(this.eventSummery.graphViews){
              //   this.eventSummery.graphViews.forEach(element => {
              //     data.push(element.sale);
              //     arrayLable.push(element.date);
              //   });
              //   this.fnChartView2(data,arrayLable);
              // }
              
      
            } else if(response.data == false){
              this.ErrorService.errorMessage(response.response);
            }
          });
        }
        this.currencycode = this.eventDetail.event_setting.currency ? this.eventDetail.event_setting.currency  : 'USD';
      } else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
    });
  }

  fnOccurrenceDelete(occurrenceCode){
    this.isLoaderAdmin=true;
    let requestObject = {
      'occurance_id': occurrenceCode,
    }
    
    this.SingleEventServiceService.occurrenceDelete(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.ErrorService.successMessage(response.response);
        this.getAllOccurrenceList('upcoming'); 
        this.getAllOccurrenceList('past'); 
        
      } else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
    });
    this.isLoaderAdmin=false;
  }

  fnOccurrenceOrder(occurrenceCode){
    
    this.router.navigateByUrl('/super-admin/orders?event='+this.eventId+'&occurrence='+occurrenceCode);
  }

  fnOccurrenceSummary(occurrenceCode){
    this.selectedOccurrence = occurrenceCode
    // if(this.selectedOccurrence != 'all'){
      this.getSingleOccurrenceSummary(occurrenceCode);
    // }
  }

  getSingleOccurrenceSummary(occurrenceCode){
    this.isLoaderAdmin=true;
    let requestObject = {
      'occurrence_id' : occurrenceCode,
      'event_id' : this.eventId,
    };
    
    this.SingleEventServiceService.singleOccurrenceDetail(requestObject).subscribe((response:any) => {
      if(response.data == true){

        this.eventSummery = response.response;

        let data = [];
        let arrayLable = [];
        if(this.eventSummery.graphSale){
          this.eventSummery.graphSale.forEach(element => {
            data.push(element.sale);
            arrayLable.push(element.date);
          });
          this.fnChartView(data,arrayLable);
        }


      } else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
    });    
    this.isLoaderAdmin=false;
  }

  fnGetBoxOfficeDetail(){
    this.isLoaderAdmin=true;
    let requestObject = {
      'unique_code' : localStorage.getItem('boxoffice_id'),
    }

    this.SingleEventServiceService.getSingleBoxofficeDetails(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.boxOfficeDetail = response.response[0];
        this.eventURL = environment.bookingPageUrl+'/event/'+this.eventId;
      } else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
    });
    this.isLoaderAdmin=false;
  }

  fnGetSettings(){
    this.isLoaderAdmin=true;
    let requestObject={
      "boxoffice_id"  : localStorage.getItem('boxoffice_id'),
      "event_id" : ''
    }

    this.SingleEventServiceService.getSettingsValue(requestObject).subscribe((response:any) => {

        if(response.data == true){
          this.boxOfficeDetail = response.response;
          this.boxOfficeDetail.forEach(element => {
            if(element.option_key == 'Stripe'){
              this.setupStripe = true;
            }
            if(element.option_key == 'Paypal'){
              this.setupPayPal = true;
            }
            if(element.option_key == 'Payumoney'){
              this.setupPayumoney = true;
            }
          });

        } else if(response.data == false){

          this.ErrorService.errorMessage(response.response);
        }
    });
    this.isLoaderAdmin=false;
  }

  fnShare(type) {
    if(type=='facebook'){
      window.open('http://www.facebook.com/sharer.php?u='+encodeURIComponent(this.eventURL), "_blank", "width=600,height=600");
    }else if(type=='twitter'){
      window.open('https://twitter.com/intent/tweet?text='+ this.eventDetail.venue_name +' '+encodeURIComponent(this.eventURL), "_blank", "width=600,height=600");
    }
  }

  
  PreviewPage(){
   
    return window.open(this.eventURL+'?preview=true','_blank');
  }

  // createTrackingLinkandView() {
  //   this.isLoaderAdmin = true;
  //   const dialogRef = this.dialog.open(createTrackingLinkAndView, {
  //     width: '550px',
  //   });
  
  //    dialogRef.afterClosed().subscribe(result => {
  //     this.animal = result;
  //    });
  //    this.isLoaderAdmin = false;
  // }
  
}



// @Component({
//   selector: 'add-create-tracking-link-and-view',
//   templateUrl: '../_dialogs/create-tracking-link-and-view.html',
// })
// export class createTrackingLinkAndView implements OnInit {
//   isLoaderAdmin:any;
//   trackingLinkandViewForm:FormGroup;
//   trackingLinkandViewArr:FormArray;
//   trackingLinkandView = [];
//   trackingLinkandViewValue =[{
//     event:'',
//     referralTag:'',
//   }]

// constructor(
//   private _formBuilder : FormBuilder,
//   public dialogRef: MatDialogRef<createTrackingLinkAndView>,
// ){
//   this.trackingLinkandViewForm = this._formBuilder.group({
//     trackingLinkandViewArr : this._formBuilder.array([this.createTrackingLinkandViewItem()])
//   })
// }

// createTrackingLinkandViewItem() {
//   return this._formBuilder.group({
//     event: [''],
//     referralTag: ['']
//   })
// }

// fntrackingLinkandViewAdd(){
//   this.trackingLinkandViewArr = this.trackingLinkandViewForm.get('trackingLinkandViewArr') as FormArray;
//   this.trackingLinkandViewArr.push(this.createTrackingLinkandViewItem());
//   this.trackingLinkandView = this.trackingLinkandViewForm.value.trackingLinkandViewArr;
// }

// onNoClick(){
//   this.dialogRef.close();
// }
// ngOnInit():void{
// }

// }

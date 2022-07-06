import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { Router, RouterEvent } from '@angular/router';
import { SuperadminService } from '../_services/superadmin.service';
import { DatePipe} from '@angular/common';
import { environment } from '../../../environments/environment';
import { AppComponent } from '../../app.component';
import { ErrorService } from '../../_services/error.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [DatePipe]
})
export class DashboardComponent implements OnInit {

  currentUser:any;
  isLoaderAdmin:boolean = false;
  eventPermission:boolean = false;
  pageSlug:any;
  keepMe:any;
  analyticsFilter:any="week";
  salesFilter:any="week";
  boxOfficeCode:any;
  setupSteps:any;
  analyticsStets:any;
  recentPurchaseList:any=[];
  latestSalesStats:any;
  initials:any;
  customerShortName:any;
  ipAddress:any;
  upcommintEventApiUrl:any =  `${environment.apiUrl}/get-allboxoffice-event-api`;
  allUpcomingEventListData:any=[];
  totalUpcomingEvents:any;
  progressValue:number=0;
  constructor(
    private router: Router,
    private datePipe: DatePipe,
    private appComponent:AppComponent,
    private SuperadminService: SuperadminService,
    private errorService:ErrorService
  ) { 
    this.keepMe = localStorage.getItem('keepMeSignIn')
    if (this.keepMe == 'true') {
      this.currentUser =  JSON.parse(localStorage.getItem('currentUser'))
    } else {
      this.currentUser =  JSON.parse(sessionStorage.getItem('currentUser'))
    }




    if(localStorage.getItem('boxoffice_id')){
      this.boxOfficeCode = localStorage.getItem('boxoffice_id');
    }else{
      this.errorService.errorMessage('Select Box-office first.');
      this.router.navigate(["/super-admin/boxoffice"]);
    }
    // this.currentUser = JSON.parse(this.currentUser);

    if(this.currentUser.type == 'member'  && this.currentUser.permission != 'A'){
      if(localStorage.getItem('permision_OV') != 'TRUE'){
        this.router.navigate(['/super-admin']);
      }
       if (localStorage.getItem('permision_OV')) {
        this.eventPermission = false;
      }

      if (localStorage.getItem('permision_EM')) {
        this.eventPermission = true;
      }

    }
    this.router.events.subscribe(event => {
      if (event instanceof RouterEvent) this.handleRoute(event);
        const url = this.getUrl(event);
    });

    
   this.getSetupSteps();
   this.getAnalytics();
   this.getRecentPurchase();
   this.getLatestSales();
    this.fnGetUpcomingEventList();
    
  }

  ngOnInit(): void {
    // this.fnSoldTicketChart();
    this.salesFilter= 'week';
    this.fnChangeFilterSales();
  }

  // page url conditions
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
    if (event && event.url) {
      this.pageSlug = event.url.split('/' , 2)
      const url = event.url;
      const state = (event.state) ? event.state.url : null;
      const redirect = (event.urlAfterRedirects) ? event.urlAfterRedirects : null;
      const longest = [url, state, redirect].filter(value => !!value).sort(this.dynamicSort('-length'));
      if (longest.length > 0) return longest[0];
    }
  }

  private handleRoute(event: RouterEvent) {
    const url = this.getUrl(event);
    let devidedUrl = url.split('/',4);
    if(devidedUrl[1] == '' || devidedUrl[1] == 'boxoffice'){
      localStorage.setItem('isBoxoffice','true');
    }else{
      localStorage.setItem('isBoxoffice','false');
    }
  }

  getSetupSteps(){
    let requestObject  ={
      'boxoffice_id': this.boxOfficeCode
    }
    this.SuperadminService.getSetupSteps(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.setupSteps= response.response;
        if(this.setupSteps.signup == 'Y'){
          this.progressValue  = this.progressValue+16.66
        }
        if(this.setupSteps.add_event == 'Y'){
          this.progressValue  = this.progressValue+16.66
        }
        if(this.setupSteps.customize_event == 'Y'){
          this.progressValue  = this.progressValue+16.66
        }
        if(this.setupSteps.select_plan == 'Y'){
          this.progressValue  = this.progressValue+16.66
        }
        if(this.setupSteps.setup_payment == 'Y'){
          this.progressValue  = this.progressValue+16.66
        }
        if(this.setupSteps.publish == 'Y'){
          this.progressValue  = this.progressValue+16.66
        }
        this.progressValue = Math.round(this.progressValue);

      }
    });
  }

  fnChangeFilterAnalytics(){
    this.getAnalytics();
  }

  getAnalytics(){
    let requestObject  ={
      'boxoffice_id': this.boxOfficeCode,
      'type': this.analyticsFilter
    }
    this.SuperadminService.getAnalytics(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.analyticsStets= response.response
      }
    });
  }
 
  getRecentPurchase(){
    let requestObject  ={
      'boxoffice_id': this.boxOfficeCode,
    }
    this.SuperadminService.getRecentPurchase(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.recentPurchaseList= response.response
        this.recentPurchaseList.forEach(element => {
          element.customer.customerShortName = ''
          element.customer.customerShortName = element.customer.firstname.charAt(0)+ element.customer.lastname.charAt(0)
        });
      }
    });
  }

  fnChangeFilterSales(){
    this.getLatestSales();
  }
 
  getLatestSales(){
    let requestObject  ={
      'boxoffice_id': this.boxOfficeCode,
      'type': this.salesFilter
    }
    this.SuperadminService.getLatestSales(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.latestSalesStats= response.response
        if(this.latestSalesStats.ticket_left == 0 && this.latestSalesStats.ticket_sold == 0){
        }else{
          this.fnSoldTicketChart();
        }
      }
    });
  }
  
  addNewEvent(){
    window.scrollTo(0,0);
    this.appComponent.addNewEventNav();
    // this.router.navigate(['/super-admin/events'], { queryParams: { event: 'new' } });
  }

  viewAllEvent(){
    this.router.navigate(['/super-admin/events']); 
  }

  goToSetupPayment(){
    this.router.navigate(['/super-admin/settings/payment-systems']); 
  }

  goToPlans(){
    this.router.navigate(['/super-admin/settings/billing']); 
  }

  goToCustomizeEvent(){
    this.router.navigate(['/super-admin/settings/event-page-design']); 
  }

  fnGetUpcomingEventList(){
    this.isLoaderAdmin = true;
    let requestObject = {
      'boxoffice_id'  :this.boxOfficeCode,
    }
    this.SuperadminService.dashboarUpcomingEvents(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.totalUpcomingEvents = response.response.length;
        let i =0;
        response.response.forEach(element => {
          element.shortStartDate = '';
          element.shortStartDate = this.datePipe.transform(new Date(element.start_date),"d");
          element.shortStartDay = this.datePipe.transform(new Date(element.start_date),"EE");
          element.soldPer = 0
          if(element.ticket_sold > 0){
            element.soldPer = 100*element.ticket_sold/element.total_ticket
          }
          i++
          if(i < 4){
            this.allUpcomingEventListData.push(element)
          }
        });
      }else if(response.data == false){
        this.allUpcomingEventListData.length = 0;
      }
        this.isLoaderAdmin = false;
    });
  }

  fnSoldTicketChart(){
    if(this.latestSalesStats.ticket_left != null && this.latestSalesStats.ticket_sold != null){
      const colors = ["#ff0000", "#ffff00", "#ffa500", "#008000", "#800080", "#ff00ff", "#0000ff", "#9acd32", "#00ff00", "#00ced1", "#d2691e"];
     
      let chartColors = colors.slice(0, this.latestSalesStats.length);
      let chart  = new Chart(document.getElementById('ticketchart') as HTMLElement, {
        type: 'doughnut',
        data: {
          labels: ['Ticket Left','Ticket Sold'],
          datasets: [
            { 
              data: [this.latestSalesStats.ticket_left,this.latestSalesStats.ticket_sold],
              backgroundColor: ['rgb(238, 181, 48)','rgb(112, 192, 193)'],
              fill: true
            },
          ]
        },
        options: {
          legend: {
            display: false,
          },
          tooltips:{
            enabled:true
          },
          cutoutPercentage: 60
        }
      });
    }
    }
  

}

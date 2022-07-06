import { Component, Inject, Injectable, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';
import { Router, RouterEvent, RouterOutlet } from '@angular/router';
import { map, catchError, filter } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { AuthenticationService } from '../../../_services/authentication.service';


@Injectable({
  providedIn: 'root'
})
export class SingleEventServiceService {
  globalHeaders:any;
  currentUser:any;

  constructor(
    private http: HttpClient,
        public router: Router,
        private authenticationService : AuthenticationService,
  ) { 
        this.authenticationService.currentUser.subscribe(x => this.currentUser = x);

        this.globalHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            'admin-id' : this.currentUser.user_id,
            'api-token' : this.currentUser.token
        });
    
  }
  private handleError(error: HttpErrorResponse) {
    console.log(error);
    return throwError('Error! something went wrong.');
  }

  ngOnInit() {
    
  }


  getAllCountry(){
      return this.http.post(`${environment.apiUrl}/get-country-api`,{headers:this.globalHeaders}).pipe(
      map((res) => {
          return res;
      }),catchError(this.handleError));
  }

  getAllCurrancy(){
      return this.http.post(`${environment.apiUrl}/get-currancy-api`,{headers:this.globalHeaders}).pipe(
      map((res) => {
          return res;
      }),catchError(this.handleError));
  }
  getAllTimeZone(){
      return this.http.post(`${environment.apiUrl}/get-timezones`,{headers:this.globalHeaders}).pipe(
      map((res) => {
          return res;
      }),catchError(this.handleError));
  }
  getDefaultImages(){
      return this.http.post(`${environment.apiUrl}/get-default-images`,{headers:this.globalHeaders}).pipe(
      map((res) => {
          return res;
      }),catchError(this.handleError));
  }

    getTimeSlote(requestObject){
        return this.http.post(`${environment.apiUrl}/get-timeslots`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }


    getSingleEvent(requestObject){
        return this.http.post(`${environment.apiUrl}/get-single-event-api`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }

    getExportTickets(requestObject){
        return this.http.get(`${environment.apiUrl}/export-doorlist/?${requestObject}`,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }

    getEventViews(requestObject){
        return this.http.post(`${environment.apiUrl}/event-view-filter`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }

    cancelOrders(requestObject){
        return this.http.post(`${environment.apiUrl}/update-order-status`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }


    ResendTicket(ticket_id){
        return this.http.get(`${environment.apiUrl}/resend-order?unique_code=${ticket_id}`,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }

    getsingleOrder(requestObject){
        return this.http.post(`${environment.apiUrl}/get-single-order`,requestObject,{headers:this.globalHeaders}).pipe(
         map((res) => {
            return res;
          }),
         catchError(this.handleError));
    }

    updateOrder(requestObject){
        return this.http.post(`${environment.apiUrl}/order-update`,requestObject,{headers:this.globalHeaders}).pipe(
         map((res) => {
            return res;
          }),
         catchError(this.handleError));
    }

    singleTicketVoid(requestObject){
        return this.http.post(`${environment.apiUrl}/update-order-item-status`,requestObject,{headers:this.globalHeaders}).pipe(
         map((res) => {
            return res;
          }),
         catchError(this.handleError));
    }

    // DownloadTicket(requestObject){
    //     return this.http.get(`${environment.apiUrl}/resend-order?unique_code=ord16063742131431`,{headers:this.globalHeaders}).pipe(
    //      map((res) => {
    //         return res;
    //       }),
    //      catchError(this.handleError));
    // }

    getSingleSummery(requestObject){
        return this.http.post(`${environment.apiUrl}/event-summery`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }

    getAllBroadcast(requestObject){
        return this.http.post(`${environment.apiUrl}/get-all-broadcast-api`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }

    sendBroadcast(requestObject){
        return this.http.post(`${environment.apiUrl}/send-broadcast-api`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }

    reSendBroadcast(requestObject){
        return this.http.post(`${environment.apiUrl}/resend-broadcast`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }
 
  getWaitingList(requestObject){
    return this.http.post(`${environment.apiUrl}/get-waiting-list`,requestObject,{headers:this.globalHeaders}).pipe(
    map((res) => {
        return res;
    }),catchError(this.handleError));
}

  createBroadcastfrm(requestObject){
    return this.http.post(`${environment.apiUrl}/create-broadcast-api`,requestObject,{headers:this.globalHeaders}).pipe(
    map((res) => {
        return res;
    }),catchError(this.handleError));
  }

  updateEventStatus(requestObject){
    return this.http.post(`${environment.apiUrl}/update-event-status`,requestObject,{headers:this.globalHeaders}).pipe(
    map((res) => {
        return res;
    }),catchError(this.handleError));
  }

  getSingleBoxofficeDetails(requestObject){
    return this.http.post(`${environment.apiUrl}/get-single-boxoffice-api`,requestObject,{headers:this.globalHeaders}).pipe(
    map((res) => {
        return res;
    }),catchError(this.handleError));
  }
  
  getSettings(requestObject){
    return this.http.post(`${environment.apiUrl}/get-setting-option-api`,requestObject,{headers:this.globalHeaders}).pipe(
    map((res) => {
        return res;
    }),catchError(this.handleError));
  }
  
  setSettingOption(requestObject){
    return this.http.post(`${environment.apiUrl}/set-setting-option-api`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
      }),catchError(this.handleError));
  }

  duplicateForm(requestObject){
      return this.http.post(`${environment.apiUrl}/duplicate-event`,requestObject,{headers:this.globalHeaders}).pipe(
          map ((res) => {
              return res;
          }),catchError(this.handleError));
  }
    getSignupWaitingList(requestObject){
        return this.http.post(`${environment.apiUrl}/waiting-list`,requestObject,{headers:this.globalHeaders}).pipe(
        map ((res) => {
            return res;
        }),catchError(this.handleError));
    } 
    getOccurrenceSignupWaitingList(requestObject){
        return this.http.post(`${environment.apiUrl}/occurrence-waiting-list`,requestObject,{headers:this.globalHeaders}).pipe(
        map ((res) => {
            return res;
        }),catchError(this.handleError));
    } 
    getAllCouponCodes(requestObject){
        return this.http.post(`${environment.apiUrl}/get-all-coupon-api`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }
    UpdateTicket(requestObject){
        return this.http.post(`${environment.apiUrl}/update-ticket`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }
    deleteTicket(requestObject){
        return this.http.post(`${environment.apiUrl}/delete-ticket`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }
    updateEvent(requestObject){
        return this.http.post(`${environment.apiUrl}/update-event-api`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }
    createTicket(requestObject){
        return this.http.post(`${environment.apiUrl}/add-ticket`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }
    getSettingsValue(requestObject){
        return this.http.post(`${environment.apiUrl}/get-all-setting-option-api`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }
  
  
  issuedTickets(requestObject,path){
    return this.http.post(path,requestObject,{headers:this.globalHeaders}).pipe(
        map ((res) => {
            return res;
        }),catchError(this.handleError));
  }
   
    fnDeleteEvent(requestObject){
        return this.http.post(`${environment.apiUrl}/delete-event-api`,requestObject,{headers:this.globalHeaders}).pipe(
            map((res) => {
                return res;
        }),catchError(this.handleError));
    }

    getSavedlist(requestObject){
        return this.http.post(`${environment.apiUrl}/get-setting-option-api`,requestObject,{headers:this.globalHeaders}).pipe(
            map((res) => {
                return res;
        }),catchError(this.handleError));
    }


    updateSetting(requestObject){
        return this.http.post(`${environment.apiUrl}/set-setting-option-api
        `,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }

    getSingleEventSettings(requestObject) {
        return this.http.post(`${environment.apiUrl}/get-setting-option-api`,requestObject,{headers:this.globalHeaders}).pipe(
            map((res) => {
                return res;
        }),catchError(this.handleError));
    }

    fnGetsingleOrder(requestObject){
        return this.http.post(`${environment.apiUrl}/get-single-order`,requestObject,{headers:this.globalHeaders}).pipe(
         map((res) => {
            return res;
          }),
         catchError(this.handleError));
    }

    orderUpdate(requestObject) {
        
        return this.http.post(`${environment.apiUrl}/order-update`,requestObject,{headers:this.globalHeaders}).pipe(
            map((res) => {
                return res;
        }),catchError(this.handleError));
    }
    getAllOccurrenceList(requestObject) {
        
        return this.http.post(`${environment.apiUrl}/list-event-occurrence-api`,requestObject,{headers:this.globalHeaders}).pipe(
            map((res) => {
                return res;
        }),catchError(this.handleError));
    }
    deleteWaitingRec(requestObject) {
        return this.http.post(`${environment.apiUrl}/waiting-list-delete`,requestObject,{headers:this.globalHeaders}).pipe(
            map((res) => {
                return res;
        }),catchError(this.handleError));
    }
    createOccurence(requestObject) {
        
        return this.http.post(`${environment.apiUrl}/create-event-occurrence-api`,requestObject,{headers:this.globalHeaders}).pipe(
            map((res) => {
                return res;
        }),catchError(this.handleError));
    }
    occurrenceStatusUpdate(requestObject) {
        
        return this.http.post(`${environment.apiUrl}/status-update-event-occurrence-api`,requestObject,{headers:this.globalHeaders}).pipe(
            map((res) => {
                return res;
        }),catchError(this.handleError));
    }
    occurrenceDelete(requestObject) {
        
        return this.http.post(`${environment.apiUrl}/delete-event-occurrence-api`,requestObject,{headers:this.globalHeaders}).pipe(
            map((res) => {
                return res;
        }),catchError(this.handleError));
    }
    singleOccurrenceDetail(requestObject) {
        
        return this.http.post(`${environment.apiUrl}/occurrence-summery-api`,requestObject,{headers:this.globalHeaders}).pipe(
            map((res) => {
                return res;
        }),catchError(this.handleError));
    }

    repeatOccurrenceCreate(requestObject) {
        
        return this.http.post(`${environment.apiUrl}/create-repeat-event-occurrence-api`,requestObject,{headers:this.globalHeaders}).pipe(
            map((res) => {
                return res;
        }),catchError(this.handleError));
    }
    singleOccurrenceCreate(requestObject) {
        
        return this.http.post(`${environment.apiUrl}/create-event-occurrence-api`,requestObject,{headers:this.globalHeaders}).pipe(
            map((res) => {
                return res;
        }),catchError(this.handleError));
    }
    singleOccurrIssuedTickets(requestObject,path) {
        
        return this.http.post(path,requestObject,{headers:this.globalHeaders}).pipe(
            map((res) => {
                return res;
        }),catchError(this.handleError));
    }
    singleOccurrenceUpdate(requestObject) {
        
        return this.http.post(`${environment.apiUrl}/update-event-occurrence-api`,requestObject,{headers:this.globalHeaders}).pipe(
            map((res) => {
                return res;
        }),catchError(this.handleError));
    }

}

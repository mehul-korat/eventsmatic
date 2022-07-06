import { Component, Inject, Injectable, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';
import { Router, RouterEvent, RouterOutlet } from '@angular/router';
import { map, catchError, filter } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthenticationService } from '../../_services/authentication.service';



@Injectable({ providedIn: 'root' })
export class SuperadminService {

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
    public getIPAddress()  
    {  
      return this.http.get(`${environment.apiUrl}/get-ip`);  
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
    
    defaultValues(requestObject){
        return this.http.post(`${environment.apiUrl}/default-values`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }

    getSetupSteps(requestObject){
        return this.http.post(`${environment.apiUrl}/get-complete-setup-api`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }

    getAnalytics(requestObject){
        return this.http.post(`${environment.apiUrl}/get-analytics-api`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }

    getRecentPurchase(requestObject){
        return this.http.post(`${environment.apiUrl}/get-recent-purchase-api`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }

    getLatestSales(requestObject){
        return this.http.post(`${environment.apiUrl}/get-latest-sales-api`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }

    dashboarUpcomingEvents(requestObject){
        return this.http.post(`${environment.apiUrl}/get-upcoming-events-api`,requestObject,{headers:this.globalHeaders}).pipe(
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


    getAllBoxoffice(requestObject){
        return this.http.post(`${environment.apiUrl}/get-all-boxoffice-api`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }

    createNewBusiness(requestObject){
        return this.http.post(`${environment.apiUrl}/create-boxoffice-api`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }

    deleteBoxOffice(requestObject){
        return this.http.post(`${environment.apiUrl}/delete-boxoffice-api`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }
    createNewCouponCode(requestObject){
        return this.http.post(`${environment.apiUrl}/create-coupon-api`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }
    updateCouponCode(requestObject){
        return this.http.post(`${environment.apiUrl}/update-coupon-api`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }
    getAllCouponCodes(requestObject){
        return this.http.post(`${environment.apiUrl}/get-all-coupon-api`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }
    getAllVoucherCodes(requestObject){
        return this.http.post(`${environment.apiUrl}/get-all-voucher-api`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }
    // -----------change API -------------
   
    getAllTicket(requestObject){
        return this.http.post(`${environment.apiUrl}/get-all-ticket`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }

    fnGetsingleTicket(requestObject){
        return this.http.post(`${environment.apiUrl}/get-single-ticket `,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }

    fnGeteventTicket(requestObject){
        return this.http.post(`${environment.apiUrl}/get-event-tickets `,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }

    fnGetOccurrenceTicket(requestObject){
        return this.http.post(`${environment.apiUrl}/get-occurrence-ticket-api `,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }
    
    changeCouponStaus(requestObject){
        return this.http.post(`${environment.apiUrl}/update-coupon-status-api`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }
    fnDeleteCoupon(requestObject){
        return this.http.post(`${environment.apiUrl}/delete-coupon-api`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }
    fnDeleteVoucher(requestObject){
        return this.http.post(`${environment.apiUrl}/delete-voucher-api`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }
    fnGetSignleCouponDetail(requestObject){
        return this.http.post(`${environment.apiUrl}/get-single-coupon-api`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }
    fnGetSignleVoucherDetail(requestObject){
        return this.http.post(`${environment.apiUrl}/get-single-voucher-api`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }
    createNewEvent(requestObject){
        return this.http.post(`${environment.apiUrl}/create-event-api`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }
    createCustomersForm(requestObject){
        return this.http.post(`${environment.apiUrl}/create-customer-api`,requestObject,{headers:this.globalHeaders}).pipe(
            map((res) => {
                return res;
            }),catchError(this.handleError));
        }
         
    getAllCustomersDetails(requestObject){
        return this.http.post(`${environment.apiUrl}/get-all-customer-api`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }
    
    fnGetAllEventListPaggination(url,requestObject){
        return this.http.post(`${url}`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }

    fnGetAllEventList(requestObject){
        return this.http.post(`${environment.apiUrl}/get-allboxoffice-event-api`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }
    fnAllEventList(requestObject){
        return this.http.post(`${environment.apiUrl}/all-events`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }
    
    getAllEventList(requestObject){
        return this.http.post(`${environment.apiUrl}/get-allboxoffice-events`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }
    

    getSingleCustomersDetails(requestObject){
        return this.http.post(`${environment.apiUrl}/get-single-customer-api`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }
    createNewTicket(requestObject){
        return this.http.post(`${environment.apiUrl}/add-ticket`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }

    updateCustomerDetails(requestObject){
        return this.http.post(`${environment.apiUrl}/update-customer-api`,requestObject,{headers:this.globalHeaders}).pipe(
            map((res) => {
                return res;
         }),catchError(this.handleError));
    }
    
    deleteCustomerDetails(requestObject){
        return this.http.post(`${environment.apiUrl}/delete-customer-api`,requestObject,{headers:this.globalHeaders}).pipe(
            map((res)=>{
                return res;
            }),catchError(this.handleError));
        
    }
 
   fnImportCustomer(requestObject){  

        return this.http.post(`${environment.apiUrl}/import-customers`,requestObject,{}).pipe(
            map((res)=>{
                return res;
         }),catchError(this.handleError));
   }
    
    fnExportCustomer(requestObject){
        return this.http.post(`${environment.apiUrl}/export-customers`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),
        catchError(this.handleError));
    }

    fnExportOrders(requestObject){
        return this.http.post(`${environment.apiUrl}/export-orders`,requestObject,{headers:this.globalHeaders}).pipe(
         map((res) => {
            return res;
          }),
         catchError(this.handleError));
    }

    fnGetallOrders(url,requestObject){
        return this.http.post(`${url}`,requestObject,{headers:this.globalHeaders}).pipe(
         map((res) => {
            return res;
          }),
         catchError(this.handleError));
    }
    
    fnGetOccurrenceOrders(url,requestObject){
        return this.http.post(`${url}`,requestObject,{headers:this.globalHeaders}).pipe(
         map((res) => {
            return res;
          }),
         catchError(this.handleError));
    }

    fnResendOrder(orderId){
        return this.http.get(`${environment.apiUrl}/resend-order?unique_code=${orderId}`,{headers:this.globalHeaders}).pipe(
         map((res) => {
            return res;
          }),
         catchError(this.handleError));
    }

    getSingleEventSettings(requestObject) {
        return this.http.post(`${environment.apiUrl}/get-setting-option-api`,requestObject,{headers:this.globalHeaders}).pipe(
            map((res) => {
                return res;
        }),catchError(this.handleError));
    }
    getSettings(requestObject) {
        return this.http.post(`${environment.apiUrl}/get-setting-option-api`,requestObject,{headers:this.globalHeaders}).pipe(
            map((res) => {
                return res;
        }),catchError(this.handleError));
    }

    getAllAddTax(requestObject){
        return this.http.post(`${environment.apiUrl}/getsaltetax-api`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }
    
    getVoucherCode(requestObject) {
        return this.http.post(`${environment.apiUrl}/front-voucher-discount-check`,requestObject,{headers:this.globalHeaders}).pipe(
            map((res) => {
                return res;
        }),catchError(this.handleError));
    }

    orderUpdate(requestObject) {
        console.log(requestObject);
        return this.http.post(`${environment.apiUrl}/order-update`,requestObject,{headers:this.globalHeaders}).pipe(
            map((res) => {
                return res;
        }),catchError(this.handleError));
    }


    // downloadOrder(orderId){
    //     return this.http.post(`${environment.apiUrl}/stream-invoice-pdf?order_id==${orderId}`,{headers:this.globalHeaders}).pipe(
    //      map((res) => {
    //         return res;
    //       }),
    //      catchError(this.handleError));
    // }

    fnCancelOrder(requestObject){
        return this.http.post(`${environment.apiUrl}/cancel-order`,requestObject,{headers:this.globalHeaders}).pipe(
         map((res) => {
            return res;
          }),
         catchError(this.handleError));
    }

    fnGetsingleOrder(requestObject){
        return this.http.post(`${environment.apiUrl}/get-single-order`,requestObject,{headers:this.globalHeaders}).pipe(
         map((res) => {
            return res;
          }),
         catchError(this.handleError));
    }

    fnUpdatePaymentStatus(requestObject){
        return this.http.post(`${environment.apiUrl}/payment-status-update`,requestObject,{headers:this.globalHeaders}).pipe(
         map((res) => {
            return res;
          }),
         catchError(this.handleError));
    }

    createVoucherCode(requestObject){
        return this.http.post(`${environment.apiUrl}/create-voucher-api`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }
    updateVoucherCode(requestObject){
        return this.http.post(`${environment.apiUrl}/update-voucher-api`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }
    fnChangeEventStatus(requestObject){
        return this.http.post(`${environment.apiUrl}/update-event-status`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }
    createOrder(requestObject){
        return this.http.post(`${environment.apiUrl}/create-order`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }

    // DownloadTicket(requestObject){
    //     return this.http.get(`${environment.apiUrl}/resend-order?unique_code=ord16063742131431`,{headers:this.globalHeaders}).pipe(
    //      map((res) => {
    //         return res;
    //       }),
    //      catchError(this.handleError));
    // }

    
    fnAssignEventToVoucher(requestObject){
        return this.http.post(`${environment.apiUrl}/assign-voucher-to-event`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }
    fnAssignTicketToCoupon(requestObject){
        return this.http.post(`${environment.apiUrl}/coupon-apply-to-ticket`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }

    fngetCustomersEventlist(requestObject){
         return this.http.post(`${environment.apiUrl}/get-events-list`,requestObject,{headers:this.globalHeaders}).pipe(
         map((res) => {
         return res;
         }),catchError(this.handleError));
    }

    cancelOrder(requestObject){
        return this.http.post(`${environment.apiUrl}/update-order-status`,requestObject,{headers:this.globalHeaders}).pipe(
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

}


    
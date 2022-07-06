import { Component, Inject, Injectable, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';
import { Router, RouterEvent, RouterOutlet } from '@angular/router';
import { map, catchError, filter } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { AuthenticationService } from '../../../_services/authentication.service';



@Injectable({ providedIn: 'root' })
export class SettingService {

    // token = localStorage.getItem('token');
    // admin_id = localStorage.getItem('admin-id');
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

    

    getAllLanguages(){
        return this.http.post(`${environment.apiUrl}/get-languages`,{}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }

    getAllTimezone(){
        return this.http.post(`${environment.apiUrl}/get-timezones`,{}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }
    
    createNewBusiness(requestObject){
        return this.http.post(`${environment.apiUrl}/create-boxoffice-api`,{}).pipe(
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

    removeBoxOfficeImage(requestObject){
        return this.http.post(`${environment.apiUrl}/remove-boxoffice-image-api`,requestObject,{headers:this.globalHeaders}).pipe(
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

    updateBoxoffice(requestObject){
        return this.http.post(`${environment.apiUrl}/update-boxoffice-api`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }

    updateMyProfile(requestObject){
        return this.http.post(`${environment.apiUrl}/update-profile-api`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }

    changePassword(requestObject){
        return this.http.post(`${environment.apiUrl}/admin-password-update`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }

    getMyProfileData(requestObject){
        return this.http.post(`${environment.apiUrl}/get-profile-api`,requestObject,{headers:this.globalHeaders}).pipe(
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

    getSettingsValue(requestObject){
        return this.http.post(`${environment.apiUrl}/get-setting-option-api
        `,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }

    getAllInviter(requestObject){
        return this.http.post(`${environment.apiUrl}/all-requested-inviter-api
        `,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }

    inviteform(requestObject){
        return this.http.post(`${environment.apiUrl}/request-inviter-api`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }

    updateTeamRole(requestObject){
        return this.http.post(`${environment.apiUrl}/change-permission`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }
   
    removeImage(requestObject){
        return this.http.post(`${environment.apiUrl}/remove-boxoffice-image-api`,requestObject,{headers:this.globalHeaders}).pipe(
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

    removeProfileImage(requestObject){
        return this.http.post(`${environment.apiUrl}/remove-user-image`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }

  
    addTax(requestObject){
        return this.http.post(`${environment.apiUrl}/addsaltetax-api`,requestObject,{headers:this.globalHeaders}).pipe(
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

    updateTax(requestObject){
        return this.http.post(`${environment.apiUrl}/updatesaltetax-api`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }

    deleteTax(requestObject){
        return this.http.post(`${environment.apiUrl}/deletesaltetax-api`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }

    getSingleTaxData(requestObject){
        return this.http.post(`${environment.apiUrl}/get-single-tax`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }

    changeTaxStaus(requestObject){
        return this.http.post(`${environment.apiUrl}/update-tax-status`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }
    
    fnGetAllEventList(requestObject){
        return this.http.post(`${environment.apiUrl}/all-events`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }
    fnGetAllEventListView(requestObject){
        return this.http.post(`${environment.apiUrl}/front-events-list`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }
    
    getEventsList(requestObject){
        return this.http.post(`${environment.apiUrl}/get-events-list`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }
    getSingleEvent(requestObject) {
        return this.http.post(`${environment.apiUrl}/get-single-event-api`,requestObject,{headers:this.globalHeaders}).pipe(
            map((res) => {
                return res;
        }),catchError(this.handleError));
    }

    resendInviter(requestObject){
        return this.http.post(`${environment.apiUrl}/resend-invitation`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }

    deleteInviter(requestObject){
        return this.http.post(`${environment.apiUrl}/delete-request-inviter-api`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }

    removeTeamMember(requestObject){
        return this.http.post(`${environment.apiUrl}/remove-inviter`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }

    createAppUser(requestObject){
        return this.http.post(`${environment.apiUrl}/app-user-signup`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }
    updateAppUser(requestObject){
        return this.http.post(`${environment.apiUrl}/app-user-update`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }
    getAllAppUsers(requestObject){
        return this.http.post(`${environment.apiUrl}/app-user-list`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }
    userRemove(requestObject){
        return this.http.post(`${environment.apiUrl}/app-user-delete`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }
    userEdit(requestObject){
        return this.http.post(`${environment.apiUrl}/app-user-update`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }
    getAllPaymentGateways(requestObject){
        return this.http.post(`${environment.apiFolderUrl}/showAllPaymentGateway`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }
    UpdatePaymentGateway(requestObject){
        return this.http.post(`${environment.apiFolderUrl}/savePaymentGateway`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }
    ChangeGatewayStatus(requestObject){
        return this.http.post(`${environment.apiFolderUrl}/changeStatusPaymentGateway`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }
    ChangeDefaultGateway(requestObject){
        return this.http.post(`${environment.apiFolderUrl}/makeDefaultPaymentGatway`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }
    getCreditList(){
        return this.http.post(`${environment.apiUrl}/credit-list`,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }
    purchaseCredits(requestObject){
        return this.http.post(`${environment.apiUrl}/buy-credits`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }
    checkSubscription(requestObject){
        return this.http.post(`${environment.apiUrl}/check-boxoffice-subscription`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }
    
    getInvoiceList(requestObject){
        return this.http.post(`${environment.apiUrl}/subscription-invoice-list`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }
    
    submitCardDetail(requestObject){
        return this.http.post(`${environment.apiUrl}/add-subscription`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }
    
    updateCardDetail(requestObject){
        return this.http.post(`${environment.apiUrl}/update-card-details`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }
    
    getCreditDetails(requestObject){
        return this.http.post(`${environment.apiUrl}/credit-details`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }
    
    getUnbilledUsage(requestObject){
        return this.http.post(`${environment.apiUrl}/unbilling-usages`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }
    
    getOverviewUnBillUsage(requestObject){
        return this.http.post(`${environment.apiUrl}/overview-unbilling-usages`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }
    
    addWhiteLable(requestObject){
        return this.http.post(`${environment.apiUrl}/add-whitelabel-subscription`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }
    cancelWhiteLable(requestObject){
        return this.http.post(`${environment.apiUrl}/cancel-whitelabel-subscription`,requestObject,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }
    
    getBoxOfficeEvents(requestObject) {
        return this.http.post(`${environment.apiUrl}/front-events-list`,requestObject,{headers:this.globalHeaders}).pipe(
            map((res) => {
                return res;
        }),catchError(this.handleError));
    }
    
    applyForCherityDiscount(requestObject:any) {
        // requestObject = JSON.parse(requestObject)
        return this.http.post(`${environment.apiUrl}/send-charity-discount`, requestObject ,{}).pipe(
            map((res) => {
                return res;
        }),catchError(this.handleError));
    }

      googleMap(address) {
        return this.http.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyA8RwRCpG7ajbR-pl0D58oUGzi83c6RCYk`).pipe(
            map((res) => {
                return res;
        }),catchError(this.handleError));
    }

}
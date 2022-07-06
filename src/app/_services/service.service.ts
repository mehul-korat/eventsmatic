import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse,HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable,throwError } from 'rxjs';
import { map,catchError, filter } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User } from '../_models/index';

@Injectable({ providedIn: 'root' })
export class ServiceService {

    public currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    user_id: any;
    globalHeaders:any;
    keepMe:any;
    currentUserData:any;
    constructor(private http: HttpClient) {
        this.keepMe = localStorage.getItem('keepMeSignIn')
        if (this.keepMe == 'true') {
          this.currentUserData = localStorage.getItem('currentUser')
        } else {
          this.currentUserData = sessionStorage.getItem('currentUser')
        }
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(this.currentUserData));
        this.currentUser = this.currentUserSubject.asObservable();

        this.globalHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            // 'admin-id' : this.currentUserSubject.user_id,
            // 'api-token' : this.currentUserSubject.token
        });

    }

    

    public get currentUserValue(): User {       
        return this.currentUserSubject.value;
    }

    private handleError(error: HttpErrorResponse) {
        return throwError('Error! something went wrong.');
    }

    getSingleEvent(requestObject) {
        return this.http.post(`${environment.apiUrl}/get-single-event-api`,requestObject,{headers:this.globalHeaders}).pipe(
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
    getBoxOfficeDetail(requestObject) {
        return this.http.post(`${environment.apiUrl}/front-boxoffice-details`,requestObject,{headers:this.globalHeaders}).pipe(
            map((res) => {
                return res;
        }),catchError(this.handleError));
    }
    
    getAllCountry(){    
        return this.http.post(`${environment.apiUrl}/get-country-api`,{headers:this.globalHeaders}).pipe(
        map((res) => {
            return res;
        }),catchError(this.handleError));
    }
    

 


  

   
}
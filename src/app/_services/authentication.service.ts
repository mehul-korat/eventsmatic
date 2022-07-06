import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User } from '../_models/index';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    public currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    user_id: any;
    keepMe: any
    currentUserData: any
    constructor(
        private http: HttpClient,
        private _snackBar: MatSnackBar,
    ) {
        if (localStorage.getItem('keepMeSignIn')) {
            this.keepMe = localStorage.getItem('keepMeSignIn')
        }
        if (this.keepMe == 'true') {
            this.currentUserData = localStorage.getItem('currentUser')
        } else {
            this.currentUserData = sessionStorage.getItem('currentUser')
        }
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(this.currentUserData));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public getIPAddress() {
        return this.http.get(`${environment.apiUrl}/get-ip`);
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(email: string, password: string) {
        return this.http.post<any>(`${environment.apiUrl}/login`, { email, password })
            .pipe(map(user => {
                if (user && user.data == true && user.response.token) {
                    if (localStorage.getItem('keepMeSignIn')) {
                        this.keepMe = localStorage.getItem('keepMeSignIn')
                        if (this.keepMe == 'true') {
                            localStorage.setItem('currentUser', JSON.stringify(user.response));
                        } else {
                            sessionStorage.setItem('currentUser', JSON.stringify(user.response));
                        }
                        var logoutTime = new Date();
                        logoutTime.setHours( logoutTime.getHours() + 6 );
                        localStorage.setItem('logoutTime', JSON.stringify(logoutTime));
                    }

                    this.currentUserSubject.next(user.response);

                }
                return user;
            }));
    }


    signup(signUpUserObj) {
        return this.http.post<any>(`${environment.apiUrl}/signup`, signUpUserObj)
            .pipe(map(data => {
                return data;
            }));
    }

    sendResetLink(user_email: string) {
        let site_url = environment.urlForLink;
        return this.http.post<any>(`${environment.apiUrl}/ForgotPasswordProcess/send_reset_link`, { user_email, site_url })
            .pipe(map(data => {
                return data;
            }));

    }

    setNewPassword(npassword: string, user_id: string) {
        return this.http.post<any>(`${environment.apiUrl}/ForgotPasswordProcess/set_reset_password`, { npassword, user_id })
            .pipe(map(data => {
                return data;
            }));

    }

    logout() {
        if (this.keepMe == 'true') {
            localStorage.removeItem('currentUser');
            localStorage.removeItem('isFront');
            localStorage.removeItem('logoutTime');
            localStorage.removeItem('isBoxoffice');
            sessionStorage.removeItem('currentUser');
            localStorage.clear();
            window.location.reload(true);
        } else {
            sessionStorage.removeItem('currentUser');
            sessionStorage.removeItem('isFront');
            sessionStorage.removeItem('logoutTime');
            sessionStorage.removeItem('isBoxoffice');
            sessionStorage.clear();
            window.location.reload(true);
        }


    }



    logoutTime() {
        var currentUser = JSON.parse(this.currentUserData);
        if (currentUser) {
            var logoutTime = JSON.parse(localStorage.getItem('logoutTime'));
            logoutTime = new Date(logoutTime);
            var currentTime = new Date();
            if (currentTime > logoutTime && localStorage.getItem('logoutTime')) {
                this.logout();
                return true;
            } else {
                return false;
            }
        }
    }

    loginWithGoogleFacebook (authId, email, provider) : Observable<any> {
        if (email == '') {
            this._snackBar.open('Please add email id in your facebook account.', "X", {
                duration: 2000,
                verticalPosition: 'top',
                panelClass: ['red-snackbar']
            });
        }
        let requestObject = {
            "auth_id": authId,
            "email_id": email,
            "provider": provider
        }
        return this.http.post<any>(`${environment.apiUrl}/social-signup`, requestObject)
            .pipe(map(user => {
                console.log(user)
                if(user.data == true){

                    if(localStorage.getItem('keepMeSignIn')){
                        this.keepMe = localStorage.getItem('keepMeSignIn')
                        if (this.keepMe == 'true') {
                            localStorage.setItem('currentUser', JSON.stringify(user.response.userData));
                        } else {
                            sessionStorage.setItem('currentUser', JSON.stringify(user.response.userData));
                        }
                        // localStorage.setItem('currentUser', JSON.stringify(user.response.userData));
                        this.currentUserSubject.next(user.response.userData);
                        var logoutTime = new Date();
                        logoutTime.setHours(logoutTime.getHours() + 6);
                        localStorage.setItem('logoutTime', JSON.stringify(logoutTime));
                        console.log(user.response);

                        return user.response;
                    }
                    // localStorage.setItem('currentUser', JSON.stringify(user.response.userData));
                    this.currentUserSubject.next(user.response.userData);
                    var logoutTime = new Date();
                    logoutTime.setHours(logoutTime.getHours() + 6);
                    localStorage.setItem('logoutTime', JSON.stringify(logoutTime));
                    console.log(user.response);
                    
                return user.response;
            }else{
                this._snackBar.open(user.response, "X", {
                    duration: 2000,
                    verticalPosition: 'top',
                    panelClass: ['red-snackbar']
                  });
            }
                console.log(user.response);
            }));
    }

}
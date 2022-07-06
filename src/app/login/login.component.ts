import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from '../_services/authentication.service';
import { AppComponent } from '../app.component';
import { User, Role } from '../_models';
// import { CookieService } from "angular2-cookie/core";


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    isLoaderAdmin: boolean = false;
    loading = false;
    submitted = false;
    returnUrl: string;
    error = '';
    hide = true;
    hideLoginForm: boolean = true;
    dataLoaded: boolean = false;
    isIE: boolean = false;
    currentUser: User;
    keepMe: any = 'false';
    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private _snackBar: MatSnackBar,
        private authenticationService: AuthenticationService,
        private appComponent: AppComponent,
        // private _cookieService: CookieService
        //private appComponent:AppComponent,
    ) {
        if (/msie\s|trident\//i.test(window.navigator.userAgent)) {
            this.isIE = true;
        }
        // redirect to home if already logged in
        this.authenticationService.currentUser.subscribe(x => this.currentUser = x);

        if (this.authenticationService.currentUserValue) {
            this.appComponent.fnCheckLoginStatus();

        } else {
            this.dataLoaded = true;
        }
        
        // this._cookieService.put("test", "123123213213");
    };

    ngOnInit(): void {

        let emailPattern = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
        this.loginForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email, Validators.pattern(emailPattern)]],
            password: ['', Validators.required]
        });
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        if(localStorage.getItem('keepMeSignIn')){
            this.keepMe = localStorage.getItem('keepMeSignIn')
        }
        // localStorage.setItem('keepMeSignIn', this.keepMe)
    }
    
    get f() { return this.loginForm.controls; }

    onSubmit() {

        localStorage.setItem('keepMeSignIn', this.keepMe)
        this.submitted = true;
        if (this.loginForm.invalid) {
            this.loginForm.get('email').markAsTouched();
            this.loginForm.get('password').markAsTouched();
            return false;
        }

        this.dataLoaded = false;
        // this.isLoaderAdmin = true;
        this.authenticationService.login(this.loginForm.get('email').value, this.loginForm.get('password').value)
            .pipe(first()).subscribe(data => {

                if (data.data == true) {
                    // alert(this.keepMe)
                    if (this.keepMe == 'true') {
                        // alert('localStorage')
                        localStorage.setItem('currentUser', JSON.stringify(data.response))
                    } else {
                        sessionStorage.setItem('currentUser', JSON.stringify(data.response))
                    }

                    let currentUser = data.response;
                    if (currentUser.type == 'member') {
                        localStorage.setItem('isBoxoffice', 'false');
                        localStorage.setItem('boxoffice_id', currentUser.boxoffice_id);
                        localStorage.setItem('boxoffice_name', currentUser.boxoffice_name);

                        if (currentUser.permission != 'A') {
                            
                            localStorage.removeItem('permision_OM');
                            localStorage.removeItem('permision_OV');
                            localStorage.removeItem('permision_EM');
                            var permistion = currentUser.permission.split(",");

                            if (permistion.indexOf("EM") > -1) {
                                localStorage.setItem('permision_EM', 'TRUE');
                                // localStorage.removeItem('permision_OM');
                                // localStorage.removeItem('permision_OV');
                                localStorage.removeItem('permision_ALL');

                            }

                            if (permistion.indexOf("OM") > -1) {
                                localStorage.setItem('permision_OM', 'TRUE');
                                // localStorage.removeItem('permision_EM');
                                // localStorage.removeItem('permision_OV');
                                localStorage.removeItem('permision_ALL');
                            }

                            if (permistion.indexOf("OV") > -1) {
                                localStorage.setItem('permision_OV', 'TRUE');
                                // localStorage.removeItem('permision_OM');
                                // localStorage.removeItem('permision_EM');
                                localStorage.removeItem('permision_ALL');
                            }

                        } else {
                            localStorage.setItem('permision_ALL', 'TRUE');
                            localStorage.removeItem('permision_OM');
                            localStorage.removeItem('permision_EM');
                            localStorage.removeItem('permision_OV');
                        }

                    }
                    this.router.navigate(["/super-admin"]);
                    // this.isLoaderAdmin = false;

                } else if (data.data == false) {

                    this._snackBar.open(data.response, "X", {
                        duration: 2000,
                        verticalPosition: 'top',
                        panelClass: ['red-snackbar']
                    });
                    this.error = data.response;
                    this.dataLoaded = true;

                } else {
                    this.error = "Database Connection Error.";
                    this.dataLoaded = true;
                }
                this.isLoaderAdmin = false;
            }, error => {
                this.error = "Database Connection Error.";
                this.dataLoaded = true;
            });

    }

    keepMeSignIn(event) {
        console.log(event)
        if(event.checked == true){
            this.keepMe = 'true';
        }else{
            this.keepMe = 'false';
        }
        // this.keepMe = event.checked
        console.log(event.checked)
        localStorage.setItem('keepMeSignIn', this.keepMe)
        // alert(this.keepMe)
    }


    signInWithGoogle(): void {
        localStorage.setItem('keepMeSignIn', this.keepMe)
        this.appComponent.signInWithGoogle(this.loginForm);
    }
    signInWithFB(): void {
        localStorage.setItem('keepMeSignIn', this.keepMe)
        this.appComponent.signInWithFB(this.loginForm);
    }
}

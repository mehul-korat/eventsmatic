import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators,FormControl } from '@angular/forms';
import { first } from 'rxjs/operators';
import {MatSnackBar} from '@angular/material/snack-bar';
import { Router, RouterOutlet ,ActivatedRoute} from '@angular/router';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { AuthenticationService } from '../_services/authentication.service';
import { ErrorService } from '../_services/error.service'
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signUpForm: FormGroup;
  adminSignUpData:any;
  termsCheckbox:boolean = true;
  termsCheckboxChecked:boolean = false;
  isLoaderAdmin:boolean = false;
  inviter : boolean = false;
  inviterEmail:any;
  inviterCode:any;
  requestObject:any;
  hide= true;
  hide1 = true;
  error = '';
  keepMe: any = 'false';

  constructor( private formBuilder: FormBuilder,
  private http: HttpClient,
  public router: Router,
  private route: ActivatedRoute,
  private _snackBar: MatSnackBar,
  private ErrorService: ErrorService,
  private authenticationService: AuthenticationService,
  private appComponent: AppComponent,
    )
     {
		if(this.route.snapshot.queryParamMap.get('email')){
			this.inviter = true;
			this.inviterEmail = this.route.snapshot.queryParamMap.get('email')
			this.inviterCode = this.route.snapshot.queryParamMap.get('inviter')
		}
		// console.log(this.route.snapshot.queryParamMap.get('email'));
		// console.log(this.route.snapshot.queryParamMap.get('inviter'));
	let emailPattern=/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
	
	if(this.inviter){
		this.signUpForm = this.formBuilder.group({
			firstname: ['', Validators.required],      
			email:     [this.inviterEmail,[Validators.required,Validators.email,Validators.pattern(emailPattern)]],
			password: ['',[Validators.required,Validators.minLength(8),Validators.maxLength(12)]],
			ReNewPassword: ['',Validators.required]
		},{validator: this.checkPasswords });
		this.signUpForm.controls['email'].disable();
	}else{
		this.signUpForm = this.formBuilder.group({
			firstname: ['', Validators.required],    
			email:     ['',[Validators.required,Validators.email,Validators.pattern(emailPattern)]],
			password: ['',[Validators.required,Validators.minLength(8),Validators.maxLength(12)]],
			ReNewPassword: ['',Validators.required]
		},{validator: this.checkPasswords });
	} 
	
   }

  	ngOnInit(): void {
  	}
  	private handleError(error: HttpErrorResponse) {
		return throwError('Error! something went wrong.');
	}

	checkPasswords(group: FormGroup) { // here we have the 'passwords' group
		let pass = group.controls.password.value;
		let confirmPass = group.controls.ReNewPassword.value;
		
		return pass === confirmPass ? null : { notSame: true }
		}

		
	fnChangeTermsPrivacyCheck(check){
		this.termsCheckboxChecked = check;
		this.termsCheckbox = check;
	}

  	fnSignUp(){
		if(!this.termsCheckboxChecked){
			this.termsCheckbox = false;
		}
    
		if(this.signUpForm.invalid){
		this.signUpForm.get('firstname').markAsTouched();
		this.signUpForm.get('email').markAsTouched();
		this.signUpForm.get('password').markAsTouched();
		this.signUpForm.get('ReNewPassword').markAsTouched();
		return false;
		}
		if(!this.termsCheckboxChecked){
			this.termsCheckbox = false;
			return false;
		}

		this.isLoaderAdmin = true;

		if(this.inviter){
			this.requestObject = {
				"firstname":this.signUpForm.get("firstname").value,
				"email":this.signUpForm.get("email").value,
				"password":this.signUpForm.get("ReNewPassword").value,
				// "description":this.signUpForm.get("description").value,
				"inviter_id": this.inviterCode,
			};
		}else{
			
		this.requestObject = {
			"firstname":this.signUpForm.get("firstname").value,
			"email":this.signUpForm.get("email").value,
			"password":this.signUpForm.get("ReNewPassword").value,
		};
		}
		let headers = new HttpHeaders({
			'Content-Type': 'application/json',
		});
		
		this.http.post(`${environment.apiUrl}/signup`,this.requestObject,{headers:headers} ).pipe(	
		map((res) => {
			return res;
		}),
		catchError(this.handleError)
		).subscribe((response:any) => {
			this.adminSignUpData = JSON.stringify(response.response)

			if(response.data == true){
				this._snackBar.open("Account Succesfully Created", "X", {
					duration: 2000,
					verticalPosition: 'top',
					panelClass : ['green-snackbar']
				});
				this.isLoaderAdmin = false;
				localStorage.setItem('keepMeSignIn', this.keepMe)
				this.onLogin();
				// this.router.navigate(["/login"]);
			}else{
				this.ErrorService.errorMessage(response.response);
			
				this.isLoaderAdmin = false;
			}
			
		},
		(err) =>{
			console.log(err)
		})
    
  }

  
  onLogin() {

	this.isLoaderAdmin = true;

	this.authenticationService.login(this.signUpForm.get('email').value, this.signUpForm.get('ReNewPassword').value)
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

			} else {
				this.error = "Database Connection Error.";
			}
			this.isLoaderAdmin = false;
		}, error => {
			this.error = "Database Connection Error.";
		});

}

  isEmailUnique(control: FormControl) {
		return new Promise((resolve, reject) => {
		  setTimeout(() => {
			let headers = new HttpHeaders({
			  'Content-Type': 'application/json',
			});
			return this.http.post(`${environment.apiUrl}/verify-email`,{ emailid: control.value },{headers:headers}).pipe(map((response : any) =>{
			  return response;
			}),
			catchError(this.handleError)).subscribe((res) => {
			  if(res){
				if(res.data == false){
				resolve({ isEmailUnique: true });
				}else{
				resolve(null);
				}
			  }
			});
		  }, 500);
		});
	  }

	  signInWithGoogle(): void {
        // localStorage.setItem('keepMeSignIn', this.keepMe)
        this.appComponent.signInWithGoogle(this.signUpForm);
    }
    signInWithFB(): void {
        // localStorage.setItem('keepMeSignIn', this.keepMe)
        this.appComponent.signInWithFB(this.signUpForm);
    }

}

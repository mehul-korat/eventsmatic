import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, throwError } from 'rxjs';
import { AuthenticationService } from '../_services/authentication.service';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm:FormGroup;
  accesToken : any;
  newPassword: any;
  hide= true;
  hide1= true;
  saveDisabled:boolean=false;
  isLoaderAdmin:boolean=false;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,  
    private _snackBar: MatSnackBar,
    private authenticationService: AuthenticationService,

  ) { }

  ngOnInit(): void {
    this.resetPasswordForm = this.formBuilder.group({
      NewPassword:['',[Validators.required,Validators.minLength(8),Validators.maxLength(12)]],
      ReNewPassword: ['', Validators.required]            
    },{validator: this.checkPasswords });
    console.log(this.route.snapshot.queryParams['accessToken']);
    
    this.accesToken = this.route.snapshot.queryParams['accessToken'];
  }

  private handleError(error: HttpErrorResponse) {
    console.log(error);
    return throwError('Error! something went wrong.');
}

checkPasswords(group: FormGroup) { // here we have the 'passwords' group
let pass = group.controls.NewPassword.value;
let confirmPass = group.controls.ReNewPassword.value;

return pass === confirmPass ? null : { notSame: true }
}

get f() { return this.resetPasswordForm.controls; }

 
  fnSubmitResetPassword(){
    if (this.resetPasswordForm.valid) {
      this.saveDisabled = true;
      setTimeout(() => {
        this.saveDisabled = false
      }, 3000);
      this.newPassword = this.resetPasswordForm.get('ReNewPassword').value
      this.isLoaderAdmin = true;
      let requestObject = {
        "password":this.newPassword,
        "token" : this.accesToken
      };
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
      });
      return this.http.post(`${environment.apiUrl}/reset-password`,requestObject,{headers:headers}).pipe(
      map((res) => {
          return res;
      }),
      catchError(this.handleError)
      ).subscribe((response:any) => {
        if(response.data == true){
          this._snackBar.open("Passward Successfully Reset.", "X", {
            duration: 2000,
            verticalPosition:'top',
            panelClass :['green-snackbar']
          });
          this.router.navigate(['/login']);
        }
        else if(response.data == false){
          this._snackBar.open(response.response, "X", {
            duration: 2000,
            verticalPosition:'top',
            panelClass :['red-snackbar']
          });
        }
        this.isLoaderAdmin = false;
      }, (err) =>{
        console.log(err)
      })
    }    else{
      
      this.resetPasswordForm.get('NewPassword').markAsTouched();
      this.resetPasswordForm.get('ReNewPassword').markAsTouched();
    }  
  }
}

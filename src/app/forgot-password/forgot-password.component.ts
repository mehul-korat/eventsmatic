import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, filter } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  forgotForm:FormGroup;
  dataLoaded: boolean = true;
  isLoaderAdmin: boolean = false;
  forgotPwdContainer: boolean = true;
  emailSentContainer: boolean = false;
  forgotEmail: any;
  error = '';
  saveDisabled:boolean=false;

  constructor(
    private formBuilder: FormBuilder,
    private http:HttpClient,
    private route: ActivatedRoute,
    private router: Router,       
    private _snackBar: MatSnackBar,
  
    ) {
    let emailPattern=/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
    this.forgotForm = this.formBuilder.group({
        email: ['',[Validators.required,Validators.email,Validators.pattern(emailPattern)]],
    });
   }

  ngOnInit(): void {
  }

  private handleError(error: HttpErrorResponse) {
    console.log(error);
    return throwError('Error! something went wrong.');
}


forgotPwdSubmit(){
  this.forgotEmail =  this.forgotForm.get('email').value
  if(this.forgotForm.valid){
    this.isLoaderAdmin=true;
  this.saveDisabled = true;
  setTimeout(() => {
    this.saveDisabled = false
  }, 3000);
     let site_url = environment.urlForLink;
  let requestObject = {
        "email":this.forgotEmail,
         "url" : site_url+"/reset-password?accessToken"
      };
  let headers = new HttpHeaders({
        'Content-Type': 'application/json',
      });
      return this.http.post(`${environment.apiUrl}/forget-password`,requestObject,{headers:headers}).pipe(
      map((res) => {
          return res;
      }),
      catchError(this.handleError)
      ).subscribe((response:any) => {
        if(response.data == true){
          this._snackBar.open(response.response, "X", {
            duration: 2000,
            verticalPosition:'top',
            panelClass :['green-snackbar']
          });
            this.router.navigate(['/login']);
            this.isLoaderAdmin=false;
        }
        else if(response.data == false){  this.saveDisabled = true;
         
          this._snackBar.open(response.response, "X", {
            duration: 2000,
            verticalPosition:'top',
            panelClass :['red-snackbar']
          });
          this.isLoaderAdmin=false;
        }
      }, (err) =>{
        console.log(err)
      })
  }else{
   this.forgotForm.get('email').markAsTouched();
  }
  
}
fnCloseForgotPwd(){
  this.router.navigate(['/login']);
}
}

import { Component, Inject, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { throwError, from } from 'rxjs';
import { map, catchError, filter } from 'rxjs/operators';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../environments/environment';

export interface DialogData {
    animal: string;
    name: string;
}

@Component({
    selector: 're-authentication-popup',
    templateUrl: './../_dialogs/re-authentication-password.html',
})
export class DialogAuthentication {

    currentUser: any;
    reAuthenticationForm: FormGroup
    keepMe:any;
    constructor(
        public dialogRef: MatDialogRef<DialogAuthentication>,
        public dialogRef2: MatDialog,
        private _formBuilder: FormBuilder,
        public router: Router,
        private _snackBar: MatSnackBar,
        private http: HttpClient,
        @Inject(MAT_DIALOG_DATA) public data: DialogData) {
        this.keepMe = localStorage.getItem('keepMeSignIn')
        if (this.keepMe == 'true') {
            this.currentUser =  JSON.parse(localStorage.getItem('currentUser'))
          } else {
            this.currentUser =  JSON.parse(sessionStorage.getItem('currentUser'))
          }
      
          // this.currentUser = JSON.parse(this.currentUser);
        this.reAuthenticationForm = this._formBuilder.group({
            user_password: ['', [Validators.required]],
        });
    }

    private handleError(error: HttpErrorResponse) {
        console.log(error);
        return throwError('Error! something went wrong.');
    }

    fnEnterKeyPress(event) {
        if (event.keyCode === 13) {
            this.submit();
        }
    }


    submit() {

        if (this.reAuthenticationForm.valid) {

            let requestObject = {
                "user_type": this.currentUser.user_type,
                "user_id": this.currentUser.user_id,
                "password": this.reAuthenticationForm.get('user_password').value
            };

            this.http.post(`${environment.apiUrl}/user-re-login`, requestObject).pipe(map((res) => {
                return res;
            }), catchError(this.handleError)).subscribe((response: any) => {

                if (response.data == true) {

                    localStorage.setItem('currentUser', JSON.stringify(response.response));
                    this.dialogRef.close(response.response);
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);

                } else if (response.data == false) {

                    this._snackBar.open(response.response, "X", {
                        duration: 2000,
                        verticalPosition: 'top',
                        panelClass: ['red-snackbar']
                    });

                    this.reAuthenticationForm.get('user_password').markAsTouched();
                }

            }, (err) => {
                console.log(err)
            });
        } else {
            this.reAuthenticationForm.get('user_password').markAsTouched();
        }
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    closePopup() {
        this.dialogRef.close();
    }

}


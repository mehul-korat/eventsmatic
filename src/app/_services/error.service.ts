import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { DialogAuthentication } from './auth.component';
import { Router, RouterEvent, RouterOutlet } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from '../../environments/environment';
import { Observable, throwError, from } from 'rxjs';
import { map, catchError, filter } from 'rxjs/operators';
import { AuthenticationService } from './authentication.service';

export interface DialogData {
  animal: string;
  name: string;
}
@Injectable({
  providedIn: 'root'
})

export class ErrorService {
  currentUser: any
  boxOfficeCode: any;
  dialogRef: any;
  keepMe: any;
  constructor(
    private http: HttpClient,
    public dialog: MatDialog,
    public router: Router,
    private authenticationService: AuthenticationService,
    private _snackBar: MatSnackBar,
  ) {

    this.keepMe = localStorage.getItem('keepMeSignIn')
    if (this.keepMe == 'true') {
      this.currentUser =  JSON.parse(localStorage.getItem('currentUser'))
    } else {
      this.currentUser =  JSON.parse(sessionStorage.getItem('currentUser'))
    }

    // this.currentUser = JSON.parse(this.currentUser);

    localStorage.setItem('isBusiness', 'false');
    if (localStorage.getItem('boxoffice_id')) {
      this.boxOfficeCode = localStorage.getItem('boxoffice_id');
    }
  }

  private handleError(error: HttpErrorResponse) {
    return throwError('Error! something went wrong.');
  }
  errorMessage(errorMessage) {
    if (errorMessage == 'TOKEN_EXPIRED') {
      this.checkAuthentication();
      return false;
    } else {
      this._snackBar.open(errorMessage, "X", {
        duration: 2000,
        verticalPosition: 'top',
        panelClass: ['red-snackbar']
      });
    }
  }
  successMessage(errorMessage) {
    this._snackBar.open(errorMessage, "X", {
      duration: 2000,
      verticalPosition: 'top',
      panelClass: ['green-snackbar']
    });
  }

  checkAuthentication() {
    let requestObject = {
      "user_type": JSON.parse(this.currentUser).user_type,
      "user_id": JSON.parse(this.currentUser).user_id,
      "token": JSON.parse(this.currentUser).token
    };
    this.http.post(`${environment.apiUrl}/check-token`, requestObject).pipe(
      map((res) => {
        return res;
      }),
      catchError(this.handleError)
    ).subscribe((response: any) => {
      if (response.data == true) {
      }
      else if (response.data == false) {
        this.reAuthenticateUser();
      }
    }, (err) => {
      console.log(err)
    });

  }

  reAuthenticateUser() {

    if (this.dialogRef) return;
    this.dialogRef = this.dialog.open(DialogAuthentication, {
      width: '500px',
    });

    this.dialogRef.afterClosed().subscribe(result => {

      if (result) {
        this.currentUser = result;

      } else {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
      }

    });

  }
}

import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http'
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-response-page',
  templateUrl: './response-page.component.html',
  styleUrls: ['./response-page.component.scss']
})
export class ResponsePageComponent implements OnInit {
  responseMessage:any
  token:any
  pageView:any
  isLoaderAdmin: boolean = false;
  constructor(
    private http:HttpClient,
    private router: ActivatedRoute
  ) { }

  ngOnInit() {
    
    this.router.queryParams.subscribe(params => {
    this.token = params;
    });
    console.log(this.token.token)
    this.getResponse();
  }

  private handleError(error: HttpErrorResponse) {
    console.log(error);
    return throwError('Error! something went wrong.');
}

  getResponse(){
    this.isLoaderAdmin = true;
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    let requestObject = {
      'token' : this.token.token
    }
    
    return this.http.post(`${environment.apiUrl}/verify-email`,requestObject, {headers:headers}).pipe(map(res=>{
      return res;
    }),
      catchError(this.handleError)
    ).subscribe((response:any) =>{

      if(response.data == true){
        this.pageView = 'thankyou'
        this.responseMessage = response.response
      }
      
      if(response.data == false){
        this.pageView = 'oops'
        this.responseMessage = response.response
      }
      this.isLoaderAdmin = false;
    })
   
  }

}

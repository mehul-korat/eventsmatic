import { Component, OnInit } from '@angular/core';
import { SingleEventServiceService } from '../_services/single-event-service.service';
import { ErrorService } from '../../../_services/error.service';
import { Router, ActivatedRoute } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss']
})
export class DeleteComponent implements OnInit {

  BoxofficeId:any;
  selectedEvent:any;
  isLoaderAdmin = true;
  eventdetails:any = "N";
  eventName:any;

  constructor(
    private SingleEventServiceService:SingleEventServiceService,
    private ErrorService:ErrorService,
    private router: Router,
    private _snackBar:MatSnackBar,
  ) { 
    
    if(localStorage.getItem('boxoffice_id')){
      this.BoxofficeId = localStorage.getItem('boxoffice_id');
    }
    if(localStorage.getItem('selectedEventCode')){
      this.selectedEvent = localStorage.getItem('selectedEventCode');
    }  
  }

  ngOnInit(): void {
    this.fnGetEventDetail();
  }

  fnDeleteEvents(event){
    if(event.checked == true){
      this.eventdetails = 'Y' 
    }else{
      this.eventdetails = 'N' 
    }
  }

  fnGetEventDetail(){

    let requestObject = {
      'unique_code' : this.selectedEvent,
    }

    this.SingleEventServiceService.getSingleEvent(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.eventName = response.response.event[0];
        // this.eventStatus = this.eventDetail.event_status;
      } else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
    });

  }

  deleteEvent(){
    if(this.eventdetails=='Y'){
          let requestObject ={
          "unique_code":  this.selectedEvent,
          } 

      this.SingleEventServiceService.fnDeleteEvent(requestObject).subscribe((response:any)=>{
        if(response.data == true){
          this.ErrorService.successMessage(response.response);
          this.router.navigate(["/super-admin/events"]);
          
      } else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
        }
        this.isLoaderAdmin = false;
      });
    }else if(this.eventdetails=='N'){
      this.ErrorService.errorMessage("please select the checkbox");
      this._snackBar.open("please select the checkbox", "X", {
        duration: 2000,
        verticalPosition: 'top',
        panelClass : ['red-snackbar']
        });
      }
    }


  } 


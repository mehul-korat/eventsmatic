import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SingleEventServiceService } from '../_services/single-event-service.service';
import { ErrorService } from '../../../_services/error.service';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialogComponent } from '../../../_components/confirmation-dialog/confirmation-dialog.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


@Component({
  selector: 'app-duplicate',
  templateUrl: './duplicate.component.html',
  styleUrls: ['./duplicate.component.scss'],
  providers: [DatePipe]
})
export class DuplicateComponent implements OnInit {

  duplicateArray = [];
  items: FormArray;
  duplicateForm: FormGroup;
  minDate = new Date();
  minTillDate: any = new Date();
  isLoaderAdmin: boolean = false;
  isPastEvent: boolean = false;
  duplicateId: any;
  eventName: any;
  fullDayTimeSlote:any;
  starTime:any;
  endTime:any;
  errorMessage:any;
  startEndSameDate:any;
  recurringEvent:any='N';
  currentTime:any;
  startdateToday:boolean=false;
  // duplicateForm:boolean=false;
  finalArr = [];
  constructor(
    private formBuilder: FormBuilder,
    private SingleEventServiceService: SingleEventServiceService,
    private ErrorService: ErrorService,
    private datePipe: DatePipe,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private router: Router,
  ) {
    this.duplicateArray.length = 1;
    if (localStorage.getItem('selectedEventCode')) {
      this.duplicateId = localStorage.getItem('selectedEventCode')
    }
    this.fnGetEventDetail();

    this.duplicateForm = this.formBuilder.group({
      items: this.formBuilder.array([ this.createItem() ])
    });

  }

  ngOnInit(): void {
    this.getTimeSlote()
  }

  createItem(): FormGroup {
    if(this.recurringEvent == 'N'){
      return this.formBuilder.group({
        event_title: ['',Validators.required],
        start_date:  ['',Validators.required],
        start_time:  ['',Validators.required],
        end_date:  ['',Validators.required],
        end_time:  ['',Validators.required],
        event_status:  ['',Validators.required]
      });
    }else{
      
    return this.formBuilder.group({
      event_title: ['',Validators.required],
      event_status:  ['',Validators.required]
    });
    }
  }

  
  transformTime24To12(time: any): any {
    let hour = (time.split(':'))[0];
    let min = (time.split(':'))[1];
    let part = 'AM';
    let finalhrs = hour
    if(hour == 0){
      finalhrs = 12
    }
    if(hour == 12){
      finalhrs = 12;
      part = 'PM';
    }
    if(hour > 12){
      finalhrs  = hour - 12
      part = 'PM' 
    }
    return `${finalhrs}:${min} ${part}`
  }


  fnAddDuplicate() {
    this.items = this.duplicateForm.get('items') as FormArray;
    this.items.push(this.createItem());
    this.finalArr = this.duplicateForm.value.items
  }

  fnRemoveDuplicate(index) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: "Are you sure want to delete event?"
    });
    dialogRef.afterClosed().subscribe(result => {
        if(result){
          (this.duplicateForm.get('items') as FormArray).removeAt(index);
        }
    });
    
  }
  fnChangeEventStartDate(event){
    this.minTillDate = event.value;
    var todayDate = this.datePipe.transform(new Date(),"yyyy-MM-dd")
    var selectedStartDate = this.datePipe.transform(new Date(event.value),"yyyy-MM-dd")
    console.log('selectedStartDate',selectedStartDate)
    console.log('todayDate',todayDate)
    if(selectedStartDate === todayDate){
      this.startdateToday=true;
      this.currentTime = this.datePipe.transform(new Date(),"h:mm a")
      this.currentTime = this.transformTime24To12(this.datePipe.transform(new Date(),"h:mm a"))
      console.log(this.currentTime)
    }else{
      this.startdateToday=false;
    }
    this.errorMessage = null;

    // this.minTillDate = this.duplicateForm.get('start_date').value;
  }
  fnChangeEventEndDate(event){
    let startDate = this.datePipe.transform(new Date(this.minTillDate),"yyyy-MM-dd");
    let endDate = this.datePipe.transform(new Date(event.value),"yyyy-MM-dd");
   
    if(startDate == endDate){
      this.startEndSameDate = true;
    }else{
      this.startEndSameDate = false;
    }
    this.errorMessage = null;
  }
  onStatusChange(){
    this.errorMessage = null;
  }

  getTimeSlote(){
    let requestObject = {
      'interval'  :'30',
    }
    this.SingleEventServiceService.getTimeSlote(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.fullDayTimeSlote= response.response
      }
    });
  }

  onChangeStartTime(i){
    console.log('start')
    this.starTime = this.fullDayTimeSlote[i]
    console.log(this.starTime)
    this.errorMessage = null;
  }

  onChangeEndTime(i){
    console.log('end')
    this.endTime =this.fullDayTimeSlote[i]
    console.log(this.endTime)
    this.errorMessage = null;
  }

  getContactsFormGroup(index): FormGroup {
    return this.duplicateForm.controls[index] as FormGroup;
  }

  onchenageformValue(){
    this.errorMessage = null;
  }

  fnGetEventDetail() {

    let requestObject = {
      'unique_code': this.duplicateId,
    }

    this.SingleEventServiceService.getSingleEvent(requestObject).subscribe((response: any) => {
      if (response.data == true) {
        this.eventName = response.response.event[0];
        this.isPastEvent = response.response.past;
        this.recurringEvent= response.response.event[0].event_occurrence_type;
      } else if (response.data == false) {
        this.ErrorService.errorMessage(response.response);
      }
    });

  }

  fnFinalSubmit(){
    if(this.duplicateForm.get('items').invalid){
      this.duplicateForm.get('items').markAllAsTouched();
    }
    this.items = this.duplicateForm.get('items') as FormArray;
    this.finalArr = this.duplicateForm.value.items;
    if(this.recurringEvent == 'N'){
      this.finalArr.forEach(element => {
        element.end_time = this.fullDayTimeSlote[element.end_time]
        element.start_time = this.fullDayTimeSlote[element.start_time]   
        element.start_date = this.datePipe.transform(new Date(element.start_date), "yyyy-MM-dd")
        element.end_date = this.datePipe.transform(new Date(element.end_date), "yyyy-MM-dd")
        // alert(element.start_date)
      });
    }else if(this.recurringEvent == 'Y'){
      this.finalArr.forEach(element => {
        element.end_time = null
        element.start_time = null
        element.start_date = null
        element.end_date = null
        // alert(element.start_date)
      });
    }
  if(this.recurringEvent == 'N'){
    if(this.finalArr[this.finalArr.length - 1].event_title == "" && this.finalArr[this.finalArr.length - 1].start_date == "" &&
    this.finalArr[this.finalArr.length - 1].start_time == "" && this.finalArr[this.finalArr.length - 1].end_date == "" &&
    this.finalArr[this.finalArr.length - 1].end_time == "" && this.finalArr[this.finalArr.length - 1].event_status == ""){
      this.finalArr.splice(this.finalArr.length-1, 1);
     }else if(this.finalArr[this.finalArr.length - 1].event_title == "" || this.finalArr[this.finalArr.length - 1].start_date == "" ||
     this.finalArr[this.finalArr.length - 1].start_time == "" || this.finalArr[this.finalArr.length - 1].end_date == "" ||
     this.finalArr[this.finalArr.length - 1].end_time == "" || this.finalArr[this.finalArr.length - 1].event_status == ""){
       this.errorMessage = 'Please fill up the required fields'
       return false
     }else{
      this.createDuplicateEvent();
     }
  }else if(this.recurringEvent == 'Y'){
    if(this.finalArr[this.finalArr.length - 1].event_title == "" && this.finalArr[this.finalArr.length - 1].event_status == ""){
      this.finalArr.splice(this.finalArr.length-1, 1);
     }else if(this.finalArr[this.finalArr.length - 1].event_title == "" || this.finalArr[this.finalArr.length - 1].event_status == ""){
       this.errorMessage = 'Please fill up the required fields'
       return false
     }else{
      this.createDuplicateEvent();
     }
  }
   


  }

  createDuplicateEvent(){
    this.isLoaderAdmin = true;
    let requestObject = {
      "unique_code": this.duplicateId,
      "eventArry" : this.finalArr
    }
    console.log(requestObject)
    this.SingleEventServiceService.duplicateForm(requestObject).subscribe((response: any) => {
      if (response.data == true) {
        if(this.recurringEvent == 'Y'){
          this._snackBar.open('Your event created successfully! You can go to occurrence menu and create occurrence for event.', "X", {
            duration: 4000,
            verticalPosition: 'top',
            panelClass: ['green-snackbar']
          });
        }else{
        this.ErrorService.successMessage('Your event created successfully!');
        }
        this.duplicateForm.reset();
        this.router.navigate(["/super-admin/events"]);
      } else if (response.data == false) {
        this.ErrorService.errorMessage(response.response);
      }
      this.isLoaderAdmin = false;
    });
  }
}
import {Component, OnInit, ViewChild,Inject,ChangeDetectorRef, ElementRef} from '@angular/core';
import { FormGroup, FormBuilder, Validators,FormControl, FormArray } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { SingleEventServiceService } from '../_services/single-event-service.service';
import { ErrorService } from '../../../_services/error.service';
import { DatePipe} from '@angular/common';
import { Observable, throwError, ReplaySubject, Subject } from 'rxjs';
import { environment } from '../../../../environments/environment'
import { Router, ActivatedRoute } from '@angular/router';
import { take, takeUntil } from 'rxjs/operators';
import { invalid } from '@angular/compiler/src/render3/view/util';


@Component({
  selector: 'app-occurrences',
  templateUrl: './occurrences.component.html',
  styleUrls: ['./occurrences.component.scss'],
  providers: [DatePipe]
})
export class OccurrencesComponent implements OnInit {
  isLoaderAdmin:boolean=false;
  event_id:any;
  boxoffice_id:any;
  allOccurrenceList:any=[];
  selectedOccurrenceAarry:any=[];
  selectAll: boolean = false;
  singleOccurenceData:any;
  // selectedfilter:any;
  selectedfilter:any;
  fullDayTimeSlote:any;
  visibilityStatus:any;
  avaibilityStatus:any;
  eventDetail:any
  currencycode:any;
  constructor(
    
    private _formBuilder: FormBuilder,
    public dialog: MatDialog,
    private ErrorService: ErrorService,
    private datePipe: DatePipe,
    private router: Router,
    private el: ElementRef,
    private SingleEventServiceService: SingleEventServiceService,
    private change:ChangeDetectorRef
  ) {
    if(localStorage.getItem('selectedEventCode')){
      this.event_id = localStorage.getItem('selectedEventCode')
    }
   }

  ngOnInit(): void {
    this.getAllOccurrenceList();
    this.fnGetEventDetail();
    this.getTimeSlote();
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

  getTimeSlote(){
    let requestObject = {
      'interval'  :'30',
    }
    this.SingleEventServiceService.getTimeSlote(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.fullDayTimeSlote= response.response;

      }
    });
  }
  getAllOccurrenceList(){
    this.isLoaderAdmin=true;
    let requestObject = {
      'event_id':this.event_id,
      'filter':'all'
    }
    this.SingleEventServiceService.getAllOccurrenceList(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.allOccurrenceList= response.response;
        this.allOccurrenceList.forEach(element => {
          if(element.soldout.length == 0){
            element.soldout = 'Tickets are not available'
          }
          if(element.final_revenue.length == 0){
            element.final_revenue = 'Tickets are not available'
          }
          if(element.remaining.length == 0){
            element.remaining = 'Tickets are not available'
          }
          if(element.occurance_start_time){
            element.occurance_start_time_modified = this.transformTime24To12(element.occurance_start_time);
          }
          if(element.occurance_end_time){
            element.occurance_end_time_modified = this.transformTime24To12(element.occurance_end_time);
          }
          // element.occurance_start_time = moment(element.occurance_start_time).format('hh:mm a');
          // element.occurance_end_time = moment(element.occurance_end_time).format('hh:mm a');
        });
        console.log(this.allOccurrenceList)
      }else if(response.data == false){
        this.allOccurrenceList.length = 0;
        // this.ErrorService.errorMessage(response.response)
      }
    });
    this.isLoaderAdmin=false;
  }

  

  checkAll(event){

    this.selectedOccurrenceAarry = [];

    for (let i = 0; i < this.allOccurrenceList.length; i++) {
      const item = this.allOccurrenceList[i];
      item.is_selected = event.checked;
      if(event.checked){
        

        this.selectedOccurrenceAarry.push(item.unique_code)
      }
    }

    if(event.checked){
      this.selectAll = true;
    }else{
      this.selectAll = false;
    }


  }

  
  fnGetEventDetail(){
    this.isLoaderAdmin=true;
    let requestObject = {
      'unique_code' : this.event_id,
    }
    
    this.SingleEventServiceService.getSingleEvent(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.eventDetail = response.response.event[0];
       
        this.currencycode = this.eventDetail.event_setting.currency ? this.eventDetail.event_setting.currency  : 'USD';
      } else if(response.data == false){
        // this.ErrorService.errorMessage(response.response);
      }
      this.isLoaderAdmin=false;
    });
  }

  fnChangeOccuStatus(value){
    if(value == 'DEL'){
      this.fnOccurrenceDelete();
    }else if(value == 'AVI' || value == 'UNAVI') {
      let requestObject = {
        'occurance_id':this.selectedOccurrenceAarry,
        'status_availability':value
      }
      this.updateStatus(requestObject);
    }else if(value == 'HIDD' || value == 'VIS') {
      let requestObject = {
        'occurance_id':this.selectedOccurrenceAarry,
        'status_visibility':value
      }
      this.updateStatus(requestObject);
    }
  }

  updateStatus(requestObject){
    this.isLoaderAdmin=true;
      this.SingleEventServiceService.occurrenceStatusUpdate(requestObject).subscribe((response:any) => {
        if(response.data == true){
          this.ErrorService.successMessage(response.response)
          this.selectedOccurrenceAarry.length = 0;
          this.selectAll = false;
          this.selectedfilter=null;
          this.getAllOccurrenceList();
        }else if(response.data == false){
          this.ErrorService.errorMessage(response.response)
        }
      });
      this.isLoaderAdmin=false;
  }

  fnOccurrenceDelete(){
    this.isLoaderAdmin=true;
    let requestObject = {
      'occurance_id':this.selectedOccurrenceAarry,
    }
    
    this.SingleEventServiceService.occurrenceDelete(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.ErrorService.successMessage(response.response);
        this.selectedOccurrenceAarry.length = 0;
        this.selectAll = false;
        this.selectedfilter=null;
        this.getAllOccurrenceList();
        
      } else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
    });
    this.isLoaderAdmin=false;
  }
  
  singleStatusUpdate(occCode,status){
    this.selectedOccurrenceAarry.push(occCode);
    this.fnChangeOccuStatus(status);
  }

  fnAddOccurrenceId(event, OccId,i){

    if(event == true){
      this.selectedOccurrenceAarry.push(OccId);
      this.allOccurrenceList[i].is_selected = true;

    }else if(event == false){
      this.allOccurrenceList[i].is_selected = false;

      const index = this.selectedOccurrenceAarry.indexOf(OccId, 0);
      if (index > -1) {
          this.selectedOccurrenceAarry.splice(index, 1);
      }
    }
    if (this.selectedOccurrenceAarry.length == this.allOccurrenceList.length ) {
      this.selectAll = true;
    } else {
      this.selectAll = false;
    }

  }


  fnCreateRepeatOccurrence(){
    const dialogRef = this.dialog.open(addRepeatOccurrence,{
      width: '700px',
      data : {
        // boxOfficeCode : this.boxOfficeCode,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.getAllOccurrenceList();
      }
    });
  }

  fnCreateSingleOccurrence(){
    const dialogRef = this.dialog.open(addSingleOccurrence,{
      width: '700px',
      data : {
        fullDayTimeSlote:this.fullDayTimeSlote
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.getAllOccurrenceList();
      }
    });
  }

  editSingleOccurence(index){
    this.singleOccurenceData = this.allOccurrenceList[index]
    const dialogRef = this.dialog.open(addSingleOccurrence,{
      width:'700px',
      data:{
        singleOccurenceData:this.singleOccurenceData,
        fullDayTimeSlote:this.fullDayTimeSlote,
      }
    })

    dialogRef.afterClosed().subscribe(result =>{
      if(result){
        this.getAllOccurrenceList();
      }
    })
  }
}

@Component({
  selector: 'add-repeat-occurrence',
  templateUrl: '../_dialogs/add-repeat-occurrence.html',
  providers: [DatePipe]
})
export class addRepeatOccurrence {

  addRepeatRecurrenceForm:FormGroup;
  fullDayTimeSlote:any;
  fullDayTimeSloteEnd:any=[];
  disabledEndSlote:any;

  dayStartTime:any;
  dayEndTime:any;
  dayTimeForm:FormGroup;
  dayTimeArr:FormArray;
  startEndTime:any=[];
  minSelectStartDate:any = new Date();
  minSelectEndDate:any = [];
  dateSelectfield:any=[];
  isLoaderAdmin:boolean=false;
  repeatForm:FormGroup;
  repeatDataArr:FormArray;
  finalRepeatData:any = [];

  selected:any = [];
  allDayCheckOption:any = 'N';
  checkAllDayValue:boolean = true;
  saveDisabled:boolean=false;

  public isStartTimeChange: Boolean = true;

  constructor(
    public dialogRef: MatDialogRef<addRepeatOccurrence>,
    private _formBuilder: FormBuilder,
    private ErrorService: ErrorService,
    private datePipe: DatePipe,
    private SingleEventServiceService: SingleEventServiceService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      
      this.startEndTime.length = 1;
      this.dayTimeForm = this._formBuilder.group({
        dayTimeArr: this._formBuilder.array([this.createTimeSlote()])
      });

      this.finalRepeatData.length = 1;
      this.repeatForm = this._formBuilder.group({
        repeatDataArr:this._formBuilder.array([this.createRepeatSlote()])
      });

    }

    ngOnInit(): void {
      this.getTimeSlote();
      this.disabledEndSlote = true;
      this.selected.push("na");
      this.dateSelectfield.push(false);
      this.minSelectEndDate.push(new Date());
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

    onSubmit(){
      this.dayTimeArr = this.dayTimeForm.get('dayTimeArr') as FormArray;
      this.startEndTime = this.dayTimeForm.value.dayTimeArr;

      this.repeatDataArr = this.repeatForm.get('repeatDataArr') as FormArray;
      this.finalRepeatData = this.repeatForm.value.repeatDataArr;

      if(this.allDayCheckOption == 'N'){
        if(this.startEndTime[this.startEndTime.length - 1].start_time == ''){
          this.ErrorService.errorMessage('start time is blank.');
          return false;
        }else if(this.startEndTime[this.startEndTime.length - 1].end_time == ''){
          this.ErrorService.errorMessage('end time is blank.');
          return false;
        }
      }

    

      if(this.finalRepeatData[this.finalRepeatData.length-1].start_date == ''){
        this.ErrorService.errorMessage('start date is blank')
        return false;
      }else if(this.finalRepeatData[this.finalRepeatData.length-1].repeat == 'na'){
        this.ErrorService.errorMessage('repeat option is blank')
        return false;
      }else if(this.finalRepeatData[this.finalRepeatData.length-1].end_date == ''){
        this.ErrorService.errorMessage('end date is blank')
        return false;
      }
      if(this.finalRepeatData.length > 0){
        this.finalRepeatData.forEach(element => {
          element.start_date = this.datePipe.transform(new Date(element.start_date+1),"yyyy-MM-dd");
          element.end_date = this.datePipe.transform(new Date(element.end_date+1),"yyyy-MM-dd");
          // element.end_date = element.end_date-1
          
            console.log(element)
        });
      }

      this.isLoaderAdmin =true;
      let requestObject = {
        "all_day" : this.allDayCheckOption,
        "event_id" : localStorage.getItem('selectedEventCode'),
        "timeslots" : this.startEndTime,
        "dateslots" : this.finalRepeatData  
      }
      console.log(requestObject)
      this.SingleEventServiceService.repeatOccurrenceCreate(requestObject).subscribe((response:any) =>   {
        if(response.data == true){
          this.saveDisabled = true;
            setTimeout(() => {
              this.saveDisabled = false
            }, 3000);
          this.ErrorService.successMessage(response.response); 
          this.dialogRef.close('created')
        }else{
          this.ErrorService.errorMessage(response.response);
        }
        this.isLoaderAdmin =false;
      })
    }

    createTimeSlote(){
      return this._formBuilder.group({
        start_time:['',[Validators.required]],
        end_time:['',[Validators.required]]
      })
    }

    createRepeatSlote(){
      return this._formBuilder.group({
        start_date:['',[Validators.required]],
        repeat:['',[Validators.required]],
        end_date:['',[Validators.required]]
      });
    }

    fnAddStartEndTime(){
      this.dayTimeArr = this.dayTimeForm.get('dayTimeArr') as FormArray;
      this.dayTimeArr.push(this.createTimeSlote());
      this.startEndTime = this.dayTimeForm.value.dayTimeArr
    }

    fnAddRepeat(){
      this.repeatDataArr = this.repeatForm.get('repeatDataArr') as FormArray; 
      this.repeatDataArr.push(this.createRepeatSlote());
      this.finalRepeatData = this.repeatForm.value.repeatDataArr;
      this.selected.push("na");
      // if(this.finalRepeatData[this.finalRepeatData.length+1].repeat == ''){
      //   this.dateSelectfield = false
      // }
    } 
    
    fnDeleteDayTime(index){

      this.dayTimeArr = this.dayTimeForm.get('dayTimeArr') as FormArray; 
      this.dayTimeArr.removeAt(index);
      this.startEndTime = this.dayTimeForm.value.dayTimeArr;
    }

    fnDeleteDayDate(index){

      this.repeatDataArr = this.repeatForm.get('repeatDataArr') as FormArray; 
      this.repeatDataArr.removeAt(index);
      // this.startEndTime = this.dayTimeForm.value.dayTimeArr;
    }

    onEnableEndTime(a,index) {
      /*Enables end time if start time is selected*/
            
            if (this.isStartTimeChange) {
              var _fullDayTimeSlote = this.fullDayTimeSlote;
              this.disabledEndSlote = false;
              this.fullDayTimeSloteEnd[index]= _fullDayTimeSlote.filter(function(e){ return e > a.value })
          } else {
              this.isStartTimeChange = true;
          }
            
        }

    fnChangeWholeDay(e){
      if(e.checked == true){
        this.checkAllDayValue = false
        this.allDayCheckOption = 'Y';
        this.dayTimeForm.reset();
      }
      if(e.checked == false){
        this.checkAllDayValue = true;
        this.allDayCheckOption = 'N'
      }
    }

    onChangeRepeat(event,index){
      this.dateSelectfield[index] = true
      if(event.value == this.selected[index]){
        this.dateSelectfield[index] = false
      }else{
        this.dateSelectfield[index] = true
      }

    }
    

 
  changeEvent(event,index){
      this.minSelectEndDate[index] =event.value;
  }

  getTimeSlote(){
    let requestObject = {
      'interval'  :'30',
    }
    this.SingleEventServiceService.getTimeSlote(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.fullDayTimeSlote= response.response;
        this.fullDayTimeSloteEnd[0] = response.response;
      }
    });
  }


  
  

  onNoClick(): void {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'add-single-occurrence',
  templateUrl: '../_dialogs/add-single-occurrence.html',
  providers: [DatePipe]
})
export class addSingleOccurrence {

  addRepeatRecurrenceForm:FormGroup;
  fullDayTimeSlote:any;
  dayStartTime:any;
  isLoaderAdmin:boolean=false;
  singleOccurrenceForm:FormGroup;
  minStartDate:any=new Date();
  minEndDate:any=new Date();
  startdateToday:boolean=false;
  startEndDateSame:boolean=false;
  currentTime:any;
  singleOccurenceData:any;
  alldayOccurrence:boolean=true;
  occurance_id:any;
  saveDisabled:boolean=false;
  constructor(
    public dialogRef: MatDialogRef<addSingleOccurrence>,
    private _formBuilder: FormBuilder,
    private ErrorService: ErrorService,
    private datePipe: DatePipe,
    private SingleEventServiceService: SingleEventServiceService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.singleOccurenceData = this.data.singleOccurenceData;
      console.log(this.singleOccurenceData)
      this.fullDayTimeSlote = this.data.fullDayTimeSlote;
      
      this.singleOccurrenceForm =  this._formBuilder.group({
        occurance_start_date: ['',[Validators.required]],
        occurance_end_date: ['',[Validators.required]],
        occurance_start_time: ['',[Validators.required]],
        occurance_end_time: ['',[Validators.required]],
      })

      if(this.singleOccurenceData){
        this.fnEditSingleOccurence();
      }
      
    }

    ngOnInit(): void {
    }


    fnEditSingleOccurence(){
      if(this.fullDayTimeSlote){
        if(this.singleOccurenceData.occurance_start_time && this.singleOccurenceData.occurance_end_time){
          this.alldayOccurrence =true;
          var start_time = this.singleOccurenceData.occurance_start_time.split(":")
          var start_time_key =  Object.keys(this.fullDayTimeSlote).find(key => this.fullDayTimeSlote[key] == start_time[0]+":"+start_time[1]);
          
          var end_time = this.singleOccurenceData.occurance_end_time.split(":")
          var end_time_key =  Object.keys(this.fullDayTimeSlote).find(key => this.fullDayTimeSlote[key] == end_time[0]+":"+end_time[1]);
          this.singleOccurrenceForm.controls['occurance_start_time'].setValue(start_time_key)
          this.singleOccurrenceForm.controls['occurance_end_time'].setValue(end_time_key)
        }else{
          this.alldayOccurrence = false;
          this.singleOccurrenceForm.controls["occurance_start_time"].setValidators(null);
          this.singleOccurrenceForm.controls["occurance_end_time"].setValidators(null);
          this.singleOccurrenceForm.controls["occurance_start_time"].updateValueAndValidity();
          this.singleOccurrenceForm.controls["occurance_end_time"].updateValueAndValidity();
          this.singleOccurrenceForm.updateValueAndValidity();
        }
       
      }
      this.occurance_id = this.singleOccurenceData.unique_code
      this.singleOccurrenceForm.controls['occurance_start_date'].setValue(this.singleOccurenceData.occurance_start_date)
      this.singleOccurrenceForm.controls['occurance_end_date'].setValue(this.singleOccurenceData.occurance_end_date)
      
    }
     
    
  

  
  // time formate 12 to 24
  transformTime(time: any): any {
    let hour = (time.split(':'))[0];
    let temp = (time.split(':'))[1];
    let min = (temp.split(' '))[0];
    let part = (time.split(' '))[1];
    if(part == 'PM' && hour !== '12'){
      hour = Number(hour)+12;
    }
    return `${hour}:${min}`
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

  fnChangeEventStartDate(){
      this.minEndDate = this.singleOccurrenceForm.get('occurance_start_date').value

      var todayDate = this.datePipe.transform(new Date(),"yyyy-MM-dd")
      var selectedStartDate = this.datePipe.transform(new Date(this.singleOccurrenceForm.get('occurance_start_date').value),"yyyy-MM-dd")
      if(selectedStartDate === todayDate){
        // this.singleOccurrenceForm.get('occurance_start_date').setValue('');
        this.startdateToday=true;
        this.currentTime = this.datePipe.transform(new Date(),"h:mm a")
        this.currentTime = this.transformTime(this.datePipe.transform(new Date(),"h:mm a"))
      }else{
        this.startdateToday=false;
      }
      this.singleOccurrenceForm.controls['occurance_end_date'].setValue(null);
      this.singleOccurrenceForm.controls['occurance_end_time'].setValue(null);
  }

  fnChangeEventEndDate(){
    
    var selectedStartDate = this.datePipe.transform(new Date(this.singleOccurrenceForm.get('occurance_start_date').value),"yyyy-MM-dd")
    var selectedEndDate = this.datePipe.transform(new Date(this.singleOccurrenceForm.get('occurance_end_date').value),"yyyy-MM-dd")
    if(selectedStartDate == selectedEndDate){
      this.startEndDateSame = true;
    }
    this.singleOccurrenceForm.controls['occurance_end_time'].setValue(null);
  }
  

  fnChangeStartTime(event){
    this.singleOccurrenceForm.controls['occurance_end_time'].setValue(null);
  }

  fnChangeEndTime(event){

  }

  onSubmit(){
    if(this.singleOccurrenceForm.valid){
      
      if(this.singleOccurenceData){
        this.isLoaderAdmin =true;
        var stratDate = this.datePipe.transform(new Date(this.singleOccurrenceForm.get('occurance_start_date').value), 'yyyy-MM-dd')
        var endDate = this.datePipe.transform(new Date(this.singleOccurrenceForm.get('occurance_end_date').value), 'yyyy-MM-dd')
        let requestObject = {
          
          "occurance_id": this.occurance_id,
          "event_id":localStorage.getItem('selectedEventCode'),
          "all_day":'N',
          "occurance_start_date": stratDate,
          "occurance_end_date": endDate,
          "occurance_start_time": this.fullDayTimeSlote[this.singleOccurrenceForm.get('occurance_start_time').value],
          "occurance_end_time": this.fullDayTimeSlote[this.singleOccurrenceForm.get('occurance_end_time').value],
        
        }
        this.SingleEventServiceService.singleOccurrenceUpdate(requestObject).subscribe((response:any)=>{
          if(response.data == true){
            this.saveDisabled = true;
              setTimeout(() => {
                this.saveDisabled = false
              }, 3000);
            this.ErrorService.successMessage(response.response)
            this.dialogRef.close('created');
          }else{
            this.ErrorService.errorMessage(response.response)
          }
          
        this.isLoaderAdmin =false;
        })
      }else{
        this.isLoaderAdmin =true;
        var stratDate = this.datePipe.transform(new Date(this.singleOccurrenceForm.get('occurance_start_date').value), 'yyyy-MM-dd')
        var endDate = this.datePipe.transform(new Date(this.singleOccurrenceForm.get('occurance_end_date').value), 'yyyy-MM-dd')
        let requestObject = {
          
          "event_id":localStorage.getItem('selectedEventCode'),
          "all_day":'N',
          "occurance_start_date": stratDate,
          "occurance_end_date": endDate,
          "occurance_start_time": this.fullDayTimeSlote[this.singleOccurrenceForm.get('occurance_start_time').value],
          "occurance_end_time": this.fullDayTimeSlote[this.singleOccurrenceForm.get('occurance_end_time').value],
        
        }
        this.SingleEventServiceService.singleOccurrenceCreate(requestObject).subscribe((response:any)=>{
          if(response.data == true){ 
            this.saveDisabled = true;
            setTimeout(() => {
              this.saveDisabled = false
            }, 3000);
            this.ErrorService.successMessage(response.response)
            this.dialogRef.close('created');
          }else{
            this.ErrorService.errorMessage(response.response)
          }
          this.isLoaderAdmin =false;
        })
      }
      
    }else{
      this.singleOccurrenceForm.get('occurance_start_date').markAllAsTouched()
      this.singleOccurrenceForm.get('occurance_end_date').markAllAsTouched()
      this.singleOccurrenceForm.get('occurance_start_time').markAllAsTouched()
      this.singleOccurrenceForm.get('occurance_end_time').markAllAsTouched()
    }
    
  }



  onNoClick(): void {
    this.dialogRef.close();
  }
}

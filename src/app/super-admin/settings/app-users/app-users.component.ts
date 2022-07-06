import { Component, OnInit, Inject,ViewChild } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {HttpClient} from '@angular/common/http';
import { DatePipe} from '@angular/common';
import { ErrorService } from '../../../_services/error.service'
import { SettingService } from '../_services/setting.service';
import * as moment from 'moment'; 
import { MdePopoverTrigger } from '@material-extended/mde';
// import html2canvas from 'html2canvas';
// import { jsPDF } from "jspdf";
import * as domtoimage from 'dom-to-image';


@Component({
  selector: 'app-app-users',
  templateUrl: './app-users.component.html',
  styleUrls: ['./app-users.component.scss'],
  providers: [DatePipe]
})
export class AppUsersComponent implements OnInit {

 
  isLoaderAdmin:boolean=false;
  boxOfficeCode:any;
  allAppUsersList:any;
  @ViewChild(MdePopoverTrigger, { static: false }) trigger: MdePopoverTrigger;
  constructor(public dialog: MatDialog,
    private SettingService : SettingService,
    private datePipe: DatePipe,
    private ErrorService : ErrorService,) { 
      
      if(localStorage.getItem('boxoffice_id')){
        this.boxOfficeCode = localStorage.getItem('boxoffice_id');   
      }
      this.getAllAppUsers();
    }

  ngOnInit(): void {
  }

  getAllAppUsers(){
    this.isLoaderAdmin = true;
    let requestObject = {
      'boxoffice_id' : this.boxOfficeCode
    }
    this.SettingService.getAllAppUsers(requestObject).subscribe((response:any) => {
      if(response.data == true){
      this.allAppUsersList = response.response;
      this.allAppUsersList.forEach(element => {
        element.created_at = this.datePipe.transform(element.created_at,"EEE MMM d, y")
      });
      }
      else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
        this.allAppUsersList = null;
      }
      this.isLoaderAdmin = false;
    })
  }

  fnAddAppUser() {
    const dialogRef = this.dialog.open(AddAppUser,{
      width: '700px',
      data:{
        boxOfficeCode:this.boxOfficeCode,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getAllAppUsers();
    });
  }

  fnUserDetail(index) {
    const dialogRef = this.dialog.open(appUserDetail,{
      width: '700px',
      data:{
        boxOfficeCode:this.boxOfficeCode,
        singleUserData: this.allAppUsersList[index]
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getAllAppUsers();
    });
  }

  closePopover() {
    this.trigger.togglePopover();
  }

  userEdit(index){
    this.trigger.togglePopover();
    const dialogRef = this.dialog.open(AddAppUser,{
      width: '700px',
      data:{
        boxOfficeCode:this.boxOfficeCode,
        userDetail:this.allAppUsersList[index],
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getAllAppUsers();
    });
  }

  userRemove(uniqueCode){
    this.trigger.togglePopover();
    this.isLoaderAdmin = true;
    let requestObject = {
      'unique_code' : uniqueCode
    }
    this.SettingService.userRemove(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.ErrorService.successMessage(response.response);
        this.getAllAppUsers();
      }
      else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
        this.allAppUsersList = null;
      }
      this.isLoaderAdmin = false;
    })
  }

}



@Component({
  selector: 'add-app-user',
  templateUrl: '../_dialogs/add-app-user.html',
  providers: [DatePipe]
})
export class AddAppUser {
  status:any;
  addAppUser:FormGroup;
  boxOfficeCode:any;
  isLoaderAdmin:any;
  selectedEvents:any=[];
  selectedOccurrences:any=[];
  allEventList:any;
  userDetail:any;
  alleventchecked:boolean=false;
  allEventStatus:any='N';
  emailPattern:any=/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/ 
  constructor(
    private _formBuilder:FormBuilder,
    public dialogRef: MatDialogRef<AddAppUser>,
    private http: HttpClient,
    private SettingService : SettingService,
    private ErrorService : ErrorService,
    private datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.boxOfficeCode = this.data.boxOfficeCode
      if(this.data.userDetail){
        this.userDetail  = this.data.userDetail;
        console.log(this.userDetail)
        this.selectedEvents=this.userDetail.events_ids.split(',').map(function(item) {
            return parseInt(item);
        });
        this.selectedOccurrences=this.userDetail.occurrence_ids.split(',').map(function(item) {
          return parseInt(item);
        });
        if(this.userDetail.all_status == 'Y'){
          this.alleventchecked = true;
        }else{
          this.alleventchecked=false
        }
      }
      this.getAllEvent();
      if(this.userDetail){
        this.addAppUser = this._formBuilder.group({
          firstname:[this.userDetail.firstname,[Validators.required]],
          lastname:[this.userDetail.lastname,[Validators.required]],
          email:[this.userDetail.email,[Validators.required,Validators.pattern(this.emailPattern)]],
        })
      }else{
        this.addAppUser = this._formBuilder.group({
          firstname:['',[Validators.required]],
          lastname:['',[Validators.required]],
          email:['',[Validators.required,Validators.pattern(this.emailPattern)]],
        })
      }
    }


    getAllEvent(){
      this.isLoaderAdmin = true;
      let requestObject = {
        'events_id' : 'all',
        'boxoffice_id' : this.boxOfficeCode
      }
      this.SettingService.fnGetAllEventList(requestObject).subscribe((response:any) => {
        if(response.data == true){
        this.allEventList = response.response
            this.allEventList.forEach(element => {
              console.log(element.event_title + '-----------'+element.event_occurrence_type)
              if(element.event_occurrence_type == 'Y'){
                let i = 0;
                element.occurrence.forEach(element2 => {
                  i++;
                  element2.occurrencefulldate = "";
                  element2.occurrenceenddate = "";
                  if(element2.occurance_start_time && element2.occurance_start_time != null && element2.occurance_end_time && element2.occurance_end_time != null){
                   
                    // element2.occurrencefulldate = this.datePipe.transform(element2.occurance_start_date+' '+element2.occurance_start_time,"'d MMM y, hh:mm a'");
                    // element2.occurrenceenddate = this.datePipe.transform(element2.occurance_end_date +' '+element2.occurance_end_time,"'d MMM y, hh:mm a'");
                    element2.occurrencefulldate = moment(element2.occurance_start_date+' '+element2.occurance_start_time).format('d MMM y, hh:mm a');
                    element2.occurrenceenddate = moment(element2.occurance_end_date +' '+element2.occurance_end_time).format('d MMM y, hh:mm a');
                    console.log(element2.occurrencefulldate)
                    console.log(element2.occurrenceenddate)
                
                  }else{
                    element2.occurrencefulldate = this.datePipe.transform(element2.occurance_start_date,"d MMM y");
                    element2.occurrenceenddate = this.datePipe.transform(element2.occurance_end_date,"d MMM y");
                    // element2.occurrencefulldate = moment(element2.occurance_start_date).format('d MMM y');
                    // element2.occurrenceenddate = moment(element2.occurance_end_date).format('d MMM y');
                  
                  }
                });
              }
            });
        }
        else if(response.data == false){
          this.ErrorService.errorMessage(response.response);
          this.allEventList = null;
        }
        this.isLoaderAdmin = false;
      })
    }

    fnAssignEvent(event, id){
      if(id !== 'all'){
        if(event.checked == true){
          this.selectedEvents.push(id)
        }else{
          const index = this.selectedEvents.indexOf(id, 0);
          if (index > -1) {
              this.selectedEvents.splice(index, 1);
          }
          this.allEventStatus = 'N';
          this.alleventchecked=false
        }
      }else{
        this.selectedEvents = [];
        if(event.checked == true) {  
         this.allEventStatus = 'Y';
         }else{ 
          this.allEventStatus = 'N';
         }
        this.allEventList.forEach(subelement => {
          if(event.checked == true) {  
            if(subelement.event_occurrence_type == 'N'){
              subelement.is_selected=true;
              this.selectedEvents.push(subelement.id)
            }
            else if(subelement.event_occurrence_type == 'Y'){
              subelement.occurrence.forEach(subelement1 => {
                subelement1.is_selected=true;
                this.selectedOccurrences.push(subelement1.id)
              });
            }
           }else{ 
            subelement.is_selected=false;
            if(subelement.event_occurrence_type == 'Y'){
              subelement.occurrence.forEach(subelement1 => {
                subelement1.is_selected=false;
                this.selectedOccurrences =[];
              });
            }
            this.selectedEvents = [];
          }
        });
     console.log(this.selectedEvents)
     console.log(this.selectedOccurrences)
      }
    }

    fnAssignOccurrence(event, id){
      if(event.checked == true){
        this.selectedOccurrences.push(id)
      }else{
        const index = this.selectedOccurrences.indexOf(id, 0);
        if (index > -1) {
            this.selectedOccurrences.splice(index, 1);
        }
      }
      console.log(this.selectedOccurrences)
    }
    fnOnSubmit(){
      if(this.addAppUser.valid){
        if(this.userDetail){
          let updateUserData = {
            'unique_code':this.userDetail.unique_code,
            // "boxoffice_id" : this.boxOfficeCode,
            "firstname" : this.addAppUser.get('firstname').value,
            "lastname" : this.addAppUser.get('lastname').value,
            "email" : this.addAppUser.get('email').value,
            "event_ids" : this.selectedEvents,
            "occurrence_ids" : this.selectedOccurrences,
            "all" : this.allEventStatus,
          }
          this.isLoaderAdmin = true;
          this.SettingService.updateAppUser(updateUserData).subscribe((response:any) => {
            if(response.data == true){
              this.ErrorService.successMessage(response.response);
              this.addAppUser.reset();
              this.dialogRef.close();
            }
            else if(response.data == false){
              this.ErrorService.errorMessage(response.response);
            }
            this.isLoaderAdmin = false;
          })
  
        }else{
          
        let newUserData = {
          "boxoffice_id" : this.boxOfficeCode,
          "firstname" : this.addAppUser.get('firstname').value,
          "lastname" : this.addAppUser.get('lastname').value,
          "email" : this.addAppUser.get('email').value,
          "event_ids" : this.selectedEvents,
          "occurrence_ids" : this.selectedOccurrences,
          "all" : this.allEventStatus,
        }
        this.isLoaderAdmin = true;
        this.SettingService.createAppUser(newUserData).subscribe((response:any) => {
          if(response.data == true){
            this.ErrorService.successMessage(response.response);
            this.addAppUser.reset();
            this.dialogRef.close();
          }
          else if(response.data == false){
            this.ErrorService.errorMessage(response.response);
          }
          this.isLoaderAdmin = false;
        })

      }
    }else{
      this.addAppUser.get("firstname").markAsTouched();
      this.addAppUser.get("lastname").markAsTouched();
      this.addAppUser.get("email").markAsTouched();
      }
    }


  onNoClick(): void {
    this.addAppUser.reset();
    this.dialogRef.close();
  }
  ngOnInit() {
  }
 
}


@Component({
  selector: 'App-User-Dateils',
  templateUrl: '../_dialogs/view-app-user.html',
  providers: [DatePipe]
})
export class appUserDetail {
  singleUserData:any;
  boxOfficeCode:any;
  isLoaderAdmin:boolean=false;
  passwordView:boolean=false;
  allEventList:any;
  pwdHiddenIcon:boolean=false;
  selectedEventList:any=[];
  selectedEventListCode:any=[];
  selectedOccurrenceList:any=[];
  selectedOccurrenceListCode:any=[];
  constructor(
    public dialogRef: MatDialogRef<appUserDetail>,
    private SettingService : SettingService,
    private datePipe: DatePipe,
    public dialog: MatDialog,
    private ErrorService : ErrorService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.singleUserData = this.data.singleUserData;
      console.log(this.singleUserData)
      this.boxOfficeCode = this.data.boxOfficeCode;
      // this.selectedEventListCode = this.singleUserData.events_ids.split(',')
      if(this.singleUserData.role == 'AU'){
        this.selectedEventListCode=this.singleUserData.events_ids.split(',').map(function(item) {
          return parseInt(item);
        });
        this.selectedOccurrenceListCode=this.singleUserData.occurrence_ids.split(',').map(function(item) {
          return parseInt(item);
        });
      }
      this.singleUserData.created_at = this.datePipe.transform(this.singleUserData.created_at,"EEE MMM d, y")
      if(this.selectedEventListCode.length > 0){
        this.getAllEvent()
      }
    }

    getAllEvent(){
        this.isLoaderAdmin = true; 
      let requestObject = {
        'events_id' : 'all',
        'boxoffice_id' : this.boxOfficeCode
      }
      this.SettingService.fnGetAllEventList(requestObject).subscribe((response:any) => {
        if(response.data == true){
        this.allEventList = response.response
        this.allEventList.forEach(element => {
          const index = this.selectedEventListCode.indexOf(element.id, 0);
          if (index > -1) {
              this.selectedEventList.push(element.event_title);
          }
          if(element.event_occurrence_type == 'Y'){
            element.occurrence.forEach(element2 => {
              
              element2.occurrencestartdate = "";
              element2.occurrenceenddate = "";
              if(element2.occurance_start_time && element2.occurance_start_time != null && element2.occurance_end_time && element2.occurance_end_time != null){
               
                // element2.occurrencefulldate = this.datePipe.transform(element2.occurance_start_date+' '+element2.occurance_start_time,"'d MMM y, hh:mm a'");
                // element2.occurrenceenddate = this.datePipe.transform(element2.occurance_end_date +' '+element2.occurance_end_time,"'d MMM y, hh:mm a'");
                element2.occurrencefulldate = moment(element2.occurance_start_date+' '+element2.occurance_start_time).format('d MMM y, hh:mm a');
                element2.occurrenceenddate = moment(element2.occurance_end_date +' '+element2.occurance_end_time).format('d MMM y, hh:mm a');

               
              }else{
                element2.occurrencefulldate = this.datePipe.transform(element2.occurance_start_date,"d MMM y");
                element2.occurrenceenddate = this.datePipe.transform(element2.occurance_end_date,"d MMM y");
                // element2.occurrencefulldate = moment(element2.occurance_start_date).format('d MMM y');
                // element2.occurrenceenddate = moment(element2.occurance_end_date).format('d MMM y');
              
              }
              const index = this.selectedOccurrenceListCode.indexOf(element2.id, 0);
              if (index > -1) {
                  this.selectedOccurrenceList.push(element2.occurrencefulldate +'-'+element2.occurrenceenddate  +' '+ element.event_title);
                  console.log(this.selectedOccurrenceList)
              }
              
            });
          }

        });
        // this.selectedEventList = JSON.stringify(this.selectedEventList)
        console.log(this.selectedOccurrenceList)
        }
        else if(response.data == false){
          this.ErrorService.errorMessage(response.response);
          this.allEventList = null;
        }
            this.isLoaderAdmin = false; 
      })
    }
    fnDelete(){
      this.isLoaderAdmin = true;
      let requestObject = {
        'unique_code' : this.singleUserData.unique_code
      }
      this.SettingService.userRemove(requestObject).subscribe((response:any) => {
        if(response.data == true){
          this.ErrorService.successMessage(response.response);
          this.dialogRef.close();
        }
        else if(response.data == false){
          this.ErrorService.errorMessage(response.response);
        }
        this.isLoaderAdmin = false;
      })
    }

    fnEdit(){
      const dialogRef = this.dialog.open(AddAppUser,{
        width: '700px',
        data:{
          boxOfficeCode:this.boxOfficeCode,
          userDetail:this.singleUserData,
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        this.dialogRef.close();
      });
    }

     public fnPrint()  { 
      this.isLoaderAdmin = true; 
      // this.passwordView = true;
      // this.pwdHiddenIcon = false;
    // var data = document.getElementById('app_user_detail');  
    // html2canvas(data).then(canvas => {  
    //   // Few necessary setting options  
    //   var imgWidth = 208;   
    //   var pageHeight = 295;    
    //   var imgHeight = canvas.height * imgWidth / canvas.width;  
    //   var heightLeft = imgHeight;  
  
    //   const contentDataURL = canvas.toDataURL('image/png')  
    //   let pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF  
    //   var position = 0;  
    //   pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)  
    //   pdf.save('MYPdf.pdf'); // Generated PDF   
    // });  
    let that = this;
    domtoimage.toPng(document.getElementById('app_user_detail'))
      .then(function (blob) {
        const printContent = document.getElementById("app_user_detail");
        const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
        WindowPrt.document.write('<img src='+blob+'>');         
        WindowPrt.focus();
        setTimeout(() => {
          WindowPrt.document.close();
          WindowPrt.print();  
          WindowPrt.close();
        }, 200);                                                  
      });
      this.isLoaderAdmin = false;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {
  }
 
}


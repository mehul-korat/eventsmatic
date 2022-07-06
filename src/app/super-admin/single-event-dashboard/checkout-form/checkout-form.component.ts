import { Component, OnInit, Inject } from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { FormControl,FormArray,FormGroup, FormBuilder, Validators, ValidatorFn} from '@angular/forms';
import { SingleEventServiceService } from '../_services/single-event-service.service';
import { ErrorService } from '../../../_services/error.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../_components/confirmation-dialog/confirmation-dialog.component';
import {HttpClient} from '@angular/common/http';
import { AngularEditorConfig } from '@kolkov/angular-editor';

export interface DialogData {
  animal: string;
  name: string;
}


@Component({
  selector: 'app-checkout-form',
  templateUrl: './checkout-form.component.html',
  styleUrls: ['./checkout-form.component.scss']
})
export class CheckoutFormComponent implements OnInit {
  animal :any;
  isLoaderAdmin:boolean = false;
  
  eventId:any;
  boxofficeId:any;
  buyerQuestionList :any = [];
  attendeeQuestionList :any = [];
  allQuestionlist:any
  buyerGlobelQuestionList :any = [];
  attendeeGlobelQuestionList :any = [];
  allGlobelQuestionlist:any
  checkoutFormType:any = 'global';
  saveDisabled:boolean=false;

  
  constructor(
    public dialog: MatDialog,
     private http: HttpClient,
     private SingleEventServiceService : SingleEventServiceService,
    private ErrorService : ErrorService,
  ) {
    if(localStorage.getItem('selectedEventCode')){
      this.eventId = localStorage.getItem('selectedEventCode');  
    }
    if(localStorage.getItem('boxoffice_id')){
      this.boxofficeId = localStorage.getItem('boxoffice_id');  
    }
    this.getAllQuestions();
    this.getGlobleQuestions();
    this.getCheckoutFormType();

   }

  ngOnInit(): void {
  }

  getCheckoutFormType(){
    this.isLoaderAdmin = true;
    let requestObject ={
      'boxoffice_id' : 'NULL',
      'event_id' :this.eventId,
      'option_key':'checkout_form_type',
    }   
    this.SingleEventServiceService.getSettings(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.checkoutFormType = JSON.parse(response.response)
      }else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
    });
    this.isLoaderAdmin = false;
  }

  fnCheckoutFormType(event){
    this.checkoutFormType=event.value
    this.isLoaderAdmin = true;
    let requestObject ={
      'boxoffice_id' : '',
      'event_id' :this.eventId,
      'option_key':'checkout_form_type',
      'option_value':this.checkoutFormType,
      'json_type' : 'Y',
    }   
    this.SingleEventServiceService.setSettingOption(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.ErrorService.successMessage(response.response);
      }else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
    });
    this.isLoaderAdmin = false;
  }

  dynamicSort(property) {
    var sortOrder = 1;
    if (property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
    }
    return function (a, b) {
      var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
      return result * sortOrder;
    }
  }

  buyerQuestionDrop(event: CdkDragDrop<string[]>) {
    if(event.previousIndex < 4){
      return false
    }else if(event.previousIndex > 3 && event.currentIndex < 4){
      return false
    }else{
      moveItemInArray(this.buyerQuestionList, event.previousIndex, event.currentIndex);
      let arrayIndex = 0
      this.buyerQuestionList.forEach(element => {
        element.index = arrayIndex+1
        arrayIndex++;
      });
      this.allQuestionlist[0].buyer_questions = this.buyerQuestionList
    }

  }
  attendeeQuestionDrop(event: CdkDragDrop<string[]>) {
    if(event.previousIndex < 1){
      return false
    }else if(event.previousIndex > 0 && event.currentIndex < 1){
      return false
    }else{
      moveItemInArray(this.attendeeQuestionList, event.previousIndex, event.currentIndex);
      let arrayIndex = 0
      this.attendeeQuestionList.forEach(element => {
        element.index = arrayIndex+1
        arrayIndex++;
      });
      this.allQuestionlist[0].buyer_questions = this.attendeeQuestionList
    }
  }

  getAllQuestions(){
    this.isLoaderAdmin = true;
    let requestObject ={
      'boxoffice_id' : 'NULL',
      'event_id' :this.eventId,
      'option_key':'checkout_form',
    }   
    this.SingleEventServiceService.getSettings(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.allQuestionlist = JSON.parse(response.response)
        console.log(this.allQuestionlist[0])
        this.buyerQuestionList = this.allQuestionlist[0].buyer_questions
        this.buyerQuestionList = this.buyerQuestionList.sort(this.dynamicSort("index"))
        this.attendeeQuestionList = this.allQuestionlist[0].attendee_questions
        this.attendeeQuestionList = this.attendeeQuestionList.sort(this.dynamicSort("index"))
      }else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
    });
      this.isLoaderAdmin = false;
  }

  getGlobleQuestions(){
    this.isLoaderAdmin = true;
    let requestObject ={
      'boxoffice_id' : this.boxofficeId,
      'event_id' :'NULL',
      'option_key':'checkout_form',
    }   
    this.SingleEventServiceService.getSettings(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.allGlobelQuestionlist = JSON.parse(response.response)
        console.log(this.allGlobelQuestionlist[0])
        this.buyerGlobelQuestionList = this.allGlobelQuestionlist[0].buyer_questions
        this.buyerGlobelQuestionList = this.buyerGlobelQuestionList.sort(this.dynamicSort("index"))
        this.attendeeGlobelQuestionList = this.allGlobelQuestionlist[0].attendee_questions
        this.attendeeGlobelQuestionList = this.attendeeGlobelQuestionList.sort(this.dynamicSort("index"))
      }else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
    });
      this.isLoaderAdmin = false;
  }
  
  fnDeleteBuyerQuestion(selectedQuestion, i){
  
    if(i==0 || i==1 || i==3){
      this.ErrorService.errorMessage("This question can't be delete.");
      return false;
    }

    if(i==2){
      this.allQuestionlist[0].buyer_questions[i].is_deleted = true;
      console.log(this.allQuestionlist[0].buyer_questions)
      return 
    }
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: "Are you sure want to delete question?"
    });
    dialogRef.afterClosed().subscribe(result => {
        if(result){
          const index: number = this.allQuestionlist[0].buyer_questions.indexOf(selectedQuestion);
          this.allQuestionlist[0].buyer_questions.splice(index, 1);
        }
    });
    
  }
  
    
  fnUndoBuyerQuestion(i, type){
    if(type){
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '400px',
        data: "Are you sure want to hide question?"
      });
      dialogRef.afterClosed().subscribe(result => {
          if(result){
            this.buyerQuestionList[i].hide = 'true';
          }
      });
    }else{
      this.buyerQuestionList[i].hide = 'false';
    }
    this.allQuestionlist[0].buyer_questions = this.buyerQuestionList
    console.log(this.allQuestionlist)

  }
  
  fnUndoAtteQuestion(i, type){
    if(type){
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '400px',
        data: "Are you sure want to hide question?"
      });
      dialogRef.afterClosed().subscribe(result => {
          if(result){
            this.attendeeQuestionList[i].hide = 'true';
          }
      });
    }else{
      this.attendeeQuestionList[i].hide = 'false';
    }
    this.allQuestionlist[0].attendee_questions = this.attendeeQuestionList
    console.log(this.allQuestionlist)

  }


  fnEditBuyerQuestion(question, index){
    console.log(question)
    const dialogRef = this.dialog.open(addBuyeronlyQuestionDialog,{
      width: '700px',
      data:{
        eventId: this.eventId,
        allQuestionlist: this.allQuestionlist,
        singleQuestion : question
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result != undefined){
        this.allQuestionlist = result
      }else{
        this.getAllQuestions();
      }
    });
  }

  fnDeleteAttendeeQuestion(selectedQuestion, i){
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: "Are you sure want to delete question?"
    });
    dialogRef.afterClosed().subscribe(result => {
        if(result){
          const index: number = this.allQuestionlist[0].attendee_questions.indexOf(selectedQuestion);
          this.allQuestionlist[0].attendee_questions.splice(index, 1);
        }
    });
  }

  fnEditAttendeeQuestion(question, index){
    console.log(question)
    const dialogRef = this.dialog.open(addAttendeeonlyQuestionDialog,{
      width: '700px',
      data:{
        eventId: this.eventId,
        allQuestionlist: this.allQuestionlist,
        singleQuestion : question
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result != undefined){
        this.allQuestionlist = result
      }else{
        this.getAllQuestions();
      }
    });
  }

  fnAddBuyerQuestion(){
    const dialogRef = this.dialog.open(addBuyeronlyQuestionDialog,{
      width: '700px',
      data:{
        eventId: this.eventId,
        allQuestionlist: this.allQuestionlist
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result != undefined){
        this.allQuestionlist = result
      }else{
        this.getAllQuestions();
      }
    });
  }

  fnAddAttendeeQuestion(){
    const dialogRef = this.dialog.open(addAttendeeonlyQuestionDialog,{
      width: '700px',
      data:{
        eventId: this.eventId,
        allQuestionlist: this.allQuestionlist
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result != undefined){
        this.allQuestionlist = result
      }else{
        this.getAllQuestions();
      }
    });
  }

  fnSaveCheckoutForm(){
    this.isLoaderAdmin = true;
    let requestObject ={
      'boxoffice_id' : '',
      'event_id' :this.eventId,
      'option_key':'checkout_form',
      'option_value':this.allQuestionlist,
      'json_type' : 'Y',
    }   
    this.SingleEventServiceService.setSettingOption(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.ErrorService.successMessage(response.response);
        this.getAllQuestions();
        this.saveDisabled = true;
        setTimeout(() => {
          this.saveDisabled = false
        }, 4000);

      }else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
    });
      this.isLoaderAdmin = false;
  }

  fnCancelSave(){
    this.getAllQuestions();
  }

  
}
@Component({
  selector: 'add-buyer-question',
  templateUrl: '../_dialogs/add-buyer-question.html',
})
export class addBuyeronlyQuestionDialog { 
  status = true;
  newBuyerQForm: FormGroup
  isLoaderAdmin:boolean = false;
  questionRequired:boolean = false;
  eventId:any;
  optionField:boolean = false;
  termsField:boolean = false;
  defaultQuestion:boolean = false;
  allQuestionlist:any = [];
  singleQuestion:any;
  is_address = false;
  addressForamteStyle = 'US';
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: "15rem",
    minHeight: "5rem",
    placeholder: "Enter text here...",
    translate: "no",
    defaultParagraphSeparator: "p",
    defaultFontName: "Arial",
    toolbarHiddenButtons: [],
    sanitize: false,
    customClasses: [
      {
        name: "quote",
        class: "quote"
      },
      {
        name: "redText",
        class: "redText"
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1"
      }
    ]
  };
  constructor(
    public dialogRef: MatDialogRef<addBuyeronlyQuestionDialog>,
    private http: HttpClient,
    private SingleEventServiceService : SingleEventServiceService,
    private ErrorService : ErrorService,
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.eventId = this.data.eventId
      this.allQuestionlist = this.data.allQuestionlist
      this.singleQuestion = this.data.singleQuestion
     
      if(this.singleQuestion && this.singleQuestion.index == 3){
        this.is_address = true;
        this.addressForamteStyle = this.singleQuestion.addressForamteStyle;
      }

      this.newBuyerQForm = this._formBuilder.group({
        type: ['',[Validators.required]],
        label: ['',[Validators.required]],
        options: [''],
        terms: [''],
      });
      
      if(this.singleQuestion){
        this.defaultQuestion = this.singleQuestion.default;
        this.newBuyerQForm.controls['label'].setValue(this.singleQuestion.label);
        this.newBuyerQForm.controls['type'].setValue(this.singleQuestion.type);
        this.newBuyerQForm.controls['options'].setValue(this.singleQuestion.options);
        this.newBuyerQForm.controls['terms'].setValue(this.singleQuestion.terms);
        this.questionRequired = this.singleQuestion.required
        if(this.singleQuestion.type == 'text' || this.singleQuestion.type == 'marketing'){
          this.optionField = false;
          this.termsField = false;
        }else if(this.singleQuestion.type == 'terms'){
          this.optionField = false;
          this.termsField = true;
        }else{
          this.optionField = true;
          this.termsField = false;
        }
      }
     
    }

  dynamicSort(property) {
    var sortOrder = 1;
    if (property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
    }
    return function (a, b) {
      var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
      return result * sortOrder;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

  fnChangeQType(event){
    console.log(event)
    if(event.value == 'text' || event.value == 'marketing'){
      this.optionField = false;
      this.termsField = false;
    }else if(event.value == 'terms'){
      this.optionField = false;
      this.termsField = true;
    }else{
      this.optionField = true;
      this.termsField = false;
    }
  }

  
  fnaddressForamteStyle(event){
    this.addressForamteStyle = event.value
  }


  fnChangeRequired(event){
    this.questionRequired = event.checked
  }

  createNewBuyerQuestion(){
  //  console.log(this.newBuyerQForm)
    if(this.newBuyerQForm.invalid){
      this.newBuyerQForm.get('label').markAsTouched();
      this.newBuyerQForm.get('type').markAsTouched();
      return false;
    }

    if(this.singleQuestion){
      let newQuestion = {
        'label' : this.newBuyerQForm.get('label').value,
        'required' : this.questionRequired,
        'type' : this.newBuyerQForm.get('type').value,
        'options' : this.newBuyerQForm.get('options').value,
        'terms' : this.newBuyerQForm.get('terms').value,
        'index' : this.singleQuestion.index,
      }
      
      if(this.singleQuestion && this.singleQuestion.default){
        newQuestion['default']  = true;
        newQuestion['controlName']  = this.singleQuestion.controlName;
      }
      
      if(this.singleQuestion && this.singleQuestion.hide){
        newQuestion['hide']  = this.singleQuestion.hide;
      }

      if(this.singleQuestion.index == 3){
        newQuestion['addressForamteStyle'] = this.addressForamteStyle;
      }

     

      const index: number = this.allQuestionlist[0].buyer_questions.indexOf(this.singleQuestion);
      this.allQuestionlist[0].buyer_questions.splice(index, 1);
      this.allQuestionlist[0].buyer_questions.push(newQuestion);
      this.allQuestionlist[0].buyer_questions = this.allQuestionlist[0].buyer_questions.sort(this.dynamicSort("index"));
     // console.log(this.allQuestionlist);
    }else{
      let newQuestion = {
        'label' : this.newBuyerQForm.get('label').value,
        'required' : this.questionRequired,
        'type' : this.newBuyerQForm.get('type').value,
        'options' : this.newBuyerQForm.get('options').value,
        'terms' : this.newBuyerQForm.get('terms').value,
        'index' : this.allQuestionlist[0].buyer_questions.length+1,
      }
      this.allQuestionlist[0].buyer_questions.push(newQuestion);
      this.allQuestionlist[0].buyer_questions = this.allQuestionlist[0].buyer_questions.sort(this.dynamicSort("index"))
    }
   
    console.log(this.allQuestionlist)
    this.dialogRef.close(this.allQuestionlist);
  }
  
}
@Component({
  selector: 'add-buyer-question',
  templateUrl: '../_dialogs/add-attendee-question.html',
})
export class addAttendeeonlyQuestionDialog { 
  optionValue:any;
  status = true;
  newAttendeeQForm: FormGroup
  isLoaderAdmin:boolean = false;
  questionRequired:boolean = false;
  boxofficeId:any;
  optionField:boolean = false;
  termsField:boolean = false;
  defaultQuestion:boolean = false;
  allQuestionlist:any = [];
  singleQuestion:any;
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: "15rem",
    minHeight: "5rem",
    placeholder: "Enter text here...",
    translate: "no",
    defaultParagraphSeparator: "p",
    defaultFontName: "Arial",
    toolbarHiddenButtons: [],
    sanitize: false,
    customClasses: [
      {
        name: "quote",
        class: "quote"
      },
      {
        name: "redText",
        class: "redText"
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1"
      }
    ]
  };
  constructor(
    public dialogRef: MatDialogRef<addAttendeeonlyQuestionDialog>,
    private http: HttpClient,
    private SingleEventServiceService : SingleEventServiceService,
    private ErrorService : ErrorService,
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.boxofficeId = this.data.boxofficeId
      this.allQuestionlist = this.data.allQuestionlist
      this.singleQuestion = this.data.singleQuestion
      this.newAttendeeQForm = this._formBuilder.group({
        type: ['',[Validators.required]],
        label: ['',[Validators.required]],
        options: [''],
        terms: [''],
      });

      
      if(this.singleQuestion){
        this.defaultQuestion = this.singleQuestion.default
        this.newAttendeeQForm.controls['label'].setValue(this.singleQuestion.label);
        this.newAttendeeQForm.controls['type'].setValue(this.singleQuestion.type);
        this.newAttendeeQForm.controls['options'].setValue(this.singleQuestion.options);
        this.newAttendeeQForm.controls['terms'].setValue(this.singleQuestion.terms);
        this.questionRequired = this.singleQuestion.required
        if(this.singleQuestion.type == 'text' || this.singleQuestion.type == 'marketing'){
          this.optionField = false;
          this.termsField = false;
        }else if(this.singleQuestion.type == 'terms'){
          this.optionField = false;
          this.termsField = true;
        }else{
          this.optionField = true;
          this.termsField = false;
        }
      }

    }
  
  dynamicSort(property) {
    var sortOrder = 1;
    if (property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
    }
    return function (a, b) {
      var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
      return result * sortOrder;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {
  }

  fnChangeQType(event){
    console.log(event)
    if(event.value == 'text' || event.value == 'marketing'){
      this.optionField = false;
      this.termsField = false;
    }else if(event.value == 'terms'){
      this.optionField = false;
      this.termsField = true;
    }else{
      this.optionField = true;
      this.termsField = false;
    }
  }
  
  fnChangeRequired(event){
    this.questionRequired = event.checked
  }

  createNewAttendeeQuestion(){
    console.log(this.newAttendeeQForm)
    if(this.newAttendeeQForm.invalid){
      this.newAttendeeQForm.get('label').markAsTouched();
      this.newAttendeeQForm.get('type').markAsTouched();
      return false;
    }
    if(this.singleQuestion){
      let newQuestion = {
        'label' : this.newAttendeeQForm.get('label').value,
        'required' : this.questionRequired,
        'type' : this.newAttendeeQForm.get('type').value,
        'options' : this.newAttendeeQForm.get('options').value,
        'terms' : this.newAttendeeQForm.get('terms').value,
        'index' : this.singleQuestion.index,
      }

      if(this.singleQuestion && this.singleQuestion.hide){
        newQuestion['hide']  = this.singleQuestion.hide;
      }
      if(this.singleQuestion && this.singleQuestion.default){
        newQuestion['default']  = true;
        newQuestion['controlName']  = this.singleQuestion.controlName;
      }
      const index: number = this.allQuestionlist[0].attendee_questions.indexOf(this.singleQuestion);
      this.allQuestionlist[0].attendee_questions.splice(index, 1);
      this.allQuestionlist[0].attendee_questions.push(newQuestion);
      this.allQuestionlist[0].attendee_questions = this.allQuestionlist[0].attendee_questions.sort(this.dynamicSort("index"))
    }else{
      let newQuestion = {
        'label' : this.newAttendeeQForm.get('label').value,
        'required' : this.questionRequired,
        'type' : this.newAttendeeQForm.get('type').value,
        'options' : this.newAttendeeQForm.get('options').value,
        'terms' : this.newAttendeeQForm.get('terms').value,
        'index' : this.allQuestionlist[0].attendee_questions.length+1,
      }
      this.allQuestionlist[0].attendee_questions.push(newQuestion);
      this.allQuestionlist[0].attendee_questions = this.allQuestionlist[0].attendee_questions.sort(this.dynamicSort("index"))
    }
    
    console.log(this.allQuestionlist)
    this.dialogRef.close(this.allQuestionlist);
  }
}

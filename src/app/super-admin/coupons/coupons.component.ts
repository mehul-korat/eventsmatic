import { Component, OnInit ,Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { MatSnackBar} from '@angular/material/snack-bar';
import { DatePipe} from '@angular/common';
 import { ErrorService } from '../../_services/error.service'
 import { SuperadminService} from '../_services/superadmin.service';
 import { ConfirmationDialogComponent } from '../../_components/confirmation-dialog/confirmation-dialog.component';
 import { Router, ActivatedRoute } from '@angular/router';
export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.component.html',
  styleUrls: ['./coupons.component.scss'],
  providers: [DatePipe]
})
export class CouponsComponent implements OnInit {
  isLoaderAdmin:boolean = false;
  animal :any;
  clickedIndex: any = 'coupon'
  boxOfficeCode: any;
  allCouponCodeList: any = [];
  allVoucherCodeList:any = [];
  couponCodeStatus: any;
  signleCouponDetail: any;
  signleVoucherDetail :  any;
  search = {
    keyword: ""
  };
  constructor(
   public dialog: MatDialog,
    private http: HttpClient,
    private _formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private datePipe: DatePipe,
    private router: Router,
    private errorService: ErrorService,
    private SuperadminService : SuperadminService,
 ) {
    if(localStorage.getItem('boxoffice_id')){
      this.boxOfficeCode = localStorage.getItem('boxoffice_id');
    }else{
      this.errorService.errorMessage('Select Box-office first.');
      this.router.navigate(["/super-admin/boxoffice"]);
    }
    let newCouponrAction = window.location.search.split("?coupon")
    if(newCouponrAction.length > 1){
        this.creatDiscountCode();
    }
    let newVoucherAction = window.location.search.split("?voucher")
    if(newVoucherAction.length > 1){
        this.creatVoucherCode();
    }
  }


 ngOnInit(): void {
   this.getAllCouponCodes();
   this.getAllVoucherCodes();
 }
 
  onTabChanged(event){
    let clickedIndex = event.index;
    if(clickedIndex == 0){
      this.clickedIndex = 'coupon'
    }else if(clickedIndex == 1){
      this.clickedIndex = 'voucher'
    }
    this.search.keyword = '';
    this.getAllVoucherCodes()
    this.getAllCouponCodes()
  }

 couponSearch(){
   if(this.clickedIndex == 'coupon'){
      this.getAllCouponCodes()
   }else if(this.clickedIndex == 'voucher'){
      this.getAllVoucherCodes()
   }
 }

  getAllCouponCodes(){
    this.isLoaderAdmin = true;
    let requestObject = {
      'search':this.search.keyword,
      'boxoffice_id' : this.boxOfficeCode
    }
    this.SuperadminService.getAllCouponCodes(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.allCouponCodeList = response.response
      }
      else if(response.data == false){
        // this.errorService.errorMessage(response.response);
        this.allCouponCodeList.length = 0
      // this.allCouponCodeList = null;
      }
    })
    this.isLoaderAdmin = false;
  }

  getAllVoucherCodes(){
    this.isLoaderAdmin = true;
    let requestObject = {
      'search':this.search.keyword,
      'boxoffice_id' : this.boxOfficeCode
    }
    this.SuperadminService.getAllVoucherCodes(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.allVoucherCodeList = response.response
      }
      else if(response.data == false){
      // this.errorService.errorMessage(response.response);
      this.allVoucherCodeList.length = 0
      // this. allVoucherCodeList = null;
      }
    })
    this.isLoaderAdmin = false;
  }

  changeCouponStaus(event,couponcode_code){
    this.isLoaderAdmin = true;
    if(event.checked == true){
      this.couponCodeStatus = 'A';
    }
    else if(event.checked == false){
      this.couponCodeStatus = 'IA';
    }
    let requestObject = {
      'unique_code': couponcode_code,
      'status' : this.couponCodeStatus
    }
    this.SuperadminService.changeCouponStaus(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.errorService.successMessage(response.response);
         this.getAllCouponCodes();
      }
      else if(response.data == false){
      this.errorService.errorMessage(response.response);
      }
    })
    this.isLoaderAdmin = false;
  }
  fnDeleteCoupon(couponcode_code){
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: "Are you sure you want to delete?"
    });
     dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.isLoaderAdmin = true;
        let requestObject = {
          'unique_code': couponcode_code
        }
        this.SuperadminService.fnDeleteCoupon(requestObject).subscribe((response:any) => {
          if(response.data == true){
            this.errorService.successMessage(response.response);
            this.getAllCouponCodes();
          }
          else if(response.data == false){
          this.errorService.errorMessage(response.response);
          }
        })
        this.isLoaderAdmin = false;
      }
    });
  }

  fnDeleteVoucher(vouchercode_code){
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: "Are you sure you want to delete?"
    });
     dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.isLoaderAdmin = true;
        let requestObject = {
          'unique_code': vouchercode_code
        }
        this.SuperadminService.fnDeleteVoucher(requestObject).subscribe((response:any) => {
          if(response.data == true){
            this.errorService.successMessage(response.response);
            this. getAllVoucherCodes();
          }
          else if(response.data == false){
          this.errorService.errorMessage(response.response);
          }
        })
        this.isLoaderAdmin = false;
      }
    });
  }
  
  fnEditCoupon(couponcode_code){
    this.isLoaderAdmin = true;
    let requestObject = {
      'unique_code': couponcode_code
    }
    this.SuperadminService.fnGetSignleCouponDetail(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.signleCouponDetail = response.response[0];
        this.creatDiscountCode();
      }
      else if(response.data == false){
      this.errorService.errorMessage(response.response);
      }
    })
    this.isLoaderAdmin = false;

  }

  fnEditVoucher(vouchercode_code){
    this.isLoaderAdmin = true;
    let requestObject = {
      'unique_code': vouchercode_code
    }
    this.SuperadminService.fnGetSignleVoucherDetail(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.signleVoucherDetail = response.response[0];
        const dialogRef = this.dialog.open(myBatchVoucherCodeDialog, {
          width: '550px',
          data :{boxOfficeCode : this.boxOfficeCode,
          signleVoucherDetail : this.signleVoucherDetail
        }
        });
      
         dialogRef.afterClosed().subscribe(result => {
          this.animal = result;
          this.signleVoucherDetail = null
          this.getAllVoucherCodes();
         });
      }
      else if(response.data == false){
      this.errorService.errorMessage(response.response);
      }
    })
    this.isLoaderAdmin = false;

  }

  

 creatDiscountCode() {
   this.isLoaderAdmin = true;
   const dialogRef = this.dialog.open(myCreateDiscountCodeDialog, {
     width: '1100px',
     data :{
       boxOfficeCode : this.boxOfficeCode,
       signleCouponDetail : this.signleCouponDetail
      }
   });

    dialogRef.afterClosed().subscribe(result => {
     this.animal = result;
     this.signleCouponDetail = null;
     this.getAllCouponCodes();
    });
    this.isLoaderAdmin = false;
 }

 creatVoucherCode() {
  this.isLoaderAdmin = true;
  const dialogRef = this.dialog.open(myBatchVoucherCodeDialog, {
    width: '550px',
    data :{boxOfficeCode : this.boxOfficeCode,
  }
  });

   dialogRef.afterClosed().subscribe(result => {
    this.animal = result;
    this.signleVoucherDetail = null
    this.getAllVoucherCodes();
   });
   this.isLoaderAdmin = false;
}

assignToEvent(index, voucherCode) {
  this.isLoaderAdmin = true;
  const dialogRef = this.dialog.open(AssignToEventDialog, {
    width: '550px',
    data :{
      boxOfficeCode : this.boxOfficeCode,
      assignedEvent : this.allVoucherCodeList[index].Events,
      selectedVoucher : voucherCode
    }
  });

   dialogRef.afterClosed().subscribe(result => {
    this.animal = result;
    this.getAllVoucherCodes();
   });
   this.isLoaderAdmin = false;
}

assignToTicketType(index, selectedCoupon) {
  this.isLoaderAdmin = true;
  const dialogRef = this.dialog.open(AssignToTicketTypeDialog, {
    width: '550px',
    data :{
      boxOfficeCode : this.boxOfficeCode,
      assignedTicket : this.allCouponCodeList[index].Tickets,
      selectedCoupon : selectedCoupon,
    }
  });

   dialogRef.afterClosed().subscribe(result => {
    this.animal = result;
    this.getAllCouponCodes();
   });
   this.isLoaderAdmin = false;
}

}

@Component({
  selector: 'Create-Discount-Code',
  templateUrl: '../_dialogs/create-discount-code-dialog.html',
  providers: [DatePipe]
})
export class myCreateDiscountCodeDialog { 
  isLoaderAdmin:boolean = false;
  onlynumeric = /^-?(0|[1-9]\d*)?$/
  createCouponForm: FormGroup;
  minDate:any = new Date();
  minTillDate : any = new Date();
  diccount_error:boolean=false;
  boxOfficeCode:any;
  signleCouponDetail:any;
  constructor(
    public dialogRef: MatDialogRef<myCreateDiscountCodeDialog>,
    private http: HttpClient,
    private _formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private datePipe: DatePipe,
    private SuperadminService : SuperadminService,
    private errorService: ErrorService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.boxOfficeCode = this.data.boxOfficeCode
      this.signleCouponDetail = this.data.signleCouponDetail;

      this.createCouponForm = this._formBuilder.group({
        title : ['', [Validators.required,Validators.maxLength(15)]],
        max_redemption : ['', [Validators.required,Validators.pattern(this.onlynumeric)]],
        code : ['', [Validators.required,Validators.maxLength(15)]],
        valid_from : ['', Validators.required],
        type : ['', Validators.required],
        valid_till : ['', Validators.required],
        discount : ['', [Validators.required,Validators.pattern(this.onlynumeric)]],
      });

      if(this.signleCouponDetail){
        
        this.minDate = Date();
        this.minTillDate=Date();
        this.createCouponForm.controls['title'].setValue(this.signleCouponDetail.coupon_title)
        this.createCouponForm.controls['max_redemption'].setValue(this.signleCouponDetail.max_redemption)
        this.createCouponForm.controls['code'].setValue(this.signleCouponDetail.coupon_code)
        this.createCouponForm.controls['valid_from'].setValue(this.signleCouponDetail.valid_from)
        this.createCouponForm.controls['type'].setValue(this.signleCouponDetail.discount_type)
        this.createCouponForm.controls['valid_till'].setValue(this.signleCouponDetail.valid_till)
        this.createCouponForm.controls['discount'].setValue(this.signleCouponDetail.discount)
      }
    }

  onNoClick(): void {
    this.signleCouponDetail=null;
    this.dialogRef.close();
    
  }
  ngOnInit() {
   

  }

  fnChangeDiscountType(discountType){
    var discount_value = this.createCouponForm.get('discount').value; 
    if(discountType=='P' && discount_value > 100){
      this.diccount_error = true;
    }else{
      this.diccount_error = false;
    }
  }

  discount_check(){

    var discount_type = this.createCouponForm.get('type').value;
    var discount_value = this.createCouponForm.get('discount').value; 

    if(discount_type=='P' && discount_value > 100){
      this.diccount_error = true;
    }else{
      this.diccount_error = false;
    }
  }

  fnChangeValideFrom(){
    this.minTillDate =this.createCouponForm.get('valid_from').value;
    this.createCouponForm.get('valid_till').setValue('');
  }

  fnSubmitCreateCoupon(){
    console.log(this.createCouponForm);
    if(this.createCouponForm.valid){
      let valid_from = this.createCouponForm.get('valid_from').value;
      let valid_till = this.createCouponForm.get('valid_till').value;

      if(valid_from > valid_till){
        this._snackBar.open("Please select valid till date.", "X", {
          duration: 2000,
          verticalPosition:'top',
          panelClass :['red-snackbar']
        });
        return;
      }
      
      
      valid_from=this.datePipe.transform(new Date(valid_from),"yyyy-MM-dd")
      valid_till=this.datePipe.transform(new Date(valid_till),"yyyy-MM-dd")

      var discount_type = this.createCouponForm.get('type').value;
      var discount_value = this.createCouponForm.get('discount').value; 
      if(discount_type=='P' && discount_value > 100){
        this.diccount_error = true;
        return;
      }else{
        this.diccount_error = false;
      }
      if(this.signleCouponDetail){
        let updateCouponCodeData = {
          'unique_code': this.signleCouponDetail.unique_code,
          "boxoffice_id" : this.boxOfficeCode,
          "coupon_title" : this.createCouponForm.get('title').value,
          "coupon_code" : this.createCouponForm.get('code').value,
          "max_redemption" : this.createCouponForm.get('max_redemption').value,
          "valid_from" : valid_from,
          "valid_till" : valid_till,
          "discount_type" : this.createCouponForm.get('type').value,
          "discount" : this.createCouponForm.get('discount').value,
        }
          this.updateCouponCode(updateCouponCodeData);
          
      }else{
        let createdCouponCodeData = {
          "boxoffice_id" : this.boxOfficeCode,
          "coupon_title" : this.createCouponForm.get('title').value,
          "coupon_code" : this.createCouponForm.get('code').value,
          "max_redemption" : this.createCouponForm.get('max_redemption').value,
          "valid_from" : valid_from,
          "valid_till" : valid_till,
          "discount_type" : this.createCouponForm.get('type').value,
          "discount" : this.createCouponForm.get('discount').value,
        }
          this.createNewCouponCode(createdCouponCodeData);
      }
     
    }else{
      this.createCouponForm.get("title").markAsTouched();
      this.createCouponForm.get("code").markAsTouched();
      this.createCouponForm.get("max_redemption").markAsTouched();
      this.createCouponForm.get("type").markAsTouched();
      this.createCouponForm.get('valid_from').markAsTouched()
      this.createCouponForm.get('valid_till').markAsTouched()
      this.createCouponForm.get("discount").markAsTouched();
    }
  }
  createNewCouponCode(createdCouponCodeData){
    this.isLoaderAdmin = true;
    this.SuperadminService.createNewCouponCode(createdCouponCodeData).subscribe((response:any) => {
      if(response.data == true){
       this.errorService.successMessage(response.response);
        this.createCouponForm.reset();
        this.signleCouponDetail=null;
        this.dialogRef.close();
      }
      else if(response.data == false){
       this.errorService.errorMessage(response.response);
      }
      this.isLoaderAdmin = false;
    })
  }
  updateCouponCode(updateCouponCode){
    this.isLoaderAdmin = true;
    this.SuperadminService.updateCouponCode(updateCouponCode).subscribe((response:any) => {
      if(response.data == true){
       this.errorService.successMessage(response.response);
        this.createCouponForm.reset();
        this.signleCouponDetail=null;
        this.dialogRef.close();
      }
      else if(response.data == false){
       this.errorService.errorMessage(response.response);
      }
      this.isLoaderAdmin = false;
    })
  }
  fnCancelCreateCoupon(){
    this.createCouponForm.reset();
    this.signleCouponDetail=null;
    this.dialogRef.close();
  }
  
}

@Component({
  selector: 'Create-Voucher-Code',
  templateUrl: '../_dialogs/create-voucher-code-dialog.html',
  providers: [DatePipe]
})
export class myBatchVoucherCodeDialog { 
  isLoaderAdmin:boolean = false;
  boxOfficeCode:any;
  eventId:any;
  signleVoucherDetail:any;
  createVoucherForm: FormGroup;
  getAllEventList:any;
  minExpiryDate :any = new Date();
  assignedEvent=[];
  constructor(
    private _formBuilder: FormBuilder,
    // private _snackBar: MatSnackBar,
    private datePipe: DatePipe,
    private SuperadminService : SuperadminService,
    private errorService: ErrorService,
    public dialogRef: MatDialogRef<myBatchVoucherCodeDialog>,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.boxOfficeCode = this.data.boxOfficeCode
      if(this.data.signleVoucherDetail){
        this.signleVoucherDetail = this.data.signleVoucherDetail
        this.minExpiryDate = Date();
        // if(this.signleVoucherDetail.expiry_date < this.minExpiryDate){
        //   this.signleVoucherDetail.expiry_date = this.minExpiryDate
        // }
      }
      if(this.signleVoucherDetail && this.signleVoucherDetail.event_id !== null){
        this.assignedEvent = this.signleVoucherDetail.event_id.split(',')
      }
      this.getAllEvent();
      this.createVoucherForm = this._formBuilder.group({
        voucher_name:['',[Validators.required,Validators.maxLength(15)]],
        voucher_value:['',[Validators.required,Validators.maxLength(15)]],
        voucher_code:['',[Validators.required,Validators.maxLength(15)]],
        expiry_date:['' ,[Validators.required]],
      })

      if(this.signleVoucherDetail){
        this.createVoucherForm.controls['voucher_name'].setValue(this.signleVoucherDetail.voucher_name)
        this.createVoucherForm.controls['voucher_value'].setValue(this.signleVoucherDetail.voucher_value)
        this.createVoucherForm.controls['voucher_code'].setValue(this.signleVoucherDetail.voucher_code)
        this.createVoucherForm.controls['expiry_date'].setValue(this.signleVoucherDetail.expiry_date)
      }

    }
    getAllEvent(){
      this.isLoaderAdmin = true;
      let requestObject = {
        'filter' : 'upcoming',
        'boxoffice_id' : this.boxOfficeCode
      }
      this.SuperadminService.fnAllEventList(requestObject).subscribe((response:any) => {
        if(response.data == true){
        this.getAllEventList = response.response
        }
        else if(response.data == false){
        this.errorService.errorMessage(response.response);
        this.getAllEventList = null;
        }
      })
        this.isLoaderAdmin = false;
    }
    
  fnAssignEvent(event, eventCode){
    if(event.checked == true){
      this.assignedEvent.push(eventCode)
    }else{
      const index = this.assignedEvent.indexOf(eventCode, 0);
      if (index > -1) {
          this.assignedEvent.splice(index, 1);
      }
    }
  }

    fnOnSubmitVoucher(){
      console.log(this.createVoucherForm)
      if(this.createVoucherForm.valid){
        if(this.signleVoucherDetail){

         let  expiry_date=this.datePipe.transform(new Date(this.createVoucherForm.get('expiry_date').value),"yyyy-MM-dd")
          let updateVoucherCode = {
            'unique_code': this.signleVoucherDetail.unique_code,
            "boxoffice_id" : this.boxOfficeCode,
            "voucher_name" : this.createVoucherForm.get('voucher_name').value,
            "voucher_value" : this.createVoucherForm.get('voucher_value').value,
            "voucher_code" : this.createVoucherForm.get('voucher_code').value,
            "expiry_date" : expiry_date,
          }
            this.updateVoucherCode(updateVoucherCode);
            
        }else{
          let  expiry_date=this.datePipe.transform(new Date(this.createVoucherForm.get('expiry_date').value),"yyyy-MM-dd")
          let createdVoucherCodeData = {
          "boxoffice_id" : this.boxOfficeCode,
          "voucher_name" : this.createVoucherForm.get('voucher_name').value,
          "voucher_value" : this.createVoucherForm.get('voucher_value').value,
          "voucher_code" : this.createVoucherForm.get('voucher_code').value,
          "expiry_date" : expiry_date,
          // "event_id" : this.eventId, 
        }
        this.createVoucherCode(createdVoucherCodeData);
      }
  
      }else{
        this.createVoucherForm.get("voucher_name").markAsTouched();
        this.createVoucherForm.get("voucher_value").markAsTouched();
        this.createVoucherForm.get("voucher_code").markAsTouched();
        this.createVoucherForm.get("expiry_date").markAsTouched();
      }
    
    }
    createVoucherCode(createdVoucherCodeData){
      this.isLoaderAdmin = true;
      this.SuperadminService.createVoucherCode(createdVoucherCodeData).subscribe((response:any) => {
        if(response.data == true){
         this.errorService.successMessage(response.response);
          this.createVoucherForm.reset();
          this.assignedEvent = null;
          this.signleVoucherDetail = null;
          this.dialogRef.close();
        }
        else if(response.data == false){
         this.errorService.errorMessage(response.response);
        }
        this.createVoucherForm.reset();
        this.isLoaderAdmin = false;
      })
    }

    updateVoucherCode(updateVoucherCode){
      this.isLoaderAdmin = true;
      this.SuperadminService.updateVoucherCode(updateVoucherCode).subscribe((response:any) => {
        if(response.data == true){
         this.errorService.successMessage(response.response);
          this.createVoucherForm.reset();
          this.assignedEvent = null;
          this.signleVoucherDetail = null;
          this.dialogRef.close();
        }
        else if(response.data == false){
         this.errorService.errorMessage(response.response);
        }
        this.isLoaderAdmin = false;
      })
    }

  onNoClick(): void {
   
    this.createVoucherForm.reset();
    this.signleVoucherDetail = null;
    this.assignedEvent = null;
    this.dialogRef.close();
  }
  ngOnInit() { 
  }
  
}


// ------------------------------------ Assign to Event -------------------------------------------

@Component({
  selector: 'Assign-To-Event-Dialog',
  templateUrl: '../_dialogs/assign-to-event-dialog.html',
})
export class AssignToEventDialog { 
  isLoaderAdmin:any;
  boxOfficeCode:any;
  getAllEventList:any;
  assignedEvent:any = [];
  selectedVoucher:any;
  constructor(
    public dialogRef: MatDialogRef<AssignToEventDialog>,
    private SuperadminService : SuperadminService,
    private errorService:ErrorService,
     @Inject(MAT_DIALOG_DATA) public data: any
  ){
    if(this.data.assignedEvent.length !== 0){
      this.assignedEvent= this.data.assignedEvent
    }
    this.selectedVoucher= this.data.selectedVoucher
    if(localStorage.getItem('boxoffice_id')){
      this.boxOfficeCode = localStorage.getItem('boxoffice_id');
    }
  } 

  getAllEvent(){
    this.isLoaderAdmin = true;
    let requestObject = {
      'events_id' : 'all',
      'boxoffice_id' : this.boxOfficeCode
    }
    this.SuperadminService.fnAllEventList(requestObject).subscribe((response:any) => {
      if(response.data == true){
      this. getAllEventList = response.response
      }
      else if(response.data == false){
      this.errorService.errorMessage(response.response);
      this. getAllEventList = null;
      }
    })
      this.isLoaderAdmin = false;
  }

  fnAssignEventToVoucher(){
    this.isLoaderAdmin = true;
    let requestObject = {
      'voucher_id': this.selectedVoucher,
      'event_id' : this.assignedEvent
    }
    this.SuperadminService.fnAssignEventToVoucher(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.errorService.successMessage(response.response); 
        this.assignedEvent= null;
        this.selectedVoucher=null;
        this.dialogRef.close();
      }
      else if(response.data == false){
      this.errorService.errorMessage(response.response); 
      }
    })
      this.isLoaderAdmin = false;
  }


  fnAssignEvent(event, eventCode){
    if(event.checked == true){
      this.assignedEvent.push(eventCode)
    }else{
      const index = this.assignedEvent.indexOf(eventCode, 0);
      if (index > -1) {
          this.assignedEvent.splice(index, 1);
      }
    }
  }

  onNoClick(): void {
    this.assignedEvent= null;
    this.selectedVoucher=null;
    this.dialogRef.close();
  }
  ngOnInit() { 
    this.getAllEvent();
  }
  
}


// ------------------------------------ Assign to Ticket Type --------------------------------------


@Component({
  selector: 'Assign-To-Ticket-type-Dialog',
  templateUrl: '../_dialogs/assign-to-ticket-type-dialog.html',
})
export class AssignToTicketTypeDialog { 
  isLoaderAdmin:boolean = false;
  boxOfficeCode:any;
  allticketType:any;
  assignedTicket:any = [];
  selectedCoupon:any;
   constructor(
    public dialogRef: MatDialogRef<AssignToTicketTypeDialog>,
    private SuperadminService:SuperadminService,
    private errorService:ErrorService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){
    if(this.data.assignedTicket.length !== 0){
      this.assignedTicket = this.data.assignedTicket
    }
    this.selectedCoupon = this.data.selectedCoupon
    if(localStorage.getItem('boxoffice_id')){
      this.boxOfficeCode = localStorage.getItem('boxoffice_id');
    }
  } 

  getAllTicket(){
    this.isLoaderAdmin = true;
    let requestObject = {
      'boxoffice_id' : this.boxOfficeCode
    }
    this.SuperadminService.getAllTicket(requestObject).subscribe((response:any) => {
      if(response.data == true){
      this. allticketType = response.response
      }
      else if(response.data == false){
      this.errorService.errorMessage(response.response); 
      this. allticketType = null;
      }
    })
      this.isLoaderAdmin = false;
  }

  fnAssignTicketToCoupon(){
    this.isLoaderAdmin = true;
    let requestObject = {
      'coupon_id': this.selectedCoupon,
      'ticket_ids' : this.assignedTicket
    }
    this.SuperadminService.fnAssignTicketToCoupon(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.errorService.successMessage(response.response); 
        this.assignedTicket=null;
        this.selectedCoupon=null;
        this.dialogRef.close();
      }
      else if(response.data == false){
      this.errorService.errorMessage(response.response); 
      }
    })
      this.isLoaderAdmin = false;
  }

 
  fnAssignTicket(event, TicketCode){
    if(event.checked == true){
      this.assignedTicket.push(TicketCode)
    }else{
      const index = this.assignedTicket.indexOf(TicketCode, 0);
      if (index > -1) {
          this.assignedTicket.splice(index, 1);
      }
    }
  }

  onNoClick(): void {
    this.assignedTicket=null;
    this.selectedCoupon=null;
    this.dialogRef.close();
  }
  ngOnInit() { 
    this.getAllTicket();
  }
  
}
import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators, FormArray, CheckboxControlValueAccessor } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { SettingService } from '../_services/setting.service';
import { DatePipe } from '@angular/common';
import { ErrorService } from '../../../_services/error.service';
import { environment } from '../../../../environments/environment'
import { ConfirmationDialogComponent } from '../../../_components/confirmation-dialog/confirmation-dialog.component';

export interface DialogData {
  animal: string;
  name: string;
}


@Component({
  selector: 'app-team-access',
  templateUrl: './team-access.component.html',
  styleUrls: ['./team-access.component.scss'],
  providers: [DatePipe]
})
export class TeamAccessComponent implements OnInit {
  animal: any;
  allBusiness: any;
  isLoaderAdmin: any;
  approvedInviterData: any = [];
  pendingInviterData: any = [];
  boxofficeId: any;



  constructor(
    public dialog: MatDialog,
    private http: HttpClient,
    private SettingService: SettingService,
    private ErrorService: ErrorService,
    private datePipe: DatePipe,
    private change: ChangeDetectorRef
  ) {
    if (localStorage.getItem('boxoffice_id')) {
      this.boxofficeId = localStorage.getItem('boxoffice_id');
    }

  }

  getAPRInviter() {
    this.isLoaderAdmin = true;
    let requestObject = {
      'boxoffice_id': this.boxofficeId,
      'status': 'APR'
    }
    this.SettingService.getAllInviter(requestObject).subscribe((response: any) => {
      if (response.data == true) {
        this.approvedInviterData = response.response
        this.approvedInviterData.forEach(element => {
          element.updated_at = this.datePipe.transform(element.updated_at, "MMM d, y, h:mm a")
        });
        console.log(this.approvedInviterData)
      }
      else if (response.data == false) {
        this.ErrorService.errorMessage(response.response);
        this.approvedInviterData.length = 0
        // this. allVoucherCodeList = null;
      }
      this.isLoaderAdmin = false;
    })
  }

  getPENDInviter() {
    this.isLoaderAdmin = true;
    let requestObject = {
      'boxoffice_id': this.boxofficeId,
      'status': 'P'
    }
    this.SettingService.getAllInviter(requestObject).subscribe((response: any) => {
      if (response.data == true) {
        this.pendingInviterData = response.response
        this.pendingInviterData.forEach(element => {
          element.updated_at = this.datePipe.transform(element.updated_at, "MMM d, y, h:mm a")
          element.sub_permission = element.sub_permission.split(",");
        });
        console.log(this.pendingInviterData)
      }
      else if (response.data == false) {
        this.ErrorService.errorMessage(response.response);
        this.pendingInviterData.length = 0
        // this. allVoucherCodeList = null;
      }
      this.isLoaderAdmin = false;
    })
  }

  ngOnInit(): void {
    this.getAPRInviter();
    this.getPENDInviter();
  }

  inviteTeammate() {
    const dialogRef = this.dialog.open(inviteTeamMateDialog, {
      width: '550px',
      data :{inviterData : null}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.animal = result;
      this.getAPRInviter();
      this.getPENDInviter();
    });
  }

  fnEditRole(index) {
    const dialogRef = this.dialog.open(inviteTeamMateDialog, {
      width: '550px',
      data :{inviterData : this.approvedInviterData[index]}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.animal = result;
      this.getAPRInviter();
      this.getPENDInviter();
    });
  }

  permissionCheck(access){
    if(access=='A'){
      return "Admin";
    }
    var permistion =   access.split(",");
    var permistionString = [];
    
    if(permistion.indexOf("EM") > -1 ){
      permistionString.push('Event Manager');
    }

    if(permistion.indexOf("OM")  >  -1 ){
      permistionString.push('Order Manager');
    }
    
    if(permistion.indexOf("OV")  >  -1 ){
      permistionString.push('OverView');
    } 

    return permistionString.toString();
  }

  subPermissionCheck(access){
    if(access=='A'){
      return false;
    }
    var subPermistion =  '';
    
    if(access == 'AUEC' ){
      subPermistion = 'Order manager with edit';
    }
    
    if(access=="AUER"){
      subPermistion='Order manager with export';
    }
    
    if(access=="AACD"){
      subPermistion='Event manager with customer data';
    }

    return subPermistion.toString();
  }

  fnResendInviter(inviterCode){
    this.isLoaderAdmin = true;
    let requestObject = {
      'invitation_id': inviterCode,
    }
    this.SettingService.resendInviter(requestObject).subscribe((response: any) => {
      if (response.data == true) {
        this.ErrorService.successMessage(response.response);
      }
      else if (response.data == false) {
        this.ErrorService.errorMessage(response.response);
      }
    })
    this.isLoaderAdmin = false;
  }

  fnDeleteInviter(inviterCode){
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: "Are you sure you want to delete?"
    });
     dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.isLoaderAdmin = true;
        let requestObject = {
          'unique_code': inviterCode,
        }
        this.SettingService.deleteInviter(requestObject).subscribe((response: any) => {
          if (response.data == true) {
            this.ErrorService.successMessage(response.response);
            this.getPENDInviter();
          }
          else if (response.data == false) {
            this.ErrorService.errorMessage(response.response);
          }
        })
        this.isLoaderAdmin = false;
      }
    });
  }

  fnRemoveInviter(inviterCode){
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: "Are you sure you want to delete?"
    });
     dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.isLoaderAdmin = true;
        let requestObject = {
          'user_id': inviterCode,
        }
        this.SettingService.removeTeamMember(requestObject).subscribe((response: any) => {
          if (response.data == true) {
            this.ErrorService.successMessage(response.response);
            this.getAPRInviter();
          }
          else if (response.data == false) {
            this.ErrorService.errorMessage(response.response);
          }
        })
        this.isLoaderAdmin = false;
      }
    });
  }
}

@Component({
  selector: 'Invite-Team-Mate',
  templateUrl: '../_dialogs/inviteTeamMateDialog.html',
})

export class inviteTeamMateDialog {
  inviteForm: FormGroup;
  isLoaderAdmin: any;
  boxofficeId: any;
  roleType: { 'A', 'EM', 'OM', 'OV' }
  allInviationArr:any = [];

  admin_permission: any;
  em_permission: any;
  om_permission: any;
  view_permission: any;
  email_id: string = '';
  em_sub_permission: any;
  om_AUEC_permission: any;
  om_AUER_permission: any;
  sub_permission: string = '';
  singleInviter:any;
  constructor(
    public dialogRef: MatDialogRef<inviteTeamMateDialog>,
    private _formBuilder: FormBuilder,
    private SettingService: SettingService,
    private ErrorService: ErrorService,
    private change: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if(this.data.inviterData){
      this.singleInviter = this.data.inviterData;
      // console.log(this.singleInviter)
      this.email_id = this.singleInviter.email_id;
    }
    this.boxofficeId = localStorage.getItem('boxoffice_id');

    if(this.singleInviter){
      // this.singleInviter.permission = this.singleInviter.permission.split(',')
      if(this.singleInviter.permission.indexOf("A")  > -1){
        this.admin_permission = true;
      }
      if(this.singleInviter.permission.indexOf("EM")  > -1){
        this.em_permission = true;
      }
      if(this.singleInviter.permission.indexOf("OM") > -1){
        this.om_permission = true;
      }
      if(this.singleInviter.permission.indexOf("OV")  > -1){
        this.view_permission = true;
      }
      this.singleInviter.sub_permission = this.singleInviter.sub_permission.split(',')
      console.log(this.singleInviter.sub_permission)
      if(this.singleInviter.sub_permission.indexOf("AUEC") > -1){
        this.om_AUEC_permission = true;
      }
      if(this.singleInviter.sub_permission.indexOf("AUER") > -1){
        this.om_AUER_permission = true;
      }
      if(this.singleInviter.sub_permission.indexOf("AACD") > -1){
        this.em_sub_permission = true;
      }
      // if(this.singleInviter.sub_permission){}
    }

  }

  
  fnOncheckedEM(event) {
    this.admin_permission = false;
    if(event.checked == true){
      this.em_sub_permission = event.checked;
      this.em_permission = event.checked;
    }
    // this.em_permission = event.checked;
  }

  fnOncheckedOM(event, type) {

    this.admin_permission = false;
    if(event.checked == true){
      this.om_permission = true;
    }
    if (type == 'AUEC') {
      this.om_AUEC_permission = event.checked;
    }

    if (type == 'AUER') {
      this.om_AUER_permission = event.checked;
    }

    if (this.om_AUEC_permission || this.om_AUER_permission) {
      this.om_permission = true;
    }

    // if(this.om_AUEC_permission == false || this.om_AUER_permission == false) {
    //   this.om_permission = false;
    // }

    this.change.detectChanges();
  }

  fnOnchecked(event, permission) {

    if (permission == 'admin_permission') {

      this.admin_permission = event.checked;

      this.em_permission = false;
      this.om_permission = false;
      this.view_permission = false;
      this.em_sub_permission = false;
      this.om_AUEC_permission = false;
      this.om_AUER_permission = false;


    } else if (permission == 'em_permission') {

      this.em_permission = event.checked;
      // this.em_sub_permission = event.checked;
      this.admin_permission = false;
      if(event.checked == false){
        this.em_sub_permission = false;
      }

    } else if (permission == 'om_permission') {

      this.om_permission = event.checked;
      // this.om_AUEC_permission = event.checked;
      // this.om_AUER_permission = event.checked;
      this.admin_permission = false;
      if(event.checked == false){
        this.om_AUEC_permission = false;
        this.om_AUER_permission = false;
      }

    } else if (permission == 'view_permission') {


      this.view_permission = event.checked;
      this.admin_permission = false;

    }
    this.change.detectChanges();

  }


  fnOnSubmit() {

    this.sub_permission = '';
    var permission  = '';

    if (this.admin_permission == true) {
      permission = "A";
    } else {

      var permissions = [];
      var sub_permissions = [];

      if (this.em_permission == true) {
        permissions.push('EM'); 
        if (this.em_sub_permission == true) {
          sub_permissions.push('AACD');
        }
      }

     

      if (this.om_permission == true) {

        permissions.push('OM')

        if (this.om_AUER_permission == true) {
          sub_permissions.push('AUER')
        }

        if (this.om_AUEC_permission == true) {
          sub_permissions.push('AUEC')
        }

      }

      if (this.view_permission == true) {
        permissions.push('OV')
      }

      permission = permissions.toString()
      this.sub_permission = sub_permissions.toString()
    }


    if (this.email_id == '') {
      this.ErrorService.errorMessage('Please enter Email');
      return;
    }

    if (permission == '') {
      this.ErrorService.errorMessage('Plese select any Role');
      return;
    }
	


    if (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(this.email_id)){
      
    }else{
      this.ErrorService.errorMessage('Please enter valid Email');
      return false;
    }
 

    this.isLoaderAdmin = true;
    if(!this.singleInviter){
      let inviteFormData = {
        'boxoffice_id': this.boxofficeId,
        "email_id": this.email_id,
        "role": "A",
        "permission": permission,
        "sub_permission": this.sub_permission,
        'url': environment.urlForLink+'/sign-up?email='+this.email_id+'&inviter='
      }
      this.SettingService.inviteform(inviteFormData).subscribe((response: any) => {
        if (response.data == true) {
          this.ErrorService.successMessage(response.response);
          this.dialogRef.close();
        } else if (response.data == false) {
          this.ErrorService.errorMessage(response.response);
        }
        this.isLoaderAdmin = false;
      });

    }else{
      let inviteFormData = {
        "user_id": this.singleInviter.unique_code,
        "permission": permission,
        "sub_permission": this.sub_permission,
      }
      this.SettingService.updateTeamRole(inviteFormData).subscribe((response: any) => {
        if (response.data == true) {
          this.ErrorService.successMessage(response.response);
          this.dialogRef.close();
        } else if (response.data == false) {
          this.ErrorService.errorMessage(response.response);
        }
        this.isLoaderAdmin = false;
      });
    }
    
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

  

}

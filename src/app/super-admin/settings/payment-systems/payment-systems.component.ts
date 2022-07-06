import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SettingService } from '../_services/setting.service';
import { ErrorService } from '../../../_services/error.service';
import { AuthenticationService } from '../../../_services/authentication.service';
import { environment } from '../../../../environments/environment';


@Component({
  selector: 'app-payment-systems',
  templateUrl: './payment-systems.component.html',
  styleUrls: ['./payment-systems.component.scss']
})
export class PaymentSystemsComponent implements OnInit {

  

  isLoaderAdmin : boolean = false;
  gatewayList:any=[];
  currentUser:any;
  constructor(
    private settingService:SettingService,
    private ErrorService: ErrorService,
    private auth : AuthenticationService,

  ) { 
    this.auth.currentUser.subscribe(x => this.currentUser = x);

    
    this.getAllPaymentGateways();
  }

  ngOnInit(): void {


    
  }

  

  getAllPaymentGateways(){
    let requestObject = {
      'user_code' : this.currentUser.user_id,
      'box_office_code' : localStorage.getItem('boxoffice_id'),
    }
    this.isLoaderAdmin = true;
    this.settingService.getAllPaymentGateways(requestObject).subscribe((response:any) => {
      if(response.status == 'success'){ 
        this.gatewayList = response.data;
        // this.ErrorService.successMessage('Paypal Updated')
      } else{
        this.ErrorService.errorMessage(response.response);
      }
      this.isLoaderAdmin = false;
    });

  }

  public onSavePaymentGateway(gateway_type){
    console.log(gateway_type)
  }

  public onSubmitPaymentGateway(data:NgForm,gateway_type,is_default,code){
        //console.log(data.value);
        let testMode = data.value.testMode?1:0;
        //console.log(testMode);
        let login_details = {};
        Object.entries(data.value).forEach(([key, value]) => {
          // login_details[key] = encodeURIComponent(String(value));
          login_details[key] = String(value);
        });
        delete login_details['testMode'];
        let requestObject = {
          'user_code' : this.currentUser.user_id,
          'box_office_code' : localStorage.getItem('boxoffice_id'),
          'gateway_type' : gateway_type,
          'gateway_code' : code,
          'login_detail' : login_details,
          'testMode' : testMode,
        }
        this.isLoaderAdmin = true;
        this.settingService.UpdatePaymentGateway(requestObject).subscribe(response => {
          //console.log(response);
          if(response['status']==='success'){
            this.ErrorService.successMessage(response['message']);
            // this._snackBar.open(response['message'],'X',{duration:environment.MatSnackBarConfig,panelClass:'success-response'});
            this.getAllPaymentGateways();
          }else if(response['status']=='error'){
            this.ErrorService.errorMessage(response['message']);
            // this._snackBar.open(response['message'],'X',{duration:environment.MatSnackBarConfig,panelClass:'error-response'});
          }
          this.isLoaderAdmin = false;
        },err=>{
          this.isLoaderAdmin = false;
          this.ErrorService.errorMessage(environment.ErrorMsg);
        })
  }

  public ChangePaymentStatus(code,type,status){
    if (status) {
      let requestObject = {
        'code':code,
        'status':'active',
        'gateway_type':type,
        'user_code':this.currentUser.user_id,
        'box_office_code':localStorage.getItem('boxoffice_id')
      }
      this.isLoaderAdmin = true;
      this.settingService.ChangeGatewayStatus(requestObject).subscribe(response => {
        if(response['status']=='success'){
          this.getAllPaymentGateways();
          this.ErrorService.successMessage(response['message']);
        }else if(response['status']==='error'){
          this.ErrorService.errorMessage(response['message']);
        }
        this.getAllPaymentGateways();
        this.isLoaderAdmin = false;
      },err=>{
        this.ErrorService.errorMessage(environment.ErrorMsg);
        this.isLoaderAdmin = false;
      })
    }
    else {
      let requestObject = {
        'code':code,
        'status':'inactive',
        'gateway_type':type,
        'user_code':this.currentUser.user_id,
        'box_office_code':localStorage.getItem('boxoffice_id')
      }
      this.isLoaderAdmin = true;
      this.settingService.ChangeGatewayStatus(requestObject).subscribe(response => {
        if(response['status']=='success'){
          this.ErrorService.successMessage(response['message']);
        }else if(response['status']==='error'){
          this.ErrorService.errorMessage(response['message']);
        }
        this.getAllPaymentGateways();
        this.isLoaderAdmin = false;
      },err=>{
        this.isLoaderAdmin = false;
        this.ErrorService.errorMessage(environment.ErrorMsg);
      })
    }
  }

  SetDefault(code,type) {
    let requestObject = {
      'user_code' : this.currentUser.user_id,
      'box_office_code' : localStorage.getItem('boxoffice_id'),
      'gateway_type' : type,
      'code' : code,
      'is_default' : 1,
    }
    this.isLoaderAdmin = true;
    this.settingService.ChangeDefaultGateway(requestObject).subscribe(response => {
      if(response['status']=='success'){
        this.getAllPaymentGateways();
        this.ErrorService.successMessage(response['message']);
      }else if(response['status']=='error'){
        this.ErrorService.errorMessage(response['message']);
      }else{
        this.ErrorService.errorMessage(response['message']);
      }
      this.isLoaderAdmin = false;
    },err=>{
      this.isLoaderAdmin = false;
      this.ErrorService.errorMessage(environment.ErrorMsg);
    })
  }




}

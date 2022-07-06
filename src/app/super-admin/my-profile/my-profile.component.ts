import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators,FormControl } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {SettingService} from '../settings/_services/setting.service';
import { ErrorService } from '../../_services/error.service';
import { AppComponent } from '../../app.component';
import { Router, RouterEvent } from '@angular/router';
import { AuthenticationService } from '../../_services/authentication.service'

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {
  profileImageUrl:any;
  myProfileForm:FormGroup;
  changePwd:FormGroup;
  isLoaderAdmin:any;
  onlyNumaric = "[0-9]+"
  currentUser:any;
  hide1 = true;
  hide2 = true;
  myProfileData:any;
  profileId:any;
  changePasswordBox:boolean=false;
  emailFormat = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
  onlynumeric = /^[0-9]+$/


  constructor(
    private _formBuilder: FormBuilder,
    private SettingService : SettingService,
    private ErrorService: ErrorService,
    private router: Router,
    public dialog: MatDialog,
    private auth : AuthenticationService,
    private AppComponent : AppComponent
  ) {
    this.auth.currentUser.subscribe(x => this.currentUser = x);
    this.myProfileForm = this._formBuilder.group({
      firstname : ['',[Validators.required,Validators.maxLength(15)]],
      email:['',[Validators.required,Validators.email,Validators.pattern(this.emailFormat)]],
      phone:['',[Validators.required,Validators.pattern(this.onlynumeric),Validators.minLength(6),Validators.maxLength(15)]],
    });
    this.changePwd = this._formBuilder.group({
      oldPassword : ['',[Validators.required]],
      newPassword:['',[Validators.required,Validators.minLength(8)]],
      ReNewPassword: ['', Validators.required]            
    
    },{validator: this.checkPasswords });

   }

  ngOnInit(): void {
    this.getMyProfileData();
    //this.updateMyProfile(this.myProfileData);
  }

  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    let pass = group.controls.newPassword.value;
    let confirmPass = group.controls.ReNewPassword.value;

    return pass === confirmPass ? null : { notSame: true }
  }

  fnChangeImage(){
    const dialogRef = this.dialog.open(DialogAdminProfileImageUpload, {
      width: '500px',
      
    });
  
     dialogRef.afterClosed().subscribe(result => {
        if(result != undefined){
            this.profileImageUrl = result;
            console.log(result);
           }
     });
  }

  getMyProfileData(){
    this.isLoaderAdmin = true;
    // console.log(this.currentUser);
    let requestObject = {
      // 'search':this.search.keyword,
       'unique_code' : this.currentUser.user_id
    }
    this.SettingService.getMyProfileData(requestObject).subscribe((response:any) => {
      if(response.data == true){
         this.myProfileData = response.response;
         this.profileId = this.myProfileData.id       
        //  console.log(this.myProfileData);
        if(this.myProfileData.status == 'APR'){
          this.myProfileForm.controls['firstname'].setValue(this.myProfileData.name)
          //  this.myProfileForm.controls['lastname'].setValue(this.myProfileData[0].lastname)
           this.myProfileForm.controls['email'].setValue(this.myProfileData.email_id)
           this.myProfileForm.controls['phone'].setValue(this.myProfileData.phone)
        }else{
          this.myProfileForm.controls['firstname'].setValue(this.myProfileData.firstname)
          //  this.myProfileForm.controls['lastname'].setValue(this.myProfileData[0].lastname)
           this.myProfileForm.controls['email'].setValue(this.myProfileData.email)
           this.myProfileForm.controls['phone'].setValue(this.myProfileData.phone)
        }
        

      } else if(response.data == false){

        this.ErrorService.errorMessage(response.response);
        this. myProfileData = null;

      }
      this.isLoaderAdmin = false;
    })
    
  }


  fnRemoveImage(){
    let requestObject={
      'unique_code' :  this.currentUser.user_id
    }
    this.SettingService.removeProfileImage(requestObject).subscribe((response:any) => {
      if(response.data == true){
      this.ErrorService.successMessage(response.response);
      this.getMyProfileData();
    } else if(response.data == false){
      this.ErrorService.errorMessage(response.response);
      }
    });
  }

  fnChangePassword(){
    if(this.changePwd.valid){
      this.isLoaderAdmin = true;
      let requestObject = {
        'user_id': this.currentUser.user_id,
        "old_password" : this.changePwd.get('oldPassword').value,
        "new_password" : this.changePwd.get('newPassword').value,
      }
      this.SettingService.changePassword(requestObject).subscribe((response:any) => {
        if(response.data == true){
          this.ErrorService.successMessage(response.response);
          this.changePwd.reset();
        }
        else if(response.data == false){
          this.ErrorService.errorMessage(response.response);
        }
        this.isLoaderAdmin = false;
      })
    }
    else{
      this.changePwd.get("oldPassword").markAsTouched();
      this.changePwd.get("newPassword").markAsTouched();
    }
  }

  fnOnSubmitMyProfile(){
    if(this.myProfileForm.valid){
      this.isLoaderAdmin = true;
      if(this.profileImageUrl){
        let updateMyProfile = {
          'unique_code': this.currentUser.user_id,
          "firstname" : this.myProfileForm.get('firstname').value,
          "email" : this.myProfileForm.get('email').value,
          "phone" : this.myProfileForm.get('phone').value,
          "image" : this.profileImageUrl,
          "id":this.profileId,
        }
        this.updateMyProfile(updateMyProfile);
      }else {
        let updateMyProfile = {
          'unique_code': this.currentUser.user_id,
          "firstname" : this.myProfileForm.get('firstname').value,
          "email" : this.myProfileForm.get('email').value,
          "phone" : this.myProfileForm.get('phone').value,
          "id":this.profileId,
        }
        this.updateMyProfile(updateMyProfile);
       
      }
      
    }
    else{
      this.myProfileForm.get("firstname").markAsTouched();
      // this.myProfileForm.get("lastname").markAsTouched();
      this.myProfileForm.get("email").markAsTouched();
      this.myProfileForm.get("phone").markAsTouched();      
    }
  }

  updateMyProfile(updateMyProfile){
    this.SettingService.updateMyProfile(updateMyProfile).subscribe((response:any) => {
      if(response.data == true){
        this.ErrorService.successMessage('Profile updated successfully.');
        if(localStorage.getItem('keepMeSignIn') == 'true'){
          localStorage.setItem('currentUser', JSON.stringify(response.response))
          setTimeout(() => {
            window.location.reload();
         }, 300);
        }
        else{
          sessionStorage.setItem('currentUser', JSON.stringify(response.response))
          setTimeout(() => {
            window.location.reload();
         }, 300);
        }
        this.AppComponent.updateUserData();
       this. getMyProfileData();
      }
      else if(response.data == false){
       this.ErrorService.errorMessage(response.response);
      }
      this.isLoaderAdmin = false;
    })
  }

  onCancel(){
    if(localStorage.getItem('boxoffice_id')){
      this.router.navigateByUrl('/super-admin/dashboard');
    }else{
      this.router.navigateByUrl('/super-admin');
    }
    // this.getMyProfileData();
  }

  }
  
@Component({
  selector: 'profile-image-upload',
  templateUrl: '../_dialogs/image-upload.html',
})
export class DialogAdminProfileImageUpload {

  uploadForm: FormGroup;  
  imageSrc: string;
  profileImage: string;
  
constructor(
  public dialogRef: MatDialogRef<DialogAdminProfileImageUpload>,
  private _formBuilder:FormBuilder,
  private ErrorService: ErrorService,
  @Inject(MAT_DIALOG_DATA) public data: any) {}

  onNoClick(): void {
      this.dialogRef.close(this.profileImage);
    }
    ngOnInit() {
      this.uploadForm = this._formBuilder.group({
        profile: ['']
      });
    }
    get f() {
      return this.uploadForm.controls;
    }
    
onFileChange(event) {
  var file_type = event.target.files[0].type;
  if(file_type!='image/jpeg' &&  file_type!='image/png' && file_type!='image/jpg' &&  file_type!='image/gif'){
    this.ErrorService.errorMessage("Sorry, only JPG, JPEG, PNG & GIF files are allowed.");
      return;
  }
  const reader = new FileReader();
  if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
          this.imageSrc = reader.result as string;
          this.uploadForm.patchValue({
              fileSource: reader.result
          });
      };
  }
}
uploadImage() {
  this.profileImage = this.imageSrc
  this.dialogRef.close(this.profileImage);
}


}

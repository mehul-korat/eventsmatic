import { Component, Renderer2, ElementRef, ViewChild, HostListener } from '@angular/core';
import { Router, RouterEvent, RouterOutlet, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from './_services/authentication.service';
import { ErrorService } from './_services/error.service';
import { SocialAuthService, FacebookLoginProvider,GoogleLoginProvider, SocialUser } from 'angularx-social-login';
import { User, Role } from './_models';
import { MatSnackBar } from '@angular/material/snack-bar';
import { first, map } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BnNgIdleService } from 'bn-ng-idle';
import { MdePopoverTrigger } from '@material-extended/mde';
import { ConfirmationDialogComponent } from './_components/confirmation-dialog/confirmation-dialog.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {



  title = 'Eventsmatic';
  boxofficeComponent: boolean = true;
  pageName: any = 'Box-Office';
  timer: any = 0;
  selectedBoxOfficeName: any;
  currentUser: any;
  adminTopMenuselected: any
  loginForm: FormGroup;
  currentUrl: string = '';
  openLogoutMenuBox: boolean = false;
  pageSlug: any;
  isAllowed: boolean = true;
  keepMe: any;
  currentUserData: any;
  currentUserImage: any;

  @ViewChild('toggleButton') toggleButton: ElementRef;
  @ViewChild('logoutMenu') logoutMenu: ElementRef;
  @ViewChild(MdePopoverTrigger, { static: false }) trigger: MdePopoverTrigger;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bnIdle: BnNgIdleService,
    private renderer: Renderer2,
    private _snackBar: MatSnackBar,
    private authService: SocialAuthService,
    private authenticationService: AuthenticationService,
    private dialog: MatDialog,
    private errorService: ErrorService,
  ) {
    localStorage.setItem('mainSidebar', 'true');
    this.keepMe = localStorage.getItem('keepMeSignIn')
    if (this.keepMe == 'true') {
      this.currentUserData = JSON.parse(localStorage.getItem('currentUser'))
      // alert("app local").
      this.currentUser = this.currentUserData
    } else {
      this.currentUserData = JSON.parse(sessionStorage.getItem('currentUser'))
      // alert("app sessions")
      this.currentUser = this.currentUserData
      // this.currentUserImage = this.currentUserData.image
    }
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    this.router.events.subscribe(event => {
      if (event instanceof RouterEvent) this.handleRoute(event);
      const url = this.getUrl(event);
      this.currentUrl = url;
      if ((this.currentUser && this.currentUrl == '')) {
        if (this.currentUser.user_type == 'A') {
          this.router.navigate(['/super-admin/']);
        }

      }
    });

    if (this.currentUser && this.currentUser !== null) {
      this.adminTopMenuselected = this.currentUser.firstname
      this.loadLocalStorage();
    }

    this.bnIdle.startWatching(6600).subscribe((res) => {
      if (res) {
        if (this.authenticationService.currentUserValue) {
          this.logout();
        }
      }
    });


  }


  ngOnInit() {

    localStorage.removeItem('eventDetails');
    var is_logout = this.authenticationService.logoutTime();

    if (is_logout == true) {
      this.router.navigate(['/login']);
      return false;
    }



  }

  updateUserData(){
    this.keepMe = localStorage.getItem('keepMeSignIn')
    if (this.keepMe == 'true') {
      this.currentUserData = localStorage.getItem('currentUser')
      // alert("app local").
      this.currentUser = this.currentUserData
    } else {
      this.currentUserData = sessionStorage.getItem('currentUser')
      // alert("app sessions")
      this.currentUser = this.currentUserData
      // this.currentUserImage = this.currentUserData.image
    }
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  dynamicSort(property: string) {
    let sortOrder = 1;

    if (property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
    }

    return (a, b) => {
      const result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
      return result * sortOrder;
    };
  }

  private getUrl(event: any) {
    if (event && event.url) {
      this.pageSlug = event.url.split('/', 2)
      const url = event.url;
      const state = (event.state) ? event.state.url : null;
      const redirect = (event.urlAfterRedirects) ? event.urlAfterRedirects : null;
      const longest = [url, state, redirect].filter(value => !!value).sort(this.dynamicSort('-length'));
      if (longest.length > 0) return longest[0];
    }
  }

  private cleanUrl(url: string) {
    if (url) {
      let cleanUrl = url.substr(1);
      const slashIndex = cleanUrl.indexOf("/");
      if (slashIndex >= 0) {
        cleanUrl = cleanUrl.substr(slashIndex + 1, 8);
        return cleanUrl;
      } else {
        return null;
      }
    } else return null;
  }

  private urlIsNew(url: string) {
    return !!url && url.length > 0 && url !== this.currentUrl;
  }

  private handleRoute(event: RouterEvent) {
    const url = this.getUrl(event);
    let devidedUrl = url.split('/', 4);
    this.currentUrl = url;
    if (url === '/super-admin/dashboard') {
      this.pageName = 'Dashboard';
    }
    else if (url === '/super-admin') {
      this.pageName = 'Box Office'
    }
    else if (url === '/super-admin/my-profile') {
      this.pageName = 'My Profile'
    }
    else if (url === '/super-admin/events' || url === '/super-admin/events?event=new') {
      this.pageName = 'Events'
    }
    else if (url === '/super-admin/orders' || url === '/super-admin/orders?order=new') {
      this.pageName = 'Orders'
    }
    else if (url === '/super-admin/customers' || url === '/super-admin/customers?customer=new') {
      this.pageName = 'Customers'
    }
    else if (url === '/super-admin/coupons' || url === '/super-admin/coupons?coupon=new' || url === '/super-admin/coupons?voucher=new') {
      this.pageName = 'Coupon'
    } else if (url === '/super-admin/settings') {
      this.pageName = 'Settings'
    }else if(devidedUrl[2] != 'settings' && devidedUrl[2] != 'single-event-dashboard' && this.currentUser){
      if (this.currentUser.user_type == 'A') {
        this.router.navigate(['/super-admin/']);
      }
    }
    if (devidedUrl[2] == 'settings') {
      if(localStorage.getItem('boxoffice_id')){
        this.pageName = 'Settings'
      }else{
        this.errorService.errorMessage('Select Box-office first.');
        this.router.navigate(["/super-admin/boxoffice"]);
      }
    } else if (devidedUrl[2] == 'single-event-dashboard') {
      if(localStorage.getItem('boxoffice_id')){
        this.pageName = 'Events';
      }else{
        this.errorService.errorMessage('Select Box-office first.');
        this.router.navigate(["/super-admin/boxoffice"]);
      }
    }
  }


  loadLocalStorage() {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    this.adminTopMenuselected = this.currentUser.firstname
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }


  fnCheckLoginStatus() {

    if (this.authenticationService.currentUserValue.user_type == Role.Admin) {
      this.router.navigate(["super-admin"]);
    }
  }

  openLogoutMenu() {
    this.openLogoutMenuBox = !this.openLogoutMenuBox;
  }

  initiateTimeout() {
    let that = this
    that.timer = setTimeout(function () {
      that.logout();
    }, 1080000);
  }

  fnLogout() {
    this.logout();
    this.openLogoutMenuBox = false;
  }

  fnMyProfile() {
    this.router.navigate(['/super-admin/my-profile']);
    this.openLogoutMenuBox = false;
  }

  isBoxoffice() {
    if (localStorage.getItem('isBoxoffice') && localStorage.getItem('isBoxoffice') == "true") {
      this.boxofficeComponent = true;
      return true;
    } else {
      this.boxofficeComponent = false;
      return false;
    }
  }

  isEmpty(data) {
    for (let key in data) {
        let value = data[key];
        if (value != "" && value != null) {
          return false;
        }
    }
    return true;
  }
  fnPostUrl(postUrl) {
    this.pageName = postUrl;
    let url = postUrl.toLowerCase();


    
    let data = JSON.parse(localStorage.getItem('eventDetails'));
    if (this.isEmpty(data)) {
      // if the form is empty
      this.router.navigate([`/super-admin/${url}`]);
    }
    else {
      // if the form is not empty
      // open the dialog
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '400px',
        data: "If you have entered any data it might get lost. Do you want to proceed?"
      });

      // look for the user's decision
      dialogRef.afterClosed().subscribe(result => {
        // if user wants to still redirect
        // and is willing to lose the data
        if (result) {
          localStorage.removeItem('eventDetails');
          this.router.navigate([`/super-admin/${url}`]);
        }else{
          this.pageName = 'Events';
        }
      })

    }
  }

  goToMyBoxOffice(){
    localStorage.removeItem('boxoffice_id');
    localStorage.removeItem('boxoffice_name');
    localStorage.removeItem('boxoffice_link');
  }

  isBoxOfficeSelected() {
    if (localStorage.getItem('boxoffice_id') && localStorage.getItem('boxoffice_id') != "") {
      this.selectedBoxOfficeName = localStorage.getItem('boxoffice_name');
      return true;
    } else {
      return false;
    }
  }
  isSideBar() {
    if (localStorage.getItem('mainSidebar') && localStorage.getItem('mainSidebar') == "true") {
      return true;
    } else {
      return false;
    }
  }


  isAdminUser() {
    return this.currentUser && (this.currentUser.user_type === Role.Admin);
  }

  isLogin() {

    if (this.currentUser) {
      return true;

    } else {
      return false;
    }
  }

  isPermisionPage(pageName) {

    var loginUser = this.currentUser;

    

    if (!loginUser) {
      return false;
    }

    if (loginUser.type == 'member' && loginUser.permission != "A") {

      if (pageName == 'Dashboard' && localStorage.getItem('permision_OV')) {
        return true;
      }

      if (pageName == 'Events' && localStorage.getItem('permision_EM')) {
        return true;
      }

      if (pageName == 'Orders' && localStorage.getItem('permision_OM')) {
        return true;
      }

    } else if (loginUser.type == 'member' && loginUser.permission == "A") {
      return true;
    } else if (loginUser.type == 'admin') {
      return true;
    }

  }

  signInWithGoogle(loginForm): void {
    this.loginForm=loginForm;
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(res=>{
      this.fnLoginWithGoogleFacebook(res);
    });
  }

  signInWithFB(loginForm): void {
    this.loginForm=loginForm;
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then(res=>{
      this.fnLoginWithGoogleFacebook(res);

    }); 
  }

  fnLoginWithGoogleFacebook (user) {
    this.isAllowed=false;
    if(user.email == ''){
          this._snackBar.open('Please add email id in your facebook account.', "X", {
              duration: 2000,
              verticalPosition:'top',
              panelClass :['red-snackbar']
          });
          return false;
      }
    this.authenticationService.loginWithGoogleFacebook(user.id,user.email,user.provider).pipe(first()).subscribe(data => {
      if(data.idExists == true && data.emailExists == true){
          this.router.navigate(["super-admin"]);

      }else if(data.idExists == false && data.emailExists == true){
        this._snackBar.open("You are successfully loggedin with Eventsmatic using google account.", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['green-snackbar']
        });
        this.router.navigate(["super-admin"]);
        // this.loginForm.controls['email'].setValue(data.userData.email);
      }else if(data.idExists == true && data.emailExists == false){
        this.router.navigate(["super-admin"]);
        this._snackBar.open("You are successfully registered with Eventsmatic.", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['green-snackbar']
        });
        
        // this.router.navigate(["super-admin"]);
        // //this.error = "It seems that you already have account with Eventsmatic";
        // this.loginForm.controls['email'].setValue(data.userData.email);
        // //this.dataLoaded = true;
      }else if(data.idExists == false && data.emailExists == false){
        // this.fnSignup(user);this.isAllowed=true;
        this.router.navigate(["super-admin"]);
        this._snackBar.open("You are successfully registered with Eventsmatic.", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['green-snackbar']
        });
      }
    },
    error => {
      this._snackBar.open("Database Connection Error", "X", {
        duration: 2000,
        verticalPosition: 'top',
        panelClass: ['red-snackbar']
      }); 
      // this.error = "Database Connection Error"; 
      // this.dataLoaded = true;  
    });


    
  }

  signOut(): void {
    // this.authService.signOut();
  }


  fnSignup(user_data) {
    let signUpUserObj = {
      "password": "",
      "firstname": user_data.firstName,
      "lastname": user_data.lastName,
      "phone": "",
      "email": user_data.email,
      "address": "",
      "zip": "",
      "state": "",
      "city": "",
      "country": "",
      "google_id": user_data.provider == "GOOGLE" ? user_data.id : null,
      "facebook_id": user_data.provider == "FACEBOOK" ? user_data.id : null
    }
    // .subscribe((response: any) => 
    this.authenticationService.signup(signUpUserObj).pipe(first()).subscribe(data => {
      if (data.data == true) {
        this.fnLoginWithGoogleFacebook(user_data);
      } else {
        this._snackBar.open("Unable to signin with " + user_data.provider, "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['red-snackbar']
        });
        // this.error = "Unable to signin with "+user_data.provider; 
        // this.dataLoaded = true;
      }
    },
      error => {
        this._snackBar.open("Database Connection Error", "X", {
          duration: 2000,
          verticalPosition: 'top',
          panelClass: ['red-snackbar']
        });
        // this.error = "Database Connection Error"; 
        // this.dataLoaded = true;  
      });
  }

  closePopover() {
    this.trigger.togglePopover();
  }

  addNewEventNav() {
    this.router.navigate(['/super-admin/events'], { queryParams: { event: 'new' } });
    this.pageName = 'Events';
  }
  addNewOrderNav() {
    this.router.navigate(['/super-admin/orders'], { queryParams: { order: 'new' } }); 
    this.pageName = 'Orders';
  }
  addNewCustomerNav() {
    this.router.navigate(['/super-admin/customers'], { queryParams: { customer: 'new' } }); 
    this.pageName = 'Customers';
  }
  addNewCouponNav() {
    this.router.navigate(['/super-admin/coupons'], { queryParams: { coupon: 'new' } }); 
    this.pageName = 'Coupon';
  }
  addNewVoucherNav() {
    this.router.navigate(['/super-admin/coupons'], { queryParams: { voucher: 'new' } }); 
    this.pageName = 'Coupon';
  }


}

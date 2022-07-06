import { NgModule } from '@angular/core';
import { Router,Routes, RouterModule ,NavigationEnd } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { Role } from './_models';
import { AuthGuard } from './_helpers/auth.guard';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ConfirmationDialogComponent } from './_components/confirmation-dialog/confirmation-dialog.component';
import { ResponsePageComponent } from './response-page/response-page.component';

const routes: Routes = [
 
  { 
    path: 'super-admin', 
    canActivate: [AuthGuard],
    data: { roles : Role.Admin },
    loadChildren: () => import('./super-admin/super-admin.module').then(m => m.SuperAdminModule) },  
  { 
    path: 'settings', 
    loadChildren: () => import('./super-admin/settings/settings.module').then(m => m.SettingsModule) 
  },
  {
    path: '', 
    component: LoginComponent 
  },
   {
    path: 'login', 
    component: LoginComponent 
  },
  {
    path: 'forgot-password', 
    component: ForgotPasswordComponent 
  },
  {
    path: 'sign-up', 
    component: SignupComponent 
  },
  {
    path: 'reset-password', 
    component: ResetPasswordComponent 
  },
  {
    path: 'thank-you', 
    component: ResponsePageComponent 
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes ,
    {
        anchorScrolling: "enabled",
        onSameUrlNavigation: "reload",
        scrollPositionRestoration: "enabled"
      })],
  exports: [RouterModule]
})
export class AppRoutingModule { 

	// constructor(private router: Router,public dialog: MatDialog) {
 //    this.router.events.subscribe((ev) => {
 //      if (ev instanceof NavigationEnd) { 
	// 	console.log('r call' + ev + NavigationEnd);

		
	// 	let event_val = localStorage.getItem('event_val');
	// 	if(event_val=='1'){
	// 		console.log(this.router.url);
	// 		const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
	// 			width: '400px',
	// 			data: "Are you want to exit? Your data will get lost."
	// 		  });
	// 		  dialogRef.afterClosed().subscribe(result => {
	// 			  if(result){
	// 				console.log('yes');
	// 				return false;
	// 			  }else{
	// 				  console.log('no');
	// 				return true;
	// 			  }					  
	// 		  });
	// 	}		
	//   }
 //    });
 //  }
}

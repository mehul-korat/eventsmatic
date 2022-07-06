import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../_services/authentication.service';
import { Role } from '../_models';


@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate  {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this.authenticationService.currentUserValue;
        
        if (currentUser) {

            var is_logout = this.authenticationService.logoutTime();

            if(is_logout==true){
                this.router.navigate(['/login']);
                return false;
            }
            // check if route is restricted by role
            if (route.data.roles && route.data.roles == currentUser.user_type) {
                // role not authorised so redirect to home page
                //this.router.navigate(['/']);
                // authorised so return true
                return true;
            }else{

               if(currentUser.user_type == Role.Admin){
                    this.router.navigate(['/admin']);
                    return false;
               } else if(currentUser.user_type == Role.Staff){
                    this.router.navigate(['/staff']);
                    return false;
               } else if(currentUser.user_type == Role.Customer){
                    this.router.navigate(['/user']);
                    return false;
               } else if(currentUser.user_type == Role.SuperAdmin){
                    this.router.navigate(['/super-admin']);
                    return false;
               }
            }
            
        }

        // not logged in so redirect to login page with the return url
        //this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        this.router.navigate(['/login']);
        return false;
    }
}                                             
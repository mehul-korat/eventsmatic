import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent, RouterOutlet,ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  
  pageName :any = '';
  openEventMenuBox :boolean = false;
  currentUrl:any;
  currentUser:any;
  keepMe:any;
  teamAccessAllowed:boolean = true;
  currentUserData:any;
  sidebar:boolean=true;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) { 
    this.keepMe = localStorage.getItem('keepMeSignIn')
    if (this.keepMe == 'true') {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'))
    } else {
      this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'))
    }
    // this.currentUser = JSON.parse(this.currentUser);
    if(this.currentUser.permission == "A"){
      this.teamAccessAllowed = false;
    }
    if(this.currentUser.type == 'member' && this.currentUser.permission != 'A'){
        this.router.navigate(['/super-admin']);
        
    }
    
    this.router.events.subscribe(event => {
      if (event instanceof RouterEvent) this.handleRoute(event);
    });
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
    if (event) {
      const url = event.url;
      const state = (event.state) ? event.state.url : null;
      const redirect = (event.urlAfterRedirects) ? event.urlAfterRedirects : null;
      const longest = [url, state, redirect].filter(value => !!value).sort(this.dynamicSort('-length'));
      if (longest.length > 0) return longest[0];
    }
  }

  private handleRoute(event: RouterEvent) {
    const url = this.getUrl(event);
    this.currentUrl = url;
    if(url === '/super-admin/settings'){
      this.pageName = 'websites-embed-codes';
    }
    else if(url === '/super-admin/settings/event-page-design'){
      this.pageName= 'event-page-design';
    }
    else if(url === '/super-admin/settings/buttons-and-links'){
      this.pageName= 'buttons-and-links'
    }
    else if(url === '/super-admin/settings/websites-embed-codes'){
      this.pageName= 'websites-embed-codes'
    }
    else if(url === '/super-admin/settings/contact-preferences'){
      this.pageName= 'contact-preferences'
    }
    else if(url === '/super-admin/settings/checkout-form'){
      this.pageName= 'checkout-form'
    }
    else if(url === '/super-admin/settings/order-confirmation'){
      this.pageName= 'order-confirmation'
    }
    else if(url === '/super-admin/settings/team-access'){
      this.pageName= 'team-access'
    }
    else if(url === '/super-admin/settings/seating-charts'){
      this.pageName= 'seating-charts'
    }
    else if(url === '/super-admin/settings/my-profile'){
      this.pageName= 'my-profile'
    }
    else if(url === '/super-admin/settings/box-office'){
      this.pageName= 'box-office'
    }
    else if(url === '/super-admin/settings/payment-systems'){
      this.pageName= 'payment-systems'
    }
    else if(url === '/super-admin/settings/billing'){
      this.pageName= 'billing'
    }
    else if(url === '/super-admin/settings/sales-tax'){
      this.pageName= 'sales-tax'
    }
    else if(url === '/super-admin/settings/connect-app'){
      this.pageName= 'connect-app'
    }
    else if(url === '/super-admin/settings/reminders'){
      this.pageName= 'reminders'
    }
    else if(url === '/super-admin/settings/privacy-policy'){
      this.pageName= 'privacy-policy'
    }
    if(url === '/super-admin/settings/event-page-design'){
      this.sidebar = false;
      localStorage.setItem('mainSidebar', 'false');
    }else{
      this.sidebar = true;
      localStorage.setItem('mainSidebar', 'true');
    }
  }

  ngOnInit(): void {
  }

  isShowDiv = false;
  toggleDisplayDiv() {
    this.isShowDiv = !this.isShowDiv;
    
  }

  fnPostUrl(postUrl){
    this.pageName = postUrl; 
  }
  openEventMenu(){
    this.openEventMenuBox = this.openEventMenuBox?false :true;
  } 

}



import { Component, OnInit,ViewChild} from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {HttpClient} from '@angular/common/http';
import { SettingService } from '../_services/setting.service';
import { ErrorService } from '../../../_services/error.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';


@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit {
 privacyPolicesForm:FormGroup;
 isLoaderAdmin:any;
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
    public dialog: MatDialog,
    private _formBuilder:FormBuilder,
    private SettingService : SettingService,
    private ErrorService : ErrorService
  ) {
    this.privacyPolicesForm = this._formBuilder.group({
      updatePolicy:['',[Validators.required]],
    });
    this.getPrivacyPloicy();
   }


   getPrivacyPloicy(){
    this.isLoaderAdmin = true;
 
    let requestObject1 = {
      "boxoffice_id"  : localStorage.getItem('boxoffice_id'),
      "option_key"    :  "privacyPolices",
      "event_id" :  'NULL',
    }
    this.SettingService.getSettingsValue(requestObject1).subscribe((response:any) => {
      if(response.data == true){
        console.log(JSON.parse(response.response))
        this.privacyPolicesForm.controls['updatePolicy'].setValue(JSON.parse(response.response).updatePolicy);
      }else if(response.data == false){
      }
      this.isLoaderAdmin = false;
    });
  }

   fnPrivacyPolices(){

    if(this.privacyPolicesForm.valid){

        let privacyPolices = {
          "updatePolicy":this.privacyPolicesForm.get('updatePolicy').value,
        }
        let requestObject = {
          "boxoffice_id"  : localStorage.getItem('boxoffice_id'),
          "option_key"    :  "privacyPolices",
          "option_value" : privacyPolices,
          "event_id" :  null,
          'json_type' : 'Y'
        }
        this.updateprivacyPolices(requestObject);
        this.privacyPolicesForm.reset();
    }else{
      this.privacyPolicesForm.get('updatePolicy').markAllAsTouched();
      return false;
    }

  }
  updateprivacyPolices(requestObject){
    this.isLoaderAdmin = true;
    this.SettingService.updateSetting(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.ErrorService.successMessage('Privacy polices Updated')
        this.getPrivacyPloicy();
      } else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
      this.isLoaderAdmin = false;
    });

  }

  

  fnCancel(){
    this.privacyPolicesForm.reset();
  }

  ngOnInit(): void {

  }

  fnPrivacyPolicyGenerate() {
    const dialogRef = this.dialog.open(PrivacyPolicyGenerateDialog,{
      width: '700px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      this.getPrivacyPloicy();
    
    });
  }

}
@Component({
  selector: 'app-privacy-policy-generate',
  templateUrl: '../_dialogs/privacy-policy-generate.component.html',
})
export class PrivacyPolicyGenerateDialog implements OnInit {
  preview:boolean = false;
  generatePrivacyPolicyForm:FormGroup;
  privacyPolicyData:any = [];
  textMessage:any;
  htmlContent:any;
  isLoaderAdmin:boolean=false;
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
    public dialogRef: MatDialogRef<PrivacyPolicyGenerateDialog>,
    private _formBuilder:FormBuilder,
    private SettingService : SettingService,
    private ErrorService : ErrorService
  ){
    this.generatePrivacyPolicyForm = this._formBuilder.group({
      orgName:['',[Validators.required]],
      orgAddress:['',[Validators.required]],
      orgEmail:['',[Validators.required,Validators.email]],
      orgContact:[''],
      emailMarketing:['',[Validators.required]],
      advertisingNetwork:['',[Validators.required]],
      acceptTerm:['',[Validators.required]]
    })
  }

  fnGeneratePolicy(){
    if(this.generatePrivacyPolicyForm.valid){
      this.privacyPolicyData ={
        'orgName':this.generatePrivacyPolicyForm.get('orgName').value,
        'orgAddress':this.generatePrivacyPolicyForm.get('orgAddress').value,
        'orgEmail':this.generatePrivacyPolicyForm.get('orgEmail').value,
        'orgContact':this.generatePrivacyPolicyForm.get('orgContact').value,
        'emailMarketing':this.generatePrivacyPolicyForm.get('emailMarketing').value,
        'advertisingNetwork':this.generatePrivacyPolicyForm.get('advertisingNetwork').value,
        'acceptTerm':this.generatePrivacyPolicyForm.get('acceptTerm').value
      }
      console.log(this.privacyPolicyData)
      this.fnPreview();
      this.htmlContent = '<h3 class="text-left">Introduction</h3> <p>This policy sets out how we collect, process and hold your personal data if you visit our event ticket shop or otherwise provide personal data to us. We are '+this.privacyPolicyData.orgName+' of '+this.privacyPolicyData.orgAddress+'. We are the data controller of your personal data.</p><p>This policy affects your legal rights and obligations so please read it carefully. If you have any questions, please contact us at'+this.privacyPolicyData.orgEmail+'or call us on '+this.privacyPolicyData.orgContact+'.</p><h3 class="text-left">Personal data we collect</h3> <p>We collect, process, store and use personal data when you book a ticket to an event including your name, address and email address together with payment information. We may also collect personal data that you give to us about other people if you register them to attend an event. You agree that you have notified any other person whose personal data that you provide to us of this privacy notice and, where necessary, obtained their consent so that we can lawfully process their personal data in accordance with this policy.</p><p>All personal data that you provide to us must be true, complete and accurate. If you provide us with inaccurate or false data, and we suspect or identify fraud, we will record this.</p><p>You do not need to provide us with any personal data to view our event ticket shop. However, we may still collect the information set under the Data we automatically collect section of this policy, and marketing communications in accordance with the Marketing Communications section of this policy.</p><p>When you contact us by email or post, we may keep a record of the correspondence and we may also record any telephone call we have with you.</p><h3 class="text-left">Data we automatically collect</h3> <p>When you visit our event ticket shop, we, or third parties on our behalf, automatically collect and store information about your device and your activities. This information could include (a) your computer or other device unique ID number; (b) technical information about your device such as type of device, web browser or operating system; (c) your preferences and settings such as time zone and language; and (d) statistical data about your browsing actions and patterns. We collect this information using cookies in accordance with the Cookie section of this policy and we use the information we collect on an anonymous basis to improve our event ticket shop, our events and the services we provide, and for analytical and research purposes.</p><p>We also allow advertisers and advertising networks to collect information about your computer or mobile device, activities, and geographic location to enable them to display targeted ads to you and provide us with anonymous information about our users’ behaviour. Again, this takes place through the use of cookies in accordance with the Cookie section of this policy.</p><h3 class="text-left">Marketing Communications</h3> <p>If you opt in to receive marketing communications from us you consent to the processing of your data to send you such communications, which may include newsletters, blog posts, surveys and information about new events. We retain a record of your consent.</p><p>You can choose to no longer receive marketing communications by contacting us at kalpit@broadviewinnovations.in or clicking unsubscribe from a marketing email. If you do unsubscribe to marketing communications, it may take up to 5 business days for your new preferences to take effect. We shall therefore retain your personal data in our records for marketing purposes until you notify us that you no longer wish to receive marketing emails from us.</p><h3 class="text-left">Lawful processing of your personal data</h3> <p>We will use your personal data in order to comply with our contractual obligation to supply to you the tickets to an event that you have booked, including to contact you with any information relating to the event, to deliver the event to you in accordance with any requests you make and that we agree to, and to deal with any questions, comments or complaints you have in relation to the event.</p><p>We may also use your personal data for our legitimate interests, including dealing with any customer services you require, enforcing the terms of any other agreement between us, for regulatory and legal purposes (for example anti-money laundering), for audit purposes and to contact you about changes to this policy.</p><h3 class="text-left">Who do we share your data with?</h3> <p>We may share your personal data with any service providers, sub-contractors and agents that we may appoint to perform functions on our behalf and in accordance with our instructions, including payment providers, event ticketing providers, email communication providers, IT service providers, accountants, auditors and lawyers.</p><p>Under certain circumstances we may have to disclose your personal data under applicable laws and/or regulations, for example, as part of anti-money laundering processes or protect a third party rights, property, or safety.</p><p>We may also share your personal data in connection with, or during negotiations of, any merger, sale of assets, consolidation or restructuring, financing, or acquisition of all or a portion of our business by or into another company.</p><h3 class="text-left">Where we hold and process your personal data</h3> <p>Some or all of your personal data may be stored or transferred outside of the European Union (the EU) for any reason, including for example, if our email server is located in a country outside the EU or if any of our service providers or their servers are based outside of the EU. We shall only transfer your personal data to organisations that have provided adequate safeguards in respect of your personal data.</p><h3 class="text-left">Cookies</h3> <p>A cookie is a small text file containing a unique identification number that is transferred (through your browser) from a website to the hard drive of your computer. The cookie identifies your browser but will not let a website know any personal data about you, such as your name and/or address. These files are then used by websites to identify when users revisit that website.</p><p>Our event ticket shop uses cookies so that we can recognise you when you return and personalise your settings and preferences. Most browsers are initially set up to accept cookies. You can change your browser settings either to notify you when you have received a cookie, or to refuse to accept cookies. Please note that our event ticket shop may not operate efficiently if you refuse to accept cookies.</p><p>We also use Google Analytics to monitor how the event ticket shop is used. Google Analytics collects information anonymously and generates reports detailing information such as the number of visits to the event ticket shop, where visitors generally came from, how long they stayed on the event ticket shop, and which pages they visited. Google Analytics places several persistent cookies on your computer hard drive. These do not collect any personal data. If you do not agree to this you can disable persistent cookies in your browser. This will prevent Google Analytics from logging your visits.</p><h3 class="text-left">Security</h3> <p>We shall process your personal data in a manner that ensures appropriate security of the personal data, including protection against unauthorised or unlawful processing and against accidental loss, destruction or damage, using appropriate technical or organisational measures. All information you provide to us is stored on our secure servers. Any payment transactions are encrypted using SSL technology.</p><p>Where we have given, or you have chosen a password, you are responsible for keeping this password confidential.</p><p>However, you acknowledge that no system can be completely secure. Therefore, although we take these steps to secure your personal data, we do not promise that your personal data will always remain completely secure.</p><h3 class="text-left">Your rights</h3> <p>You have the right to obtain from us a copy of the personal data that we hold for you, and to require us to correct errors in the personal data if it is inaccurate or incomplete. You also have the right at any time to require that we delete your personal data. To exercise these rights, or any other rights you may have under applicable laws, please contact us at kalpit@broadviewinnovations.in.</p><p>Please note, we reserve the right to charge an administrative fee if your request is manifestly unfounded or excessive.</p><p>If you have any complaints in relation to this policy or otherwise in relation to our processing of your personal data, you should contact the UK supervisory authority: the Information Commissioner, see www.ico.org.uk.</p><p>Our event ticket shop may contain links to other sites of interest. Once you have used these links to leave our event ticket shop, you should note that we do not have any control over that other site. Therefore, we cannot be responsible for the protection and privacy of any information which you provide whilst visiting such sites and such sites are not governed by this policy. You should exercise caution and look at the privacy policy applicable to the site in question.</p><h3 class="text-left">Retention</h3> <p>If you register with us, we shall retain your personal data until you close your account.</p><p>If you receive marketing communications from us, we shall retain your personal data until you opt out of receiving such communications.</p><p>If you have otherwise booked a ticket with us or contacted us with a question or comment, we shall retain your personal data for 6 months following such contact to respond to any further queries you might have.</p><h3 class="text-left">General</h3> <p>If any provision of this policy is held by a court of competent jurisdiction to be invalid or unenforceable, then such provision shall be construed, as nearly as possible, to reflect the intentions of the parties and all other provisions shall remain in full force and effect.</p><p>This policy shall be governed by and construed in accordance with the law of England and Wales, and you agree to submit to the exclusive jurisdiction of the English Courts.</p><p>We may change the terms of this policy from time to time. You are responsible for regularly reviewing this policy so that you are aware of any changes to it. If you continue to use our event ticket shop after the time we state the changes will take effect, you will have accepted the changes.</p>'
    }else{
      this.generatePrivacyPolicyForm.get('orgName').markAllAsTouched();
      this.generatePrivacyPolicyForm.get('orgAddress').markAllAsTouched();
      this.generatePrivacyPolicyForm.get('orgEmail').markAllAsTouched();
      this.generatePrivacyPolicyForm.get('orgContact').markAllAsTouched();
      this.generatePrivacyPolicyForm.get('emailMarketing').markAllAsTouched();
      this.generatePrivacyPolicyForm.get('advertisingNetwork').markAllAsTouched();
      this.generatePrivacyPolicyForm.get('acceptTerm').markAllAsTouched();
    }
  }

  fnPreview(){
    this.preview = !this.preview;
  }

  
  savePolicy(){
        let privacyPolices = {
          "updatePolicy":this.htmlContent,
        }
        let requestObject = {
          "boxoffice_id"  : localStorage.getItem('boxoffice_id'),
          "option_key"    :  "privacyPolices",
          "option_value" : privacyPolices,
          "event_id" :  null,
          'json_type' : 'Y'
        }
        this.updateprivacyPolices(requestObject);
   
  }
  updateprivacyPolices(requestObject){
    this.isLoaderAdmin = true;
    this.SettingService.updateSetting(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.ErrorService.successMessage('Privacy polices Updated')
        this.dialogRef.close();
      } else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
      this.isLoaderAdmin = false;
    });

  }

  ngOnInit(): void {

  }

  onNoClick(){
    this.generatePrivacyPolicyForm.reset();
    this.dialogRef.close();
  }

}






import { Component, OnInit } from '@angular/core';
import { SettingService } from '../_services/setting.service';
import { ErrorService } from '../../../_services/error.service';

@Component({
  selector: 'app-reminders',
  templateUrl: './reminders.component.html',
  styleUrls: ['./reminders.component.scss']
})
export class RemindersComponent implements OnInit {

  isLoaderAdmin:any;
  emailReminderDays: any;
  emailReminderHours: any;
  emailReminderMinutes: any;
  totalTimeReminderEmail: any;
  Months: any;
  Days: any;
  Hours: any;
  Minutes: any;
  constructor(
    private SettingService : SettingService,
    private ErrorService : ErrorService
  ) { 
    this.getReminders();
  }

  ngOnInit(): void {
  }

  fnCancel(){
    this.getReminders();
  }

  getReminders(){
    this.isLoaderAdmin = true;
    let requestObject1 = {
      "boxoffice_id"  : localStorage.getItem('boxoffice_id'),
      "option_key"    :  "events_reminder",
      "event_id" :  'NULL',
    }
    this.SettingService.getSettingsValue(requestObject1).subscribe((response:any) => {
      if(response.data == true){
        console.log(JSON.parse(response.response))
        this.fnConvertMins(JSON.parse(response.response));
        this.emailReminderDays = this.Days;
        this.emailReminderHours = this.Hours;
        this.emailReminderMinutes = this.Minutes;
      }else if(response.data == false){
      }
      this.isLoaderAdmin = false;
    });
  }

  saveReminders(){
    this.isLoaderAdmin = true;
    let requestObject = {
      "boxoffice_id"  : localStorage.getItem('boxoffice_id'),
      "option_key"    :  "events_reminder",
      "json_type": "N",
      "option_value"    :  JSON.stringify(this.totalTimeReminderEmail),
      "event_id" :  '',
    }
    this.SettingService.updateSetting(requestObject).subscribe((response:any) => {
      if(response.data == true){
        this.ErrorService.successMessage('Privacy polices Updated')
        this.getReminders();
      } else if(response.data == false){
        this.ErrorService.errorMessage(response.response);
      }
      this.isLoaderAdmin = false;
    });
  }

  fnConvertMins(minutes) {
    let min_advance_booking_time = minutes;
    let months = (min_advance_booking_time / (30 * 24 * 60)).toString();
    this.Months = (parseInt(months)).toString();
    let RAM = min_advance_booking_time % (30 * 24 * 60);
    let days = (RAM / (24 * 60)).toString();
    this.Days = (parseInt(days)).toString();
    let RAD = RAM % (24 * 60);
    let hours = (RAD / 60).toString();
    this.Hours = (parseInt(hours)).toString();
    let RAH = (RAD % (60)).toString();
    this.Minutes = (parseInt(RAH)).toString();
  }

  fnSetStaffEmailReminderTime(event) {
    let email_reminder_days = 0; 
    let email_reminder_hours = 0;
    let email_reminder_minutes = 0;
    if (this.emailReminderDays != undefined) {
      email_reminder_days = parseInt(this.emailReminderDays) * 24 * 60;
    }
    if (this.emailReminderHours != undefined) {
      email_reminder_hours = parseInt(this.emailReminderHours) * 60;
    }
    if (this.emailReminderMinutes != undefined) {
      email_reminder_minutes = parseInt(this.emailReminderMinutes);
    }
    this.totalTimeReminderEmail = email_reminder_days + email_reminder_hours + email_reminder_minutes;
    console.log(this.totalTimeReminderEmail)
  }

}

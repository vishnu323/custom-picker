import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DateRange } from '@angular/material/datepicker';
import { subHours, subDays } from 'date-fns';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  range: FormGroup;
  showCustomButtons = false; // Initialize to false
  activeCustomClickId:string = "last-1-hour";

  constructor(private fb: FormBuilder) {
    this.range = this.fb.group({
      start: [''],
      end: [''],
    });
  }

  onCalendarOpen() {
    this.showCustomButtons = true; // Set to true when the calendar is opened
  }

  onCalendarClose() {
    this.showCustomButtons = false; // Set to false when the calendar is closed
  }

  handleDateChange() {
    // Handle date range change here
    const startValue = this.range.get('start')?.value;
    const endValue = this.range.get('end')?.value;

    console.log('Start Date:', startValue);
    console.log('End Date:', endValue);
  }
  
  handleCustomRange(duration: number) {
    const now = new Date();
    const newStartDate = subHours(now, duration);
    this.range.get('start')?.setValue(newStartDate);
    this.range.get('end')?.setValue(now);
  }

  applycssOnClick(id : string){
    const idRef = document.querySelector(`#${id}`);
  }

  clickHandler(type:string,id: string,duration : number){
    
    if(type ==="hour"){
      this.handleCustomRange(duration)
    }else if(type ==="day"){
      this.handleLastDays(duration)
    }else if(type === "custom"){
      this.clearSelection()
    }
  }

  handleLastDays(duration : number) {
    const now = new Date();
    const newStartDate = subDays(now, duration);
    this.range.get('start')?.setValue(newStartDate);
    this.range.get('end')?.setValue(now);
  }

  clearSelection() {
    this.range.get('start')?.setValue(null);
    this.range.get('end')?.setValue(null);
  }

}

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

  handleLast1Hour() {
    this.handleCustomRange(1);
  }

  handleLast2Hours() {
    this.handleCustomRange(2);
  }

  handleLast7Days() {
    const now = new Date();
    const newStartDate = subDays(now, 7);
    this.range.get('start')?.setValue(newStartDate);
    this.range.get('end')?.setValue(now);
  }

  clearSelection() {
    this.range.get('start')?.setValue(null);
    this.range.get('end')?.setValue(null);
  }

}

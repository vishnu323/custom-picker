import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDateRangePicker } from '@angular/material/datepicker';
import { subHours, subDays } from 'date-fns';
import { DatePipe } from '@angular/common';
import { OverlayOutsideClickDispatcher } from '@angular/cdk/overlay';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  range: FormGroup;
  showCustomButtons = false; // Initialize to false
  activeCustomClickId: string = 'last-1-hour';
  prevactiveCustomClickId : string ="last-1-hour"
  private selfClose: () => void;
  @ViewChild('picker') datePicker: MatDateRangePicker<Date>;
  mytime: Date = new Date();
  fromtime: Date = new Date();
  totime: Date = new Date();
  startclicked: Boolean = false;
  calenderopenmanager: Boolean = true;
  allowTimeChange: Boolean = false;
  errorMsg: string = '';

  //day picker
  dayRange: FormGroup;
  showDayCustomButtons = false; // Initialize to false
  activeDayCustomClickId: string = 'today';
  @ViewChild('myDayCustomPicker') dateDaypicker: MatDateRangePicker<Date>;
  startDayclicked: Boolean = false;

  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private changeDetectorRef: ChangeDetectorRef,
    private cdkConnectedOverlay: OverlayOutsideClickDispatcher,
    private el: ElementRef
  ) {
    this.range = this.fb.group({
      start: [''],
      end: [''],
    });

    this.dayRange = this.fb.group({
      start: [],
      end: [],
    });
  }

  updateTime(start, end) {
    this.fromtime = start;
    this.totime = end;
    this.mytime = this.fromtime;
  }
  ngOnInit() {
    const [start, end] = this.handleCustomRange(1);
    this.updateTime(start, end);
    this.attachFromtime();
    this.attachTotime();
    this.clickDayHandler('day', 'today', 0);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    // Check if the click event occurred outside the specific element (e.g., a div with a certain class)

    const customBtns = document.querySelectorAll('.custom-buttons');
    const btns: any = customBtns?.[0];

    const calendarPanes = document.querySelectorAll('.cdk-overlay-pane');
    const calendarPane: any = calendarPanes?.[0];

    const inputCheckers = document.querySelectorAll(".mat-form-field-flex");
    const inputChecker: any = inputCheckers?.[0];

    if (calendarPane && btns) {
      const startValue = this.range.get('start')?.value;
      const endValue = this.range.get('end')?.value;
      const isClickInside =
        (btns.contains(event.target) || calendarPane.contains(event.target));
        console.log("prev-state",[this.activeCustomClickId,this.prevactiveCustomClickId])
      if (!isClickInside && startValue && endValue && !inputChecker.contains(event.target)) {
        this.datePicker.close = this.selfClose;
        this.selfClose = undefined;
        this.datePicker.close();
      }
    }
  }

  onCalendarOpen() {
    this.showCustomButtons = true; // Set to true when the calendar is opened
    if (this.selfClose === null || this.selfClose === undefined) {
      this.selfClose = this.datePicker.close;
    }
    this.datePicker.close = () => {};

    // // close calendar manually on outside click
    // this.cdkConnectedOverlay._attachedOverlays[0]._keydownEvents.subscribe(() => {
    //   // restore saved close method
    //   this.datePicker.close = this.selfClose;
    //   this.selfClose = undefined;
    //   this.datePicker.close();
    // });
  }

  onDayCalendarOpen() {
    this.showDayCustomButtons = true; // Set to true when the calendar is opened
  }

  onCalendarClose() {
    this.showCustomButtons = false; // Set to false when the calendar is closed
    this.prevactiveCustomClickId = this.activeCustomClickId;
    if (
      this.calenderopenmanager &&
      this.activeCustomClickId === 'custom-range'
    ) {
      // this.datePicker.open();
    } else {
      this.calenderopenmanager = true;
    }
  }

  onDayCalendarClose() {
    this.showDayCustomButtons = false; // Set to false when the calendar is closed
  }

  handleDateRangeInputClick() {
    this.datePicker.open();
  }

  handleDateCalendarClose() {
    if (!this.range.get('end')?.value) {
      this.errorMsg = 'please select the valid range';
    } else {
      this.errorMsg = '';
      this.calenderopenmanager = false;
      this.datePicker.close = this.selfClose;
      this.selfClose = undefined;
      this.datePicker.close();
    }
  }

  handleDateCalendarNotClose() {}

  handleDayDateRangeInputClick() {
    this.dateDaypicker.open();
  }

  onTimeChange(event: any) {
    if (this.allowTimeChange) {
      if (this.range.get('start')?.value && !this.range.get('end')?.value) {
        this.fromtime = this.mytime;
        this.attachFromtime();
      }
      if (this.range.get('end')?.value) {
        this.totime = this.mytime;
        this.attachTotime();
      }
    }
  }
  handleDateChange() {
    const startValue = this.range.get('start')?.value;
    const endValue = this.range.get('end')?.value;
    if (startValue && !endValue && !this.startclicked) {
      this.activeCustomClickId = 'custom-range';
      this.allowTimeChange = true;
      this.removeElement('end-element');
      this.fromtime = this.mytime;
      this.attachFromtime();
      this.startclicked = true;
    }
    if (startValue && endValue) {
      this.errorMsg = '';
      this.totime = this.mytime;
      this.attachTotime();
      this.startclicked = false;
    }
  }

  handleDayDateChange() {
    const startValue = this.dayRange.get('start')?.value;
    const endValue = this.dayRange.get('end')?.value;
    if (startValue && !endValue && !this.startDayclicked) {
      this.activeDayCustomClickId = 'custom-range';
      this.startDayclicked = true;
    }
    if (startValue && endValue) {
      this.enableEndDate();
      this.startDayclicked = false;
    }
  }

  handleCustomRange(duration: number) {
    const now = new Date();
    const newStartDate = subHours(now, duration);
    this.range.get('start')?.setValue(newStartDate);
    this.range.get('end')?.setValue(now);
    return [newStartDate, now];
  }

  removeElement(id) {
    const ele = document.querySelector(`#${id}`);
    if (ele) {
      ele.remove();
    }
  }

  formatTime(date: Date): string {
    return this.datePipe.transform(date, 'h:mm a');
  }

  attachFromtime() {
    const startid = 'start-element';
    const startRef = document.querySelector(
      '.calendar .mat-date-range-input-start-wrapper'
    );
    this.removeElement(startid);
    const startelement = document.createElement('div');
    startelement.setAttribute('id', startid);
    startelement.innerText = this.formatTime(this.fromtime);
    startRef.appendChild(startelement);
  }

  attachTotime() {
    const endid = 'end-element';
    const endRef = document.querySelector(
      '.calendar .mat-date-range-input-end-wrapper'
    );
    this.removeElement(endid);
    const endelement = document.createElement('div');
    endelement.setAttribute('id', endid);
    endelement.innerText = this.formatTime(this.totime);
    endRef.appendChild(endelement);
  }

  clickHandler(type: string, id: string, duration: number) {
    this.activeCustomClickId = id;
    if (type === 'hour') {
      this.allowTimeChange = false;
      const [start, end] = this.handleCustomRange(duration);
      this.updateTime(start, end);
      this.attachFromtime();
      this.attachTotime();
    } else if (type === 'day') {
      this.allowTimeChange = false;
      const [start, end] = this.handleLastDays(duration);
      this.updateTime(start, end);
      this.attachFromtime();
      this.attachTotime();
    } else if (type === 'custom') {
      this.allowTimeChange = true;
      this.removeElement('start-element');
      this.removeElement('end-element');
      this.clearSelection();
    }
  }

  disableEndDate() {
    const endRef: any = document.querySelector(
      '.day-calendar .mat-date-range-input-end-wrapper'
    );

    const seperator: any = document.querySelector(
      '.day-calendar .mat-date-range-input-separator'
    );
    if (endRef) {
      endRef.style.display = 'none';
    }
    if (seperator) {
      seperator.style.display = 'none';
    }
  }

  enableEndDate() {
    const endRef: any = document.querySelector(
      '.day-calendar .mat-date-range-input-end-wrapper'
    );
    const seperator: any = document.querySelector(
      '.day-calendar .mat-date-range-input-separator'
    );
    if (endRef) {
      endRef.style.display = 'block';
    }
    if (seperator) {
      seperator.style.display = 'block';
    }
  }

  handleEndDate(id: string) {
    if (id === 'today' || id === 'yesterday') {
      this.disableEndDate();
    } else {
      this.enableEndDate();
    }
  }
  clickDayHandler(type: string, id: string, duration: number) {
    this.activeDayCustomClickId = id;
    this.handleEndDate(id);
    if (type === 'day') {
      const [start, end] = this.handleDayLastDays(duration);
    } else if (type === 'custom') {
      this.clearDaySelection();
    }
  }

  handleLastDays(duration: number) {
    const now = new Date();
    const newStartDate = subDays(now, duration);
    this.range.get('start')?.setValue(newStartDate);
    this.range.get('end')?.setValue(now);
    return [newStartDate, now];
  }

  handleDayLastDays(duration: number) {
    const now = new Date();
    const newStartDate = subDays(now, duration);
    this.dayRange.get('start')?.setValue(newStartDate);
    this.dayRange.get('end')?.setValue(now);
    return [newStartDate, now];
  }

  clearSelection() {
    this.range.get('start')?.setValue(null);
    this.range.get('end')?.setValue(null);
  }

  clearDaySelection() {
    this.dayRange.get('start')?.setValue(null);
    this.dayRange.get('end')?.setValue(null);
  }
}

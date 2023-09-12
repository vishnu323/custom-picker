import { Component,ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDateRangePicker } from '@angular/material/datepicker';
import { subHours, subDays } from 'date-fns';
import { DatePipe } from '@angular/common'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  range: FormGroup;
  showCustomButtons = false; // Initialize to false
  activeCustomClickId:string = "last-1-hour";
  @ViewChild('picker') datePicker: MatDateRangePicker<Date>;
  mytime:Date =new Date()
  fromtime : Date = new Date();
  totime:Date = new Date();

  constructor(private fb: FormBuilder,private datePipe: DatePipe) {
    this.range = this.fb.group({
      start: [''],
      end: [''],
    });
  }
  
  updateTime(start,end){
    this.fromtime = start;
    this.totime =  end
    this.mytime = this.fromtime
  }
  ngOnInit() {
    const [start,end] = this.handleCustomRange(1);
    this.updateTime(start,end)
    this.attachFromtime()
    this.attachTotime()
  }

  onCalendarOpen() {
    this.showCustomButtons = true; // Set to true when the calendar is opened
  }

  onCalendarClose() {
    this.showCustomButtons = false; // Set to false when the calendar is closed
  }

  handleDateRangeInputClick(){
    this.datePicker.open();
  }

  onTimeChange(event:any){

  }
  handleDateChange() {
    
    const startValue = this.range.get('start')?.value;
    const endValue = this.range.get('end')?.value;
    if(startValue){
      this.activeCustomClickId = "custom-range"
      this.attachFromtime();
      this.fromtime = this.mytime;
    }
    if(endValue){
      this.attachTotime()
      this.totime = this.mytime;
    }
  }
  
  handleCustomRange(duration: number) {
    const now = new Date();
    const newStartDate = subHours(now, duration);
    this.range.get('start')?.setValue(newStartDate);
    this.range.get('end')?.setValue(now);
    return [newStartDate,now];
  }
  
  removeElement(id){
    const ele = document.querySelector(`#${id}`);
    if(ele){
      ele.remove();
    }
  }

  formatTime(date: Date): string {
    return this.datePipe.transform(date, 'h:mm a');
  }

  attachFromtime(){
    const startid = 'start-element';
    const startRef = document.querySelector('.mat-date-range-input-start-wrapper');
    this.removeElement(startid);
    const startelement = document.createElement("div");
    startelement.setAttribute("id",startid)
    startelement.innerText = this.formatTime(this.fromtime);
    startRef.appendChild(startelement)
  }

  attachTotime(){
    const endid = 'end-element';
    const endRef = document.querySelector('.mat-date-range-input-end-wrapper');
    this.removeElement(endid)
    const endelement = document.createElement("div");
    endelement.setAttribute("id",endid)
    endelement.innerText = this.formatTime(this.totime);
    endRef.appendChild(endelement)
  }
  

  clickHandler(type:string,id: string,duration : number){
    this.activeCustomClickId = id;
    if(type ==="hour"){
      const [start,end] = this.handleCustomRange(duration)
      this.updateTime(start,end)
      this.attachFromtime()
      this.attachTotime()
    }else if(type ==="day"){
      const [start,end] = this.handleLastDays(duration)
      this.updateTime(start,end)
    }else if(type === "custom"){
      this.removeElement('start-element');
      this.removeElement('end-element');
      this.clearSelection()
    }
  }

  handleLastDays(duration : number) {
    const now = new Date();
    const newStartDate = subDays(now, duration);
    this.range.get('start')?.setValue(newStartDate);
    this.range.get('end')?.setValue(now);
    return [newStartDate,now];
  }

  clearSelection() {
    this.range.get('start')?.setValue(null);
    this.range.get('end')?.setValue(null);
  }

}

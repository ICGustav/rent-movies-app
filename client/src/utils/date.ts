import {Component, Input, Output, EventEmitter, OnInit, Directive} from 'angular2/core';
import {NgFor, NgModel} from 'angular2/common';

@Directive({
    selector: 'input[type=datetime-local]',
    events: ['dateChange'],
    host: {
        '[value]': '_date',
        '(change)': 'onDateChange($event.target.value)'
    }
})
export class MyDate {
    @Input() set date(d: Date) {
        this._date = this.toDateString(d);
        console.log(this._date);

    }
    @Output() dateChange: EventEmitter<Date>;
    private _date: string;
    constructor() {
        this.date = new Date(new Date().setHours(0, 0, 0, 0));
        this.dateChange = new EventEmitter();
    }

    private toDateString(date: Date): string {
        return (date.getFullYear().toString() + '-'
         + ('0' + (date.getMonth() + 1)).slice(-2) + '-'
         + ('0' + (date.getDate())).slice(-2))
         + 'T' + date.toTimeString().slice(0, 5);
    }
    private parseDateString(date: string): Date {
       date = date.replace('T', '-');
       let parts = date.split('-');
       let timeParts = parts[3].split(':');

      // new Date(year, month [, day [, hours[, minutes[, seconds[, ms]]]]])
       return new Date( +parts[0], (+parts[1]) - 1, +parts[2],
                        +timeParts[0], +timeParts[1]); // Note: months are 0-based

    }

    private onDateChange(value: string): void {
        if (value !== this._date) {

            var parsedDate = this.parseDateString(value);

            // check if date is valid first
            if (parsedDate.getTime() !== NaN) {
               this._date = value;
               this.dateChange.emit(parsedDate);
            }
        }
    }
}

import {ChangeDetectionStrategy, Component, EventEmitter, Output} from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { CustomDateAdapter } from './customDateAdapter';


export const DD_MM_YYYY_FORMAT = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-datepicker',
  imports: [
    MatFormFieldModule, 
    MatDatepickerModule, 
    ReactiveFormsModule,
    MatInputModule,
  ],
  templateUrl: './datepicker.html',
  styleUrl: './custom-theme.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: DD_MM_YYYY_FORMAT }
  ]
})
export class Datepicker {
  @Output() rangeChange = new EventEmitter<void>();

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  constructor() {
    this.range.valueChanges.subscribe(() => this.rangeChange.emit());
  }

  // getSelectedDates() {
  //   return {
  //     start: this.range.value.start,
  //     end: this.range.value.end
  //   };
  // }
}
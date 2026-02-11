import { AbstractControl, ValidationErrors } from '@angular/forms';

export class CustomValidators {
  static minDateToday(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const value = control.value;
    const selectedDate = new Date(value + 'T00:00:00');

    const dateToCheck = new Date(control.value);

    const [year, month, day] = control.value.split('-').map(Number);
    const dateLocal = new Date(year, month - 1, day);
    dateLocal.setHours(0, 0, 0, 0);

    return dateLocal >= today ? null : { dateInvalid: true };
  }
}

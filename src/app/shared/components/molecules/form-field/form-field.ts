import {
  Component,
  input,
  computed,
  inject,
  signal,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ReactiveFormsModule, FormControl, ControlValueAccessor, NgControl } from '@angular/forms';
import { LabelComponent } from '../../atoms/label/label';
import { InputComponent } from '../../atoms/input/input';
import { ErrorComponent } from '../../atoms/error/error';
import { toObservable, toSignal, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { startWith, map, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [ReactiveFormsModule, LabelComponent, InputComponent, ErrorComponent],
  templateUrl: './form-field.html',
  styleUrl: './form-field.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormFieldComponent implements ControlValueAccessor {
  label = input.required<string>();
  placeholder = input<string>('');
  type = input<string>('text');
  errorMessages = input<Record<string, string>>({
    required: 'Campo requerido',
    minlength: 'Longitud insuficiente',
    default: 'Valor no válido',
  });
  loading = input<boolean | undefined>(undefined);

  readonly ngControl = inject(NgControl, { optional: true, self: true });
  private cdr = inject(ChangeDetectorRef);

  internalControl = new FormControl();

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }

    this.internalControl.valueChanges.pipe(takeUntilDestroyed()).subscribe((val) => {
      this.onChange(val);
      this.onTouched();
    });
  }

  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(value: any): void {
    this.internalControl.setValue(value, { emitEvent: false });
    this.cdr.markForCheck();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.internalControl.disable() : this.internalControl.enable();
    this.cdr.markForCheck();
  }

  private reactiveTrigger = toSignal(
    toObservable(signal(this.ngControl)).pipe(
      switchMap((ngCtrl) => {
        if (ngCtrl?.control) {
          return ngCtrl.control.events.pipe(startWith(null));
        }
        return of(null);
      }),
      map(() => Date.now()),
      takeUntilDestroyed(),
    ),
    { initialValue: Date.now() },
  );

  isInvalid = computed(() => {
    this.reactiveTrigger();
    const control = this.ngControl?.control;
    return !!(control && control.invalid && (control.dirty || control.touched));
  });

  isLoading = computed(() => {
    if (this.loading() !== undefined) return this.loading()!;
    this.reactiveTrigger();
    return this.ngControl?.control?.status === 'PENDING';
  });

  displayError = computed(() => {
    this.reactiveTrigger();
    const control = this.ngControl?.control;
    if (!control || !control.errors || !(control.dirty || control.touched)) return null;

    const firstErrorKey = Object.keys(control.errors)[0];
    return this.errorMessages()[firstErrorKey] || this.errorMessages()['default'] || 'Error';
  });
}

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormFieldComponent } from './form-field';
import { ReactiveFormsModule, FormControl, Validators, FormGroup } from '@angular/forms';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, FormFieldComponent],
  template: `
    <form [formGroup]="form">
      <app-form-field label="ID" formControlName="id"></app-form-field>
    </form>
  `,
})
class TestHostComponent {
  form = new FormGroup({
    id: new FormControl('', Validators.required),
  });
}

describe('FormFieldComponent (CVA)', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormFieldComponent, ReactiveFormsModule, TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should synchronize value from parent to internal control', () => {
    hostComponent.form.get('id')?.setValue('Hello');
    fixture.detectChanges();

    const formField = fixture.debugElement.query(
      (c) => c.componentInstance instanceof FormFieldComponent,
    ).componentInstance;
    expect(formField.internalControl.value).toBe('Hello');
  });

  it('should synchronize value from internal control to parent', () => {
    const formField = fixture.debugElement.query(
      (c) => c.componentInstance instanceof FormFieldComponent,
    ).componentInstance;
    formField.internalControl.setValue('World');
    fixture.detectChanges();

    expect(hostComponent.form.get('id')?.value).toBe('World');
  });

  it('should reflect error state from parent control', () => {
    const control = hostComponent.form.get('id')!;
    control.markAsTouched();
    fixture.detectChanges();

    const formField = fixture.debugElement.query(
      (c) => c.componentInstance instanceof FormFieldComponent,
    ).componentInstance;
    expect(formField.isInvalid()).toBe(true);

    const errorElement = fixture.nativeElement.querySelector('app-error');
    expect(errorElement).toBeTruthy();
  });

  it('should work without ngControl', () => {
    const standaloneFixture = TestBed.createComponent(FormFieldComponent);
    standaloneFixture.componentRef.setInput('label', 'Standalone');
    standaloneFixture.detectChanges();
    expect(standaloneFixture.componentInstance).toBeTruthy();
    expect(standaloneFixture.componentInstance.isInvalid()).toBe(false);
  });
});

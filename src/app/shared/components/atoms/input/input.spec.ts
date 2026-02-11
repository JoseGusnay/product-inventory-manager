import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputComponent } from './input';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

describe('InputComponent', () => {
  let component: InputComponent;
  let fixture: ComponentFixture<InputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputComponent, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(InputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have error class when hasError is true', () => {
    fixture.componentRef.setInput('hasError', true);
    fixture.detectChanges();
    const inputElement = fixture.nativeElement.querySelector('input');
    expect(inputElement.classList).toContain('a-input--error');
  });

  it('should update value on input change', () => {
    const inputElement = fixture.nativeElement.querySelector('input');
    inputElement.value = 'New Value';
    inputElement.dispatchEvent(new Event('input'));
    expect(component.value()).toBe('New Value');
  });

  it('should call onTouched on blur', () => {
    const spy = jest.spyOn(component, 'onTouched');
    const inputElement = fixture.nativeElement.querySelector('input');
    inputElement.dispatchEvent(new Event('blur'));
    expect(spy).toHaveBeenCalled();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button';
import { CommonModule } from '@angular/common';

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonComponent, CommonModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.componentRef.setInput('label', 'Test Button');
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should emit click event when not disabled', () => {
    fixture.componentRef.setInput('label', 'Test Button');
    fixture.componentRef.setInput('disabled', false);
    fixture.detectChanges();

    const emitSpy = jest.spyOn(component.clicked, 'emit');
    const event = new MouseEvent('click');
    component.onClick(event);

    expect(emitSpy).toHaveBeenCalledWith(event);
  });

  it('should not emit click event when disabled', () => {
    fixture.componentRef.setInput('label', 'Test Button');
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const emitSpy = jest.spyOn(component.clicked, 'emit');
    component.onClick(new MouseEvent('click'));

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should reflect input properties correctly', () => {
    fixture.componentRef.setInput('label', 'Dynamic Label');
    fixture.componentRef.setInput('variant', 'secondary');
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    expect(component.label()).toBe('Dynamic Label');
    expect(component.variant()).toBe('secondary');
    expect(component.loading()).toBe(true);

    const buttonElement = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(buttonElement.classList.contains('a-button--secondary')).toBe(true);
    expect(buttonElement.disabled).toBe(true); // disabled || loading
  });
});

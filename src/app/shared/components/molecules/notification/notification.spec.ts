import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NotificationComponent } from './notification';
import { NotificationService } from '../../../../core/services/notification.service';
import { By } from '@angular/platform-browser';

describe('NotificationComponent', () => {
  let component: NotificationComponent;
  let fixture: ComponentFixture<NotificationComponent>;
  let service: NotificationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationComponent],
      providers: [NotificationService],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(NotificationService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display notification when service shows one', () => {
    service.success('Test toast');
    fixture.detectChanges();

    const toastElement = fixture.debugElement.query(By.css('.m-notification'));
    expect(toastElement).toBeTruthy();
    expect(toastElement.nativeElement.textContent).toContain('Test toast');
    expect(toastElement.nativeElement.classList).toContain('m-notification--success');
  });

  it('should remove notification when close button is clicked', () => {
    service.error('Error toast');
    fixture.detectChanges();

    const closeBtn = fixture.debugElement.query(By.css('.m-notification__close'));
    closeBtn.nativeElement.click();
    fixture.detectChanges();

    const toastElement = fixture.debugElement.query(By.css('.m-notification'));
    expect(toastElement).toBeFalsy();
  });

  it('should handle multiple notifications', () => {
    service.success('Success');
    service.error('Error');
    fixture.detectChanges();

    const toasts = fixture.debugElement.queryAll(By.css('.m-notification'));
    expect(toasts.length).toBe(2);
  });
});

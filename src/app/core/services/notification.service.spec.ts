import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add success notification', () => {
    service.success('Success message');
    const notifications = service.notifications$();
    expect(notifications.length).toBe(1);
    expect(notifications[0].message).toBe('Success message');
    expect(notifications[0].type).toBe('success');
  });

  it('should add error notification', () => {
    service.error('Error message');
    const notifications = service.notifications$();
    expect(notifications.length).toBe(1);
    expect(notifications[0].message).toBe('Error message');
    expect(notifications[0].type).toBe('error');
  });

  it('should auto-remove notification after duration', fakeAsync(() => {
    service.show('Test message', 'info', 1000);
    expect(service.notifications$().length).toBe(1);

    tick(1000);
    expect(service.notifications$().length).toBe(0);
  }));

  it('should remove notification manually', () => {
    service.success('Msg');
    const id = service.notifications$()[0].id;
    service.remove(id);
    expect(service.notifications$().length).toBe(0);
  });
});

import { ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { ModalComponent } from './modal';
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  imports: [ModalComponent],
  template: `<app-modal [isOpen]="isOpen" [title]="title" (closed)="onClosed()"></app-modal>`,
})
class TestHostComponent {
  isOpen = false;
  title = 'Test Modal';
  onClosed() {}
}

describe('ModalComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let component: ModalComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, ModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    component = fixture.debugElement.query(By.directive(ModalComponent)).componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should become visible when isOpen is true', fakeAsync(() => {
    host.isOpen = true;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect(component.isVisible()).toBe(true);
    expect(fixture.debugElement.query(By.css('.m-modal'))).toBeTruthy();
  }));

  it('should emit confirmed when handleConfirm is called', () => {
    const confirmSpy = jest.spyOn(component.confirmed, 'emit');
    component.handleConfirm();
    expect(confirmSpy).toHaveBeenCalled();
  });

  it('should emit closed after animation when handleClose is called', fakeAsync(() => {
    host.isOpen = true;
    fixture.detectChanges();
    tick();

    const closedSpy = jest.spyOn(host, 'onClosed');
    component.handleClose();

    tick(500);
    fixture.detectChanges();
    flush();
    expect(closedSpy).toHaveBeenCalled();
  }));

  it('should close when overlay is clicked', fakeAsync(() => {
    host.isOpen = true;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const closeSpy = jest.spyOn(component, 'handleClose');
    const overlay = fixture.debugElement.query(By.css('.m-modal-overlay'));
    overlay.nativeElement.click();

    expect(closeSpy).toHaveBeenCalled();
    tick(500);
    fixture.detectChanges();
    flush();
  }));

  it('should not close when modal content is clicked (stop propagation)', fakeAsync(() => {
    host.isOpen = true;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const closeSpy = jest.spyOn(component, 'handleClose');
    const modal = fixture.debugElement.query(By.css('.m-modal'));
    modal.nativeElement.click();

    expect(closeSpy).not.toHaveBeenCalled();
  }));
});

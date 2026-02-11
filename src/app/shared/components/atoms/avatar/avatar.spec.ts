import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AvatarComponent } from './avatar';

describe('AvatarComponent', () => {
  let component: AvatarComponent;
  let fixture: ComponentFixture<AvatarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvatarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AvatarComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate initials for single name', () => {
    fixture.componentRef.setInput('name', 'Product');
    fixture.detectChanges();
    expect(component.initials()).toBe('PR');
  });

  it('should calculate initials for multiple names', () => {
    fixture.componentRef.setInput('name', 'Product Name Extra');
    fixture.detectChanges();
    expect(component.initials()).toBe('PN');
  });

  it('should return "?" for empty name', () => {
    fixture.componentRef.setInput('name', '');
    fixture.detectChanges();
    expect(component.initials()).toBe('?');
  });

  it('should show initials on error', () => {
    fixture.componentRef.setInput('src', 'invalid-image.png');
    fixture.detectChanges();

    expect(component.showInitials()).toBe(false);
    component.onError();
    expect(component.showInitials()).toBe(true);

    fixture.detectChanges();
    const initialsElement = fixture.nativeElement.querySelector('.a-avatar__initials');
    expect(initialsElement).toBeTruthy();
  });

  it('should show image when src is provided and no error', () => {
    fixture.componentRef.setInput('src', 'valid-image.png');
    fixture.detectChanges();

    const imgElement = fixture.nativeElement.querySelector('img');
    expect(imgElement).toBeTruthy();
    expect(imgElement.src).toContain('valid-image.png');
  });
});

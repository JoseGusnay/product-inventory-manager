import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkeletonComponent } from './skeleton';

describe('SkeletonComponent', () => {
  let component: SkeletonComponent;
  let fixture: ComponentFixture<SkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkeletonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SkeletonComponent);
    component = fixture.componentInstance;
  });

  it('should create and apply default styles', () => {
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('.a-skeleton');
    expect(element.style.width).toBe('100%');
    expect(element.style.height).toBe('20px');
  });

  it('should apply custom dimensions from inputs', () => {
    fixture.componentRef.setInput('width', '200px');
    fixture.componentRef.setInput('height', '50px');
    fixture.componentRef.setInput('borderRadius', '50%');
    fixture.detectChanges();

    const element = fixture.nativeElement.querySelector('.a-skeleton');
    expect(element.style.width).toBe('200px');
    expect(element.style.height).toBe('50px');
    expect(element.style.borderRadius).toBe('50%');
  });
});

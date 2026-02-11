import { Component, ElementRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TooltipDirective } from './tooltip.directive';
import { By } from '@angular/platform-browser';

@Component({
  standalone: true,
  imports: [TooltipDirective],
  template: `<div
    [appTooltip]="text"
    style="width: 100px; height: 50px; position: absolute; top: 100px; left: 100px;"
  >
    Host
  </div>`,
})
class TestComponent {
  text = 'Test Tooltip';
}

describe('TooltipDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let divEl: ElementRef;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent, TooltipDirective],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    divEl = fixture.debugElement.query(By.css('div'));
  });

  afterEach(() => {
    // Cleanup any leaked tooltips in body
    const tooltips = document.querySelectorAll('.custom-tooltip');
    tooltips.forEach((t) => (t as any).remove());
  });

  it('should create tooltip on mouseenter', () => {
    divEl.triggerEventHandler('mouseenter', null);
    fixture.detectChanges();

    const tooltip = document.querySelector('.custom-tooltip');
    expect(tooltip).toBeTruthy();
    expect(tooltip?.textContent).toBe('Test Tooltip');
  });

  it('should remove tooltip on mouseleave', () => {
    divEl.triggerEventHandler('mouseenter', null);
    divEl.triggerEventHandler('mouseleave', null);
    fixture.detectChanges();

    const tooltip = document.querySelector('.custom-tooltip');
    expect(tooltip).toBeFalsy();
  });

  it('should not show tooltip if text is empty', () => {
    component.text = '';
    fixture.detectChanges();

    divEl.triggerEventHandler('mouseenter', null);
    fixture.detectChanges();

    const tooltip = document.querySelector('.custom-tooltip');
    expect(tooltip).toBeFalsy();
  });

  it('should remove tooltip on destroy', () => {
    divEl.triggerEventHandler('mouseenter', null);
    fixture.detectChanges();
    expect(document.querySelector('.custom-tooltip')).toBeTruthy();

    fixture.destroy();
    expect(document.querySelector('.custom-tooltip')).toBeFalsy();
  });

  it('should apply fixed and z-index styles in show()', () => {
    divEl.triggerEventHandler('mouseenter', null);
    fixture.detectChanges();

    const tooltip = document.querySelector('.custom-tooltip') as HTMLElement;
    expect(tooltip.style.position).toBe('fixed');
    expect(tooltip.style.zIndex).toBe('10000');
  });
});

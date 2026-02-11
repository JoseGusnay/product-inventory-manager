import { Directive, Input, ElementRef, HostListener, Renderer2, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appTooltip]',
  standalone: true,
})
export class TooltipDirective implements OnDestroy {
  @Input('appTooltip') tooltipText = '';
  private tooltipElement: HTMLElement | null = null;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {}

  @HostListener('mouseenter') onMouseEnter() {
    if (!this.tooltipText) return;
    this.show();
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.hide();
  }

  ngOnDestroy() {
    this.hide();
  }

  private show() {
    this.tooltipElement = this.renderer.createElement('div');
    this.renderer.addClass(this.tooltipElement, 'custom-tooltip');
    const text = this.renderer.createText(this.tooltipText);
    this.renderer.appendChild(this.tooltipElement, text);
    this.renderer.appendChild(document.body, this.tooltipElement);

    const hostPos = this.el.nativeElement.getBoundingClientRect();
    const tooltipPos = this.tooltipElement!.getBoundingClientRect();

    const top = hostPos.top - tooltipPos.height - 10;
    const left = hostPos.left + (hostPos.width - tooltipPos.width) / 2;

    this.renderer.setStyle(this.tooltipElement, 'top', `${top}px`);
    this.renderer.setStyle(this.tooltipElement, 'left', `${left}px`);
    this.renderer.setStyle(this.tooltipElement, 'position', 'fixed');
    this.renderer.setStyle(this.tooltipElement, 'z-index', '10000');
  }

  private hide() {
    if (this.tooltipElement) {
      this.renderer.removeChild(document.body, this.tooltipElement);
      this.tooltipElement = null;
    }
  }
}

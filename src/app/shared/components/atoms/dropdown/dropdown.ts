import {
  Component,
  input,
  output,
  signal,
  HostListener,
  ChangeDetectionStrategy,
  ElementRef,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export interface DropdownOption {
  label: string;
  value: string;
  icon?: string;
}

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="a-dropdown" [class.s-top]="dropdownPosition() === 'top'">
      <button class="a-dropdown__trigger" (click)="toggle($event)">⋮</button>
      @if (isOpen()) {
        <div class="a-dropdown__menu shadow-card" [ngStyle]="dropdownStyle()">
          @for (option of options(); track option.value) {
            <button class="a-dropdown__item" (click)="select(option, $event)">
              {{ option.label }}
            </button>
          }
        </div>
      }
    </div>
  `,
  styles: [
    `
      @use '../../../../../styles/variables' as v;

      .a-dropdown {
        position: relative;
        display: inline-block;

        &__trigger {
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          color: #666;
          padding: 4px 8px;
          border-radius: 4px;

          &:hover {
            background-color: #eee;
          }
        }

        &__menu {
          background: white;
          border: 1px solid #eee;
          border-radius: 4px;
          display: flex;
          flex-direction: column;
          padding: 4px 0;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        &__item {
          background: none;
          border: none;
          padding: 10px 16px;
          text-align: left;
          cursor: pointer;
          font-size: 14px;
          color: #333;
          transition: background 0.2s;

          &:hover {
            background-color: #f5f7fa;
          }
        }
      }

      .shadow-card {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownComponent {
  options = input<DropdownOption[]>([]);
  isOpen = input<boolean>(false);

  optionSelected = output<DropdownOption>();
  toggled = output<boolean>();

  dropdownPosition = signal<'bottom' | 'top'>('bottom');
  private elementRef = inject(ElementRef);

  toggle(event: MouseEvent) {
    event.stopPropagation();

    if (!this.isOpen()) {
      this.calculatePosition();
    }

    this.toggled.emit(!this.isOpen());
  }

  select(option: DropdownOption, event: MouseEvent) {
    event.stopPropagation();
    this.optionSelected.emit(option);
  }

  @HostListener('document:click')
  close() {
    if (this.isOpen()) {
      this.toggled.emit(false);
    }
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event) {
    if (this.isOpen()) {
      this.toggled.emit(false);
    }
  }

  @HostListener('window:resize')
  onResize() {
    if (this.isOpen()) {
      this.toggled.emit(false);
    }
  }

  dropdownStyle = signal<{ [key: string]: string }>({});

  private calculatePosition() {
    const element = this.elementRef.nativeElement;
    const trigger = element.querySelector('.a-dropdown__trigger');
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const menuWidth = 150;
    const menuHeightEstimate = 100;

    const style: { [key: string]: string } = {
      position: 'fixed',
      'min-width': '120px',
      'z-index': '10000',
    };

    let left = rect.right - menuWidth;

    if (left < 10) {
      left = rect.left;
    }

    style['left'] = `${left}px`;

    if (windowHeight - rect.bottom < menuHeightEstimate) {
      style['bottom'] = `${windowHeight - rect.top + 4}px`;
      style['top'] = 'auto';
      style['transform-origin'] = 'bottom right';
    } else {
      style['top'] = `${rect.bottom + 4}px`;
      style['bottom'] = 'auto';
      style['transform-origin'] = 'top right';
    }

    this.dropdownStyle.set(style);

    this.dropdownPosition.set(style['bottom'] && style['bottom'] !== 'auto' ? 'top' : 'bottom');
  }
}

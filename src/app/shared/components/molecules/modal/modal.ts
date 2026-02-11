import { Component, input, output, ChangeDetectionStrategy, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../atoms/button/button';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    @if (isVisible()) {
      <div
        class="m-modal-overlay"
        [class.m-modal-overlay--closing]="isClosing()"
        (click)="handleClose()"
      >
        <div
          class="m-modal shadow-card"
          [class.m-modal--closing]="isClosing()"
          (click)="$event.stopPropagation()"
        >
          <header class="m-modal__header">
            @if (title()) {
              <h3 class="m-modal__title">{{ title() }}</h3>
            }
            <button class="close-btn" (click)="handleClose()">×</button>
          </header>

          <main class="m-modal__content">
            <ng-content></ng-content>
          </main>

          <footer class="m-modal__footer">
            <app-button label="Cancelar" variant="secondary" (clicked)="handleClose()"></app-button>
            <app-button
              [label]="confirmLabel()"
              variant="primary"
              [loading]="isLoading()"
              (clicked)="handleConfirm()"
            ></app-button>
          </footer>
        </div>
      </div>
    }
  `,
  styles: [
    `
      @use '../../../../../styles/variables' as v;

      .m-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.4);
        backdrop-filter: blur(2px);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2000;
        animation: fadeIn 0.2s ease-out forwards;

        &--closing {
          animation: fadeOut 0.2s ease-in forwards;
        }
      }

      .m-modal {
        background: white;
        border-radius: 8px;
        width: 90%;
        max-width: 450px;
        padding: 0;
        overflow: hidden;
        transform: translateY(0);
        animation: slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;

        &--closing {
          animation: slideDown 0.2s ease-in forwards;
        }

        &__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 24px;
          border-bottom: 1px solid #f0f0f0;

          .m-modal__title {
            margin: 0;
            font-size: 18px;
            font-weight: 600;
            color: #333;
          }

          .close-btn {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #bbb;
            line-height: 1;
            transition: color 0.2s;
            &:hover {
              color: #666;
            }
          }
        }

        &__content {
          padding: 0 40px 30px;
          text-align: center;
          font-size: 16px;
          color: #444;
          font-weight: 500;
          line-height: 1.5;
        }

        &__footer {
          display: flex;
          gap: 16px;
          padding: 20px 40px 40px;
          justify-content: center;
          border-top: 1px solid #f0f0f0;

          app-button {
            flex: 1;
          }
        }
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      @keyframes fadeOut {
        from {
          opacity: 1;
        }
        to {
          opacity: 0;
        }
      }

      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(20px) scale(0.95);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      @keyframes slideDown {
        from {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
        to {
          opacity: 0;
          transform: translateY(10px) scale(0.98);
        }
      }

      .shadow-card {
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalComponent {
  isOpen = input<boolean>(false);
  title = input<string>('');
  confirmLabel = input<string>('Confirmar');
  isLoading = input<boolean>(false);

  confirmed = output<void>();
  closed = output<void>();

  isVisible = signal(false);
  isClosing = signal(false);

  constructor() {
    effect(
      () => {
        if (this.isOpen()) {
          this.isVisible.set(true);
          this.isClosing.set(false);
        } else if (this.isVisible()) {
          this.animateAndClose(() => {});
        }
      },
      { allowSignalWrites: true },
    );
  }

  handleConfirm() {
    this.confirmed.emit();
  }

  handleClose() {
    this.animateAndClose(() => this.closed.emit());
  }

  private animateAndClose(callback: () => void) {
    this.isClosing.set(true);
    setTimeout(() => {
      this.isVisible.set(false);
      this.isClosing.set(false);
      callback();
    }, 200);
  }
}

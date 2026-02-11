import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="m-notification-container">
      @for (note of notificationService.notifications$(); track note.id) {
        <div class="m-notification" [ngClass]="'m-notification--' + note.type">
          <span class="m-notification__message">{{ note.message }}</span>
          <button class="m-notification__close" (click)="notificationService.remove(note.id)">
            &times;
          </button>
        </div>
      }
    </div>
  `,
  styles: [
    `
      @use '../../../../../styles/variables' as v;

      .m-notification-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 11000;
        display: flex;
        flex-direction: column;
        gap: 12px;
        pointer-events: none;
      }

      .m-notification {
        pointer-events: auto;
        min-width: 300px;
        max-width: 450px;
        padding: 12px 16px;
        border-radius: 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        border: 1px solid transparent;

        &--success {
          background-color: v.$notification-success-bg;
          color: v.$notification-success-text;
          border-color: rgba(v.$notification-success-text, 0.1);
        }
        &--error {
          background-color: v.$notification-error-bg;
          color: v.$notification-error-text;
          border-color: rgba(v.$notification-error-text, 0.1);
        }
        &--warning {
          background-color: v.$notification-warning-bg;
          color: v.$notification-warning-text;
          border-color: rgba(v.$notification-warning-text, 0.1);
        }
        &--info {
          background-color: v.$notification-info-bg;
          color: v.$notification-info-text;
          border-color: rgba(v.$notification-info-text, 0.1);
        }

        &__message {
          font-size: 14px;
          font-weight: 500;
          line-height: 1.4;
        }

        &__close {
          background: none;
          border: none;
          color: inherit;
          font-size: 22px;
          line-height: 1;
          cursor: pointer;
          padding: 0 0 0 12px;
          opacity: 0.5;
          display: flex;
          align-items: center;
          &:hover {
            opacity: 1;
          }
        }
      }

      @keyframes slideIn {
        from {
          transform: translateX(30px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `,
  ],
})
export class NotificationComponent {
  notificationService = inject(NotificationService);
}

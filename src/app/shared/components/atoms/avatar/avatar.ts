import { Component, input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="a-avatar" [class.a-avatar--initials]="showInitials()">
      @if (src() && !showInitials()) {
        <img [src]="src()" [alt]="name()" (error)="onError()" />
      } @else {
        <span class="a-avatar__initials">{{ initials() }}</span>
      }
    </div>
  `,
  styles: [
    `
      .a-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #eee;
        flex-shrink: 0;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        &--initials {
          background-color: #e8eaf6;
          color: #1a237e;
          font-weight: 600;
          font-size: 14px;
          border: 1px solid #c5cae9;
        }

        &__initials {
          text-transform: uppercase;
        }
      }
    `,
  ],
})
export class AvatarComponent {
  src = input<string | null>(null);
  name = input<string>('');

  showInitials = signal(false);

  initials = computed(() => {
    const nameStr = this.name() || '';
    if (!nameStr) return '?';

    const parts = nameStr.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return nameStr.substring(0, 2).toUpperCase();
  });

  onError() {
    this.showInitials.set(true);
  }
}

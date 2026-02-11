import { Injectable, signal } from '@angular/core';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: number;
  message: string;
  type: NotificationType;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notifications = signal<Notification[]>([]);
  notifications$ = this.notifications.asReadonly();

  private counter = 0;

  show(message: string, type: NotificationType = 'info', duration = 3000) {
    const id = ++this.counter;
    const notification: Notification = { id, message, type };

    this.notifications.update((prev) => [...prev, notification]);

    if (duration > 0) {
      setTimeout(() => this.remove(id), duration);
    }
  }

  success(message: string, duration = 3000) {
    this.show(message, 'success', duration);
  }

  error(message: string, duration = 5000) {
    this.show(message, 'error', duration);
  }

  remove(id: number) {
    this.notifications.update((prev) => prev.filter((n) => n.id !== id));
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
export interface NotificationMessage {
  id: number;
  message: string;
  type: 'success' | 'error';
  code?: string | number;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly SUCCESS_DURATION = 3000;
  private readonly FAIL_DURATION = 3000;
  private notifications = new BehaviorSubject<NotificationMessage[]>([]);
  notifications$ = this.notifications.asObservable();

  show(
    message: string,
    type: 'success' | 'error',
    code?: string | number,
    ) {
    const id = Date.now();
    const notification: NotificationMessage = { id, message, type, code };

    this.notifications.next([...this.notifications.value, notification]);
    var duration = type == 'success' ? this.SUCCESS_DURATION : this.FAIL_DURATION;
    setTimeout(() => {
      this.remove(id);
    }, duration);
  }

  remove(id: number) {
    const currentNotifications = this.notifications.value;
    this.notifications.next(currentNotifications.filter((n) => n.id !== id));
  }
}
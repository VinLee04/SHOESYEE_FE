import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {
  NotificationMessage,
  NotificationService,
} from './notification.service';
import { CommonModule } from '@angular/common';
// notification.component.ts
@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notifications-container">
      <div
        *ngFor="let notification of notifications$ | async"
        [@slideInOut]
        class="notification"
        [ngClass]="notification.type"
      >
        <div class="content">
          <div class="message">{{ notification.message }}</div>
        </div>
        <button class="close-btn" (click)="close(notification.id)">×</button>
      </div>
    </div>
  `,
  styles: [`
    .notifications-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999999999;
      max-width: 350px;
    }

    .notification {
      background: white;
      padding: 15px;
      border-radius: 4px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
      align-items: start;
      transform-origin: right;
    }

    .content {
      flex-grow: 1;
      margin-right: 10px;
    }

    .message {
      margin-bottom: 5px;
    }

    .success {
      border-left: 4px solid #4caf50;
    }

    .error {
      border-left: 4px solid #f44336;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 20px;
      cursor: pointer;
      color: #666;
      padding: 0 5px;
    }

    .close-btn:hover {
      color: #333;
    }
  `],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ 
          transform: 'translateX(100%)',
          opacity: 0
        }),
        animate('300ms ease-out', style({ 
          transform: 'translateX(0)',
          opacity: 1
        }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ 
          transform: 'translateX(100%)',
          opacity: 0
        }))
      ])
    ])
  ]
})
export class NotificationComponent implements OnInit {
  notifications$: Observable<NotificationMessage[]>;

  constructor(private notificationService: NotificationService) {
    this.notifications$ = this.notificationService.notifications$;
  }

  ngOnInit() {}

  close(id: number) {
    this.notificationService.remove(id);
  }
}
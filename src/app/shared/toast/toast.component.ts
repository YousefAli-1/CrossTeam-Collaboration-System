import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { animate, style, transition, trigger } from '@angular/animations';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="toast" [@toastAnimation] [class]="type" role="alert">
      <div class="toast-content">
        <div class="toast-icon-wrapper">
          <mat-icon class="toast-icon">{{ getIcon() }}</mat-icon>
        </div>
        <div class="toast-message-wrapper">
          <span class="toast-title">{{ getTitle() }}</span>
          <span class="toast-message">{{ message }}</span>
        </div>
      </div>
      <button class="toast-close" (click)="close()" aria-label="Close notification">
        <mat-icon>close</mat-icon>
      </button>
    </div>
  `,
  styles: [`
    .toast {
      position: fixed;
      top: 24px;
      right: 24px;
      min-width: 320px;
      max-width: 420px;
      padding: 16px;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      z-index: 1000;
      background: white;
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      transform-origin: top right;
    }

    .toast-content {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      flex: 1;
    }

    .toast-icon-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 8px;
      flex-shrink: 0;
    }

    .toast-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .toast-message-wrapper {
      display: flex;
      flex-direction: column;
      gap: 4px;
      flex: 1;
    }

    .toast-title {
      font-weight: 600;
      font-size: 14px;
      line-height: 1.4;
    }

    .toast-message {
      font-size: 13px;
      line-height: 1.5;
      color: #666;
    }

    .toast-close {
      background: none;
      border: none;
      padding: 4px;
      cursor: pointer;
      color: #999;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      transition: all 0.2s ease;
      margin-left: 8px;
      flex-shrink: 0;
    }

    .toast-close:hover {
      background: rgba(0, 0, 0, 0.05);
      color: #666;
    }

    .toast.success {
      background: linear-gradient(to right, #f0fff4, white);
    }

    .toast.success .toast-icon-wrapper {
      background: rgba(72, 187, 120, 0.1);
    }

    .toast.success .toast-icon {
      color: #48bb78;
    }

    .toast.success .toast-title {
      color: #2f855a;
    }

    .toast.error {
      background: linear-gradient(to right, #fff5f5, white);
    }

    .toast.error .toast-icon-wrapper {
      background: rgba(245, 101, 101, 0.1);
    }

    .toast.error .toast-icon {
      color: #f56565;
    }

    .toast.error .toast-title {
      color: #c53030;
    }

    .toast.info {
      background: linear-gradient(to right, #ebf8ff, white);
    }

    .toast.info .toast-icon-wrapper {
      background: rgba(66, 153, 225, 0.1);
    }

    .toast.info .toast-icon {
      color: #4299e1;
    }

    .toast.info .toast-title {
      color: #2b6cb0;
    }

    .toast.warning {
      background: linear-gradient(to right, #fffaf0, white);
    }

    .toast.warning .toast-icon-wrapper {
      background: rgba(237, 137, 54, 0.1);
    }

    .toast.warning .toast-icon {
      color: #ed8936;
    }

    .toast.warning .toast-title {
      color: #c05621;
    }

    @keyframes progress {
      from { width: 100%; }
      to { width: 0%; }
    }

    .toast::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      height: 3px;
      background: currentColor;
      opacity: 0.2;
      animation: progress linear forwards;
      animation-duration: inherit;
    }
  `],
  animations: [
    trigger('toastAnimation', [
      transition(':enter', [
        style({ 
          transform: 'translateX(100%) scale(0.8)', 
          opacity: 0 
        }),
        animate('400ms cubic-bezier(0.34, 1.56, 0.64, 1)', 
          style({ 
            transform: 'translateX(0) scale(1)', 
            opacity: 1 
          })
        )
      ]),
      transition(':leave', [
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', 
          style({ 
            transform: 'translateX(100%) scale(0.8)', 
            opacity: 0 
          })
        )
      ])
    ])
  ]
})
export class ToastComponent {
  @Input() message: string = '';
  @Input() type: ToastType = 'info';
  @Input() duration: number = 5000;
  @Output() closeToast = new EventEmitter<void>();

  getIcon(): string {
    switch (this.type) {
      case 'success':
        return 'check_circle';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      default:
        return 'info';
    }
  }

  getTitle(): string {
    switch (this.type) {
      case 'success':
        return 'Success';
      case 'error':
        return 'Error';
      case 'warning':
        return 'Warning';
      default:
        return 'Information';
    }
  }

  close() {
    this.closeToast.emit();
  }
} 
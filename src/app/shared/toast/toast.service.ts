import { Injectable, ComponentRef, createComponent, ApplicationRef, Injector, Type } from '@angular/core';
import { ToastComponent, ToastType } from './toast.component';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toasts: ComponentRef<ToastComponent>[] = [];

  constructor(
    private appRef: ApplicationRef,
    private injector: Injector
  ) {}

  private createToast(message: string, type: ToastType, duration: number = 5000): void {
    // Create toast component
    const toastComponent = createComponent(ToastComponent, {
      environmentInjector: this.appRef.injector,
      elementInjector: this.injector
    });

    // Set toast properties
    toastComponent.instance.message = message;
    toastComponent.instance.type = type;
    toastComponent.instance.duration = duration;

    // Add to DOM
    document.body.appendChild(toastComponent.location.nativeElement);
    this.appRef.attachView(toastComponent.hostView);
    this.toasts.push(toastComponent);

    // Handle close event
    toastComponent.instance.closeToast.subscribe(() => {
      this.removeToast(toastComponent);
    });

    // Auto remove after duration
    if (duration > 0) {
      setTimeout(() => {
        this.removeToast(toastComponent);
      }, duration);
    }
  }

  private removeToast(toast: ComponentRef<ToastComponent>): void {
    const index = this.toasts.indexOf(toast);
    if (index > -1) {
      this.toasts.splice(index, 1);
      this.appRef.detachView(toast.hostView);
      toast.destroy();
    }
  }

  success(message: string, duration?: number): void {
    this.createToast(message, 'success', duration);
  }

  error(message: string, duration?: number): void {
    this.createToast(message, 'error', duration);
  }

  info(message: string, duration?: number): void {
    this.createToast(message, 'info', duration);
  }

  warning(message: string, duration?: number): void {
    this.createToast(message, 'warning', duration);
  }
} 
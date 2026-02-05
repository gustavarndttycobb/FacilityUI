import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
    id: number;
    message: string;
    type: ToastType;
}

@Injectable({
    providedIn: 'root'
})
export class ToastService {
    toasts = signal<Toast[]>([]);
    private counter = 0;

    show(message: string, type: ToastType = 'info', duration = 3000) {
        const id = this.counter++;
        const newToast: Toast = { id, message, type };
        this.toasts.update(toasts => [...toasts, newToast]);

        setTimeout(() => {
            this.remove(id);
        }, duration);
    }

    remove(id: number) {
        this.toasts.update(toasts => toasts.filter(t => t.id !== id));
    }
}

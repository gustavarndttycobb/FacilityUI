import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
    selector: 'app-toast',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="toast-container">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast" [ngClass]="toast.type" (click)="remove(toast.id)">
          <div class="toast-content">
            <span class="message">{{ toast.message }}</span>
          </div>
          <button class="close-btn">&times;</button>
        </div>
      }
    </div>
  `,
    styles: [`
    .toast-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .toast {
      min-width: 300px;
      padding: 16px;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(10px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      display: flex;
      justify-content: space-between;
      align-items: center;
      animation: slideIn 0.3s ease-out;
      cursor: pointer;
      border-left: 4px solid #ccc;
      color: #333;
    }

    .toast.success {
      border-left-color: #2ecc71;
      background: #f0fdf4;
      color: #14532d;
    }

    .toast.error {
      border-left-color: #e74c3c;
      background: #fef2f2;
      color: #7f1d1d;
    }

    .toast.info {
      border-left-color: #3498db;
      background: #eff6ff;
      color: #1e3a8a;
    }

    .message {
      font-size: 0.95rem;
      font-weight: 500;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 1.2rem;
      cursor: pointer;
      opacity: 0.5;
      margin-left: 10px;
      color: inherit;
    }

    .close-btn:hover {
      opacity: 1;
    }

    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `]
})
export class ToastComponent {
    toastService = inject(ToastService);

    remove(id: number) {
        this.toastService.remove(id);
    }
}

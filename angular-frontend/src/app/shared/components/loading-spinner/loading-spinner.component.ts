import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  template: `
    <div class="spinner-overlay" [class.fullscreen]="fullscreen">
      <div class="spinner-container">
        <mat-progress-spinner
          mode="indeterminate"
          [diameter]="diameter"
          color="primary">
        </mat-progress-spinner>
        <p *ngIf="message" class="spinner-message">{{ message }}</p>
      </div>
    </div>
  `,
  styles: [`
    .spinner-overlay {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      min-height: 200px;
    }
    .fullscreen {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(2, 6, 23, 0.8);
      backdrop-filter: blur(4px);
      z-index: 9999;
    }
    .spinner-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }
    .spinner-message {
      color: #94a3b8;
      font-size: 14px;
      font-weight: 500;
      letter-spacing: 0.5px;
    }
  `]
})
export class LoadingSpinnerComponent {
  @Input() diameter: number = 50;
  @Input() message: string = '';
  @Input() fullscreen: boolean = false;
}

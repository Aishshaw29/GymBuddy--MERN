import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatSidenavModule, NavbarComponent, SidebarComponent],
  template: `
    <div class="app-container">
      <app-navbar></app-navbar>
      
      <mat-sidenav-container class="sidenav-container">
        <mat-sidenav #sidenav mode="side" [opened]="true" class="glass sidebar">
          <app-sidebar></app-sidebar>
        </mat-sidenav>
        
        <mat-sidenav-content>
          <main class="main-content">
            <router-outlet></router-outlet>
          </main>
        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      flex-direction: column;
      height: 100vh;
    }
    .sidenav-container {
      flex: 1;
      background: transparent;
    }
    .sidebar {
      width: 260px;
      border-right: 1px solid rgba(255, 255, 255, 0.05);
    }
    .main-content {
      padding: 24px;
      min-height: calc(100vh - 70px);
    }
    ::ng-deep .mat-drawer-inner-container {
      overflow: hidden !important;
    }
    @media (max-width: 960px) {
      .sidebar {
        display: none;
      }
    }
  `]
})
export class MainLayoutComponent {
  authService = inject(AuthService);
}

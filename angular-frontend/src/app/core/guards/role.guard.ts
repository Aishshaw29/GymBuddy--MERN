import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const expectedRoles = route.data['roles'] as Array<string>;
  const userRole = authService.currentUser?.role;

  if (authService.isLoggedIn() && expectedRoles.includes(userRole || '')) {
    return true;
  }

  if (userRole) {
    // Redirect to their respective dashboard if they have a role but not the one required
    const dashboard = userRole.toLowerCase();
    router.navigate([`/${dashboard}`]);
  } else {
    router.navigate(['/login']);
  }
  
  return false;
};

import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from 'src/app/services/autenticadorService/auth.service';

export const AdminGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isAuthenticated()) {
    router.navigate(['/login']); // não logado
    return false;
  }

  if (auth.isAdmin$) {
    return true; // logado e admin
  }

  router.navigate(['/home']); // logado, mas não admin
  return false;
};

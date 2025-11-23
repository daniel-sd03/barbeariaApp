import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from 'src/app/services/autenticadorService/auth.service';
import { UserRole } from 'src/app/interfaces/user-role.enum';

export const AdminGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isAuthenticated()) {
    router.navigate(['/login']); // não logado
    return false;
  }

  const role = auth.getRole();
  if (role === UserRole.Admin) {
    return true;
  }

  router.navigate(['/home']); // logado, mas não admin
  return false;
};

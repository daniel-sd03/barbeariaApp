import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from 'src/app/services/autenticadorService/auth.service';
import { map, filter, take } from 'rxjs/operators';

export const AuthGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.usuarioCarregado$.pipe(
    filter(carregado => carregado), // espera carregar o estado de autenticação
    take(1),
    map(() => {
      if (auth.isAuthenticated()) {
        return true;
      } else {
        router.navigate(['/login']);
        return false;
      }
    })
  );
};

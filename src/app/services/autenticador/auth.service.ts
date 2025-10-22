import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserRole } from 'src/app/interfaces/user-role.enum';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
 private readonly TOKEN_KEY = 'userToken';
  private readonly ROLE_KEY = 'userRole';

  // inicia com o valor lido do localStorage (se houver)
  private role$ = new BehaviorSubject<UserRole | null>(this.readRoleFromStorage());

  // Observable público que emite true/false se for admin
  isAdmin$ = this.role$.asObservable().pipe(map(r => r === UserRole.Admin));

  constructor(private router: Router) {}

  // exemplo de login — após validação real, chame setRole(...) com a role correta
  login(username: string, password: string): boolean {
    if (username === 'admin' && password === '123') {
      localStorage.setItem(this.TOKEN_KEY, 'fake-jwt-token');
      this.setRole(UserRole.Admin);
      return true;
    }
    if (username === 'user' && password === '123') {
      localStorage.setItem(this.TOKEN_KEY, 'fake-jwt-token');
      this.setRole(UserRole.User);
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.setRole(null);         // atualiza o BehaviorSubject e limpa storage
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  // atualiza localStorage e notifica assinantes
  private setRole(role: UserRole | null) {
    if (role) {
      localStorage.setItem(this.ROLE_KEY, role);
    } else {
      localStorage.removeItem(this.ROLE_KEY);
    }
    this.role$.next(role);
  }

  // lê do localStorage e valida contra o enum
  private readRoleFromStorage(): UserRole | null {
    const r = localStorage.getItem(this.ROLE_KEY);
    if (!r) return null;
    const valid = Object.values(UserRole).includes(r as UserRole);
    return valid ? (r as UserRole) : null;
  }

  // expõe o snapshot atual de role (sincrono)
  getRole(): UserRole | null {
    return this.role$.getValue();
  }
}

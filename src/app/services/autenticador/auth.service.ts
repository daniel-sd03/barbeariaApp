import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserRole } from 'src/app/interfaces/user-role.enum';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Auth, signInWithEmailAndPassword, signOut, User } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private role$ = new BehaviorSubject<UserRole | null>(null);
  isAdmin$ = this.role$.asObservable().pipe(map(r => r === UserRole.Admin));

  constructor(private router: Router, private auth: Auth) {}

  // Login usando Firebase
  async login(email: string, password: string): Promise<boolean> {
    try {
      const cred = await signInWithEmailAndPassword(this.auth, email, password);

      // Exemplo: definir role baseado no email
      if (cred.user.email === 'admin@exemplo.com') {
        this.setRole(UserRole.Admin);
      } else {
        this.setRole(UserRole.User);
      }

      return true;
    } catch (err) {
      console.error('Erro no login:', err);
      return false;
    }
  }

  // Logout
  async logout() {
    await signOut(this.auth);
    this.setRole(null);
    this.router.navigate(['/login']);
  }

  // Atualiza o BehaviorSubject de role
  private setRole(role: UserRole | null) {
    this.role$.next(role);
  }

  // Snapshot síncrono da role
  getRole(): UserRole | null {
    return this.role$.getValue();
  }

  // Retorna se o usuário está autenticado
  isAuthenticated(): boolean {
    return !!this.auth.currentUser;
  }
}

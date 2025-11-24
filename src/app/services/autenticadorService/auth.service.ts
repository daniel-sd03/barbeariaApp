import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserRole } from 'src/app/interfaces/user-role.enum';
import { BehaviorSubject, map } from 'rxjs';
import { Auth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public usuarioCarregado$ = new BehaviorSubject<boolean>(false);
  private role$ = new BehaviorSubject<UserRole | null>(null);
  isAdmin$ = this.role$.asObservable().pipe(map(r => r === UserRole.Admin));

  constructor(private router: Router, private auth: Auth,
    private firestore: Firestore) {
    onAuthStateChanged(this.auth, async (user) => {
      try {
        if (user) {
          // usuário autenticado: busca role e seta
          const role = await this.buscarRole(user.uid);
          this.setRole(role);
        } else {
          // usuário não autenticado: limpa role
          this.setRole(null);
        }
      } catch (err: any) {
        console.error('Erro ao processar onAuthStateChanged:', err);
        console.error('Erro código:', err?.code, 'mensagem:', err?.message);
        this.setRole(null);
      } finally {
        // sinaliza que o estado do usuário já foi carregado
        this.usuarioCarregado$.next(true);
      }
    });

  }

  // Login usando Firebase
  async login(email: string, password: string): Promise<boolean> {
    try {
      // Faz login no Firebase Authentication com e-mail e senha
      const cred = await signInWithEmailAndPassword(this.auth, email, password);

      //Busca a role do usuário
      const role = await this.buscarRole(cred.user.uid);

      //Seta a role buscada
      this.setRole(role);
      return true;
    } catch (err) {
      console.error('Erro no login:', err);
      return false;
    }
  }

  //buscar role
  async buscarRole(uid?: string): Promise<UserRole | null> {
    try {
      const userId = uid || this.auth.currentUser?.uid;
      if (!userId) return null;

      const docRef = doc(this.firestore, 'usuarios', userId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data() as any;
        return data?.role as UserRole;
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  // Logout
  async logout() {
    try {
      await signOut(this.auth);

      this.setRole(null);
      this.usuarioCarregado$.next(true);

      await this.router.navigate(['/login']);
    } catch (error) {
      console.error('Erro ao sair:', error);
      this.setRole(null);
      this.usuarioCarregado$.next(true);
    }
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

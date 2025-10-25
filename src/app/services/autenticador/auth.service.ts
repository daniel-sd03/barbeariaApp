import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserRole } from 'src/app/interfaces/user-role.enum';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Auth, signInWithEmailAndPassword, signOut, User } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private role$ = new BehaviorSubject<UserRole | null>(null);
  isAdmin$ = this.role$.asObservable().pipe(map(r => r === UserRole.Admin));

  constructor(private router: Router, private auth: Auth,
    private firestore: Firestore) { }

  // Login usando Firebase
  async login(email: string, password: string): Promise<boolean> {
    try {
      // Faz login no Firebase Authentication com e-mail e senha
      const cred = await signInWithEmailAndPassword(this.auth, email, password);

      // Pega o UID (identificador único) do usuário autenticado
      const uid = cred.user.uid;

      // Cria uma referência para o documento do usuário no Firestore (coleção "usuarios")
      const docRef = doc(this.firestore, 'usuarios', uid);

      // Busca os dados do documento correspondente ao UID
      const snap = await getDoc(docRef);

      // Se o documento existir no banco...
      if (snap.exists()) {
        // Obtém os dados do usuário (ex: nome, email, role, etc.)
        const data = snap.data() as any;

        // Extrai a role (função do usuário, ex: Admin, User)
        const role = data?.role as UserRole;

        // Armazena a role no BehaviorSubject interno para uso posterior
        this.setRole(role);
      }else {
        this.setRole(null);
      }
      return true;
    } catch (err) {
      console.error('Erro no login:', err);
      return false;
    }
  }

  // Logout
  async logout() {
    try {
      await signOut(this.auth);
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Erro ao sair:', error);
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

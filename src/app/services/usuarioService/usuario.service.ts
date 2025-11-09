import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, doc, setDoc, collection, collectionData, docData, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Usuario } from 'src/app/interfaces/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private auth: Auth, private firestore: Firestore) { }

  async cadastrarUsuario(userData: {
    nome: string,
    telefone: string,
    cpf: string,
    email: string,
    senha: string,
    role?: string
  }) {
    try {
      // Cria usuário no Firebase Auth
      const cred = await createUserWithEmailAndPassword(this.auth, userData.email, userData.senha);

      // Salva dados adicionais no Firestore
      await setDoc(doc(this.firestore, 'usuarios', cred.user.uid), {
        nome: userData.nome,
        telefone: userData.telefone,
        cpf: userData.cpf,
        email: userData.email,
        role: userData.role || 'User'
      });

      return cred.user;
    } catch (error: any) {
      console.error("erro ao tentar cadastrar usuário (usuario.service): " + error);
      throw error;
    }
  }

  getUsuarios(): Observable<Usuario[]> {
    const ref = collection(this.firestore, 'usuarios');
    return collectionData(ref, { idField: 'id' }) as Observable<Usuario[]>;
  }

  getUsuarioById(id: string): Observable<Usuario> {
    const ref = doc(this.firestore, 'usuarios', id);
    return docData(ref, { idField: 'id' }) as Observable<Usuario>;
  }

  async atualizarUsuario(id: string, dados: Partial<Usuario>): Promise<void> {
    const ref = doc(this.firestore, 'usuarios', id);
    await updateDoc(ref, dados as any);
  }

  async excluirUsuario(id: string): Promise<void> {
    const ref = doc(this.firestore, 'usuarios', id);
    await deleteDoc(ref);
  }
}

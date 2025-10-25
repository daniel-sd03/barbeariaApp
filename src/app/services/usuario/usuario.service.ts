import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';

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
}

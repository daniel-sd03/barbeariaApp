import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, doc, updateDoc, deleteDoc, collectionData, docData } from '@angular/fire/firestore';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Barbeiro } from 'src/app/interfaces/barbeiro';


@Injectable({
  providedIn: 'root'
})
export class BarbeiroService {
  private colecao = 'barbeiros';

  constructor(private firestore: Firestore) { }

  // Obter todos os barbeiros
  getBarbeiros(): Observable<Barbeiro[]> {
    const barbeirosRef = collection(this.firestore, this.colecao);
    return (collectionData(barbeirosRef, { idField: 'id' }) as Observable<Barbeiro[]>)
      .pipe(
        catchError((error) => {
          console.error("[barbeiroService] erro ao tentar listar barbeiros: " + error);
          return throwError(() => error);
        })
      );
  }

  // Obter barbeiro por ID
  getBarbeiroById(id: string): Observable<Barbeiro> {
    const barbeiroDocRef = doc(this.firestore, `${this.colecao}/${id}`);
    return (docData(barbeiroDocRef, { idField: 'id' }) as Observable<Barbeiro>)
      .pipe(
        catchError((error) => {
          console.error("[barbeiroService] erro ao tentar buscar barbeiro por id: " + error);
          return throwError(() => error);
        })
      );
  }

  // Cadastrar um novo barbeiro
  cadastrarBarbeiro(barbeiro: Omit<Barbeiro, 'id'>): Promise<any> {
    try {
      const colRef = collection(this.firestore, this.colecao);
      return addDoc(colRef, barbeiro);
    } catch (error) {
      console.error("[barbeiroService] erro ao tentar cadastrar barbeiro: " + error);
      throw error;
    }
  }

  // Atualizar barbeiro
  atualizarBarbeiro(barbeiro: Barbeiro): Promise<void> {
    try {
      const barbeiroDocRef = doc(this.firestore, `${this.colecao}/${barbeiro.id}`);
      return updateDoc(barbeiroDocRef, {
        nome: (barbeiro as any).nome,
        telefone: (barbeiro as any).telefone,
        cpf: (barbeiro as any).cpf,
        email: (barbeiro as any).email,
        foto: (barbeiro as any).foto
      });
    } catch (error) {
      console.error("[barbeiroService] erro ao tentar atualizar barbeiro: " + error);
      throw error;
    }
  }

  // Excluir barbeiro
  excluirBarbeiro(id: string): Promise<void> {
    try {
      const docRef = doc(this.firestore, this.colecao, id);
      return deleteDoc(docRef);
    } catch (error) {
      console.error("[barbeiroService] erro ao tentar excluir barbeiro: " + error);
      throw error;
    }
  }
}

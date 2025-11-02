import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, doc, updateDoc, deleteDoc, collectionData, docData } from '@angular/fire/firestore';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Servico } from 'src/app/interfaces/servico';

@Injectable({
  providedIn: 'root'
})
export class ServicoService {
  private colecao = 'servicos';

  constructor(private firestore: Firestore) { }

  // Cadastrar um novo serviço
  cadastrarServico(Servico: Omit<Servico, 'id'>): Promise<any> {
    try {
      const colRef = collection(this.firestore, this.colecao);
      return addDoc(colRef, Servico);
    } catch (error) {
      console.error("[servicoService] erro ao tentar cadastrar serviço: " + error);
      throw error;
    }
  }

  // Obter todos os serviços
  getServicos(): Observable<Servico[]> {
    const servicosRef = collection(this.firestore, this.colecao);
    return (collectionData(servicosRef, { idField: 'id' }) as Observable<Servico[]>)
      .pipe(
        catchError((error) => {
          console.error("[servicoService] erro ao tentar listar serviços: " + error);
          return throwError(() => error);
        })
      );
  }

  // Obter serviço por ID
  getServicoById(id: string): Observable<Servico> {
    const servicoDocRef = doc(this.firestore, `${this.colecao}/${id}`);
    return (docData(servicoDocRef, { idField: 'id' }) as Observable<Servico>)
      .pipe(
        catchError((error) => {
          console.error("[servicoService] erro ao tentar buscar serviço por id: " + error);
           return throwError(() => error);
        })
      )
  }

  // Atualizar serviço
  atualizarServico(servico: Servico): Promise<void> {
    try {
      const servicoDocRef = doc(this.firestore, `${this.colecao}/${servico.id}`);
      return updateDoc(servicoDocRef, {
        titulo: (servico as any).titulo,
        preco: (servico as any).preco,
        duracao: (servico as any).duracao
      });
    } catch (error) {
      console.error("[servicoService] erro ao tentar atualizar serviço: " + error);
      throw error;
    }
  }

  // Excluir serviço
  excluirServico(id: string): Promise<void> {
    try {
      const docRef = doc(this.firestore, this.colecao, id);
      return deleteDoc(docRef);
    } catch (error) {
      console.error("[servicoService] erro ao tentar excluir serviço: " + error);
      throw error;
    }
  }
}

import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Produto } from '../../interfaces/produto';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, docData, updateDoc } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class ProdutoService {
  private colecao = 'produtos';

  constructor(private firestore: Firestore) { }

  getProdutos(): Observable<Produto[]> {
    const produtosRef = collection(this.firestore, this.colecao);
    return (collectionData(produtosRef, { idField: 'id' }) as Observable<Produto[]>)
      .pipe(
        catchError((error) => {
          console.error("[produtoService] erro ao tentar listar produtos: " + error);
          return throwError(() => error);
        })
      );
  }

  getProdutoById(id: string): Observable<Produto> {
    const produtoDocRef = doc(this.firestore, `${this.colecao}/${id}`);
    return (docData(produtoDocRef, { idField: 'id' }) as Observable<Produto>)
      .pipe(
        catchError((error) => {
          console.error("[produtoService] erro ao tentar buscar produto por id: " + error);
          return throwError(() => error);
        })
      );
  }

  cadastrarProduto(produto: Omit<Produto, 'id'>): Promise<any> {
    try {
      const produtosRef = collection(this.firestore, this.colecao);
      return addDoc(produtosRef, produto);
    } catch (error) {
      console.error("[produtoService] erro ao tentar cadastrar produto: " + error);
      throw error;
    }
  }

  atualizarProduto(produto: Produto): Promise<void> {
    try {
      const produtoDocRef = doc(this.firestore, `${this.colecao}/${produto.id}`);
      return updateDoc(produtoDocRef, {
        nome: produto.nome,
        preco: produto.preco,
        quantidade: produto.quantidade,
        imagem: produto.imagem
      });
    } catch (error) {
      console.error("[produtoService] erro ao tentar atualizar produto: " + error);
      throw error;
    }
  }

  excluirProduto(id: string): Promise<void> {
    try {
      const produtoDocRef = doc(this.firestore, `${this.colecao}/${id}`);
      return deleteDoc(produtoDocRef);
    } catch (error) {
      console.error("[produtoService] erro ao tentar excluir produto: " + error);
      throw error;
    }
  }
}

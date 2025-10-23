import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Produto } from '../../interfaces/produto';

@Injectable({ providedIn: 'root' })
export class ProdutoService {
  private dadosMock: Produto[] = [
    { id: 1, nome: 'Shampoo', preco: 49.99, imagem: 'assets/fotos/produtos/produto01.jpeg', quantidade: 1 },
    { id: 2, nome: 'Gel', preco: 10.99, imagem: 'assets/fotos/produtos/produto02.jpeg',quantidade: 2 },
    { id: 3, nome: 'Pós-barba', preco: 29.99, imagem: 'assets/fotos/produtos/produto03.jpeg',quantidade: 3 }
  ];

  constructor() {}

  getProdutos(): Observable<Produto[]> {
    // aqui você trocaria por um this.http.get quando integrar API real
    return of(this.dadosMock);
  }

  getProdutoById(id: number | string): Observable<Produto | undefined> {
    return of(this.dadosMock.find(p => p.id === id));
  }
}

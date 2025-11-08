import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Produto } from 'src/app/interfaces/produto';
import { Agendamento } from 'src/app/interfaces/agendamento';
import { Carrinho } from 'src/app/interfaces/carrinho';

@Injectable({ providedIn: 'root' })
export class CarrinhoService {
  private carrinho$ = new BehaviorSubject<Carrinho>({ produtos: [] });

  // Observables
  getCarrinho(): Observable<Carrinho> { return this.carrinho$.asObservable(); }
  getItems(): Observable<Produto[]> { return this.carrinho$.asObservable().pipe(map(c => c.produtos)); }
  getAgendamento(): Observable<Agendamento | undefined> { return this.carrinho$.asObservable().pipe(map(c => c.agendamento)); }



  // adiciona (incrementa se já existir)
  addProduto(prod: Produto) {
    const snapshot = this.carrinho$.value;
    const current = snapshot.produtos.slice();
    const idx = current.findIndex(p => p.id === prod.id);
    if (idx > -1) {
      current[idx] = { ...current[idx], quantidade: (current[idx].quantidade || 1) + 1 };
    } else {
      current.push({ ...prod, quantidade: 1 });
    }
    this.carrinho$.next({ ...snapshot, produtos: current });
  }

  // alias para compatibilidade
  addToCart(prod: Produto) { this.addProduto(prod); }

  // atualiza quantidade para um produto (remove se quantidade < 1)
  updateProdutoQuantidade(id: String, quantidade: number) {
    if (quantidade <= 0) {
      this.removeProduto(id);
      return;
    }
    const snapshot = this.carrinho$.value;
    const current = snapshot.produtos.slice();
    const idx = current.findIndex(p => p.id === id);
    if (idx > -1) {
      current[idx] = { ...current[idx], quantidade: Math.floor(quantidade) };
      this.carrinho$.next({ ...snapshot, produtos: current });
    }
  }

  // alias para compatibilidade
  updateQuantity(id: String, quantidade: number) { this.updateProdutoQuantidade(id, quantidade); }

  // remove item por id
  removeProduto(id: String) {
    const snapshot = this.carrinho$.value;
    const current = snapshot.produtos.filter(p => p.id !== id);
    this.carrinho$.next({ ...snapshot, produtos: current });
  }

  // alias para compatibilidade
  removeFromCart(id: String) { this.removeProduto(id); }

  // limpar carrinho
  clear() { this.carrinho$.next({ produtos: [] }); }

  // limpar apenas produtos
  clearProdutos() {
    const snapshot = this.carrinho$.value;
    this.carrinho$.next({ ...snapshot, produtos: [] });
  }

  // opcional: substituir toda a lista (útil para restauração)
  setItems(items: Produto[]) {
    const snapshot = this.carrinho$.value;
    this.carrinho$.next({ ...snapshot, produtos: items.slice() });
  }

  // opcional: snapshot (uso interno)
  getSnapshot(): Carrinho {
    return { ...this.carrinho$.value, produtos: this.carrinho$.value.produtos.slice() };
  }

  // agendamento
  setAgendamento(agendamento: Agendamento) {
    const snapshot = this.carrinho$.value;
    this.carrinho$.next({ ...snapshot, agendamento });
  }

  removeAgendamento() {
    const snapshot = this.carrinho$.value;
    const { agendamento, ...rest } = snapshot;
    this.carrinho$.next({ ...rest, agendamento: undefined });
  }
}

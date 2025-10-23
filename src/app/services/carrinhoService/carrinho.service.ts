import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Produto } from 'src/app/interfaces/produto';

@Injectable({ providedIn: 'root' })
export class CarrinhoService {
  private items$ = new BehaviorSubject<Produto[]>([]);
  getItems(): Observable<Produto[]> { return this.items$.asObservable(); }

  // adiciona (incrementa se já existir)
  addToCart(prod: Produto) {
    const current = this.items$.value.slice();
    const idx = current.findIndex(p => p.id === prod.id);
    if (idx > -1) {
      current[idx] = { ...current[idx], quantidade: (current[idx].quantidade || 1) + 1 };
    } else {
      current.push({ ...prod, quantidade: 1 });
    }
    this.items$.next(current);
  }

  // atualiza quantidade para um produto (remove se quantidade < 1)
  updateQuantity(id: number, quantidade: number) {
    if (quantidade <= 0) {
      this.removeFromCart(id);
      return;
    }
    const current = this.items$.value.slice();
    const idx = current.findIndex(p => p.id === id);
    if (idx > -1) {
      current[idx] = { ...current[idx], quantidade: Math.floor(quantidade) };
      this.items$.next(current);
    }
  }

  // remove item por id
  removeFromCart(id: number) {
    const current = this.items$.value.filter(p => p.id !== id);
    this.items$.next(current);
  }

  // limpar carrinho
  clear() { this.items$.next([]); }

  // opcional: substituir toda a lista (útil para restauração)
  setItems(items: Produto[]) {
    this.items$.next(items.slice());
  }

  // opcional: snapshot (uso interno)
  getSnapshot(): Produto[] {
    return this.items$.value.slice();
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { closeOutline } from 'ionicons/icons';
import { HeaderComponent } from '../componentes/header/header.component';
import { RouterLinkWithHref } from '@angular/router';
import { Subscription } from 'rxjs';
import { Produto } from 'src/app/interfaces/produto';
import { CarrinhoService } from '../services/carrinhoService/carrinho.service';

@Component({
  selector: 'app-carrinho-de-compra',
  templateUrl: './carrinho.page.html',
  styleUrls: ['./carrinho.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,HeaderComponent, RouterLinkWithHref]
})

export class CarrinhoPage implements OnInit, OnDestroy {
  produtos: Produto[] = [];
  total: number = 0;
  private sub!: Subscription;

  constructor(private carrinhoService: CarrinhoService) {
    addIcons({closeOutline})
  }

  ngOnInit() {
    // inscreve no observable do service
    this.sub = this.carrinhoService.getItems().subscribe(items => {
      this.produtos = items;
      this.recalcularTotal();
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  trackById(index: number, item: Produto) {
    return item.id;
  }

  atualizarQuantidade(id: number, valor: any) {
    const qtd = Number(valor);
    if (isNaN(qtd)) return;
    this.carrinhoService.updateQuantity(id, Math.max(1, Math.floor(qtd)));
    // a subscription vai atualizar produtos e total automaticamente
  }

  removerProduto(id: number) {
    this.carrinhoService.removeFromCart(id);
  }

  recalcularTotal() {
    this.total = this.produtos.reduce((acc, p) => acc + (p.preco || 0) * (p.quantidade || 0), 0);
  }

  finalizarCompra() {
    // placeholder — integrar com checkout
    alert(`Total: ${this.total.toFixed(2)} — implementar checkout`);
    // Ex: this.carrinhoService.clear();
  }
}

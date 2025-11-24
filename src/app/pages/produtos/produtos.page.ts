import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonButton, IonIcon, IonContent, IonList, IonItem, IonThumbnail, IonLabel, IonFooter, IonToolbar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeOutline, addCircleOutline} from 'ionicons/icons';
import { HeaderComponent } from '../../componentes/header/header.component';
import { RouterLinkWithHref } from '@angular/router';
import { Observable } from 'rxjs';
import { Produto } from '../../interfaces/produto';
import { ProdutoService } from '../../services/produtoService/produto.service';
import { CarrinhoService } from '../../services/carrinhoService/carrinho.service';
import { IMAGENS_PADRAO } from '../../config/imagens-padrao';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-produtos',
  templateUrl: './produtos.page.html',
  styleUrls: ['./produtos.page.scss'],
  standalone: true,
  imports: [IonButton, IonIcon, IonContent, IonList, IonItem, IonThumbnail, IonLabel, IonFooter, IonToolbar, CommonModule, FormsModule, HeaderComponent, RouterLinkWithHref]
})

export class ProdutosPage {
  produtos$: Observable<Produto[]>;
  IMAGENS_PADRAO = IMAGENS_PADRAO;

  constructor(
    private produtoService: ProdutoService,
    private carrinhoService: CarrinhoService,
    private navCtrl: NavController,
    private router: Router
  ) {
    addIcons({closeOutline, addCircleOutline})
    this.produtos$ = this.produtoService.getProdutos();
  }

  adicionar(prod: Produto) {
    this.carrinhoService.addToCart(prod);
    // feedback simples (poderia ser toast)
    console.log('Adicionado ao carrinho:', prod.nome);
  }

  trackById(index: number, item: Produto) { return item.id; }

  // util para formatação de preço (opcional)
  formatPreco(valor: number) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  //Voltar para a página anterior
  voltar() {
    if (window.history.length > 1) {
      this.navCtrl.back();
    } else {
      this.router.navigateByUrl('/home');
   }
}

}

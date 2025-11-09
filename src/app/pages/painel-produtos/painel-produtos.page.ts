import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { searchOutline, trashOutline, createOutline, addOutline, arrowUndoOutline} from 'ionicons/icons';
import { HeaderComponent } from '../../componentes/header/header.component';
import { RouterLinkWithHref, Router } from '@angular/router';
import { Produto } from 'src/app/interfaces/produto';
import { ProdutoService } from 'src/app/services/produtoService/produto.service';

@Component({
  selector: 'app-painel-produtos',
  templateUrl: './painel-produtos.page.html',
  styleUrls: ['./painel-produtos.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HeaderComponent, RouterLinkWithHref]
})
export class PainelProdutosPage implements OnInit {
  termo = '';
  produtos: Produto[] = [];
  filtrados: Produto[] = [];
  pagina: Produto[] = [];
  currentPage = 1;
  pageSize = 10;

  constructor(
    private produtoService: ProdutoService,
    private alertController: AlertController,
    private router: Router
  ) {
    addIcons({ searchOutline, trashOutline, createOutline, addOutline, arrowUndoOutline });
  }

  ngOnInit(): void {
    this.produtoService.getProdutos().subscribe(list => {
      this.produtos = list || [];
      this.aplicarFiltro();
    });
  }

  aplicarFiltro() {
    const termo = (this.termo || '').toLowerCase().trim();
    if (!termo) {
      this.filtrados = this.produtos.slice();
      this.currentPage = 1;
      this.atualizarPagina();
      return;
    }
    this.filtrados = this.produtos.filter(p => (p.nome || '').toLowerCase().includes(termo));
    this.currentPage = 1;
    this.atualizarPagina();
  }

  private atualizarPagina() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagina = this.filtrados.slice(start, end);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil((this.filtrados.length || 0) / this.pageSize));
  }

  proximaPagina() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.atualizarPagina();
    }
  }

  paginaAnterior() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.atualizarPagina();
    }
  }

  async confirmarExclusao(produto: Produto) {
    const alert = await this.alertController.create({
      header: 'Excluir produto',
      message: `Tem certeza que deseja excluir "${produto.nome}"?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Excluir', role: 'destructive', handler: async () => {
            await this.produtoService.excluirProduto(produto.id);
            this.produtos = this.produtos.filter(p => p.id !== produto.id);
            this.aplicarFiltro();
          }
        }
      ]
    });
    await alert.present();
  }

  editar(produto: Produto) {
    // Navega para página de cadastro passando id (assumindo suporte para edição)
    this.router.navigate(['/cadastro-produto'], { queryParams: { id: produto.id } });
  }

  novo() {
    this.router.navigate(['/cadastro-produto']);
  }

  trackById(index: number, item: Produto): string {
  return item.id;
}
}

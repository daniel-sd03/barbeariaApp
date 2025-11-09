import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { searchOutline, trashOutline, createOutline, addOutline, arrowUndoOutline } from 'ionicons/icons';
import { HeaderComponent } from '../../componentes/header/header.component';
import { RouterLinkWithHref, Router } from '@angular/router';
import { Servico } from 'src/app/interfaces/servico';
import { ServicoService } from 'src/app/services/servicoService/servico.service';

@Component({
  selector: 'app-painel-servicos',
  templateUrl: './painel-servicos.page.html',
  styleUrls: ['./painel-servicos.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HeaderComponent, RouterLinkWithHref]
})
export class PainelServicosPage implements OnInit {
  termo = '';
  servicos: Servico[] = [];
  filtrados: Servico[] = [];
  pagina: Servico[] = [];
  currentPage = 1;
  pageSize = 10;

  constructor(
    private servicoService: ServicoService,
    private alertController: AlertController,
    private router: Router
  ) {
    addIcons({ searchOutline, trashOutline, createOutline, addOutline, arrowUndoOutline });
  }

  ngOnInit(): void {
    this.servicoService.getServicos().subscribe(list => {
      this.servicos = list || [];
      this.aplicarFiltro();
    });
  }

  aplicarFiltro() {
    const termo = (this.termo || '').toLowerCase().trim();
    if (!termo) {
      this.filtrados = this.servicos.slice();
      this.currentPage = 1;
      this.atualizarPagina();
      return;
    }
    this.filtrados = this.servicos.filter(s => (s.titulo || '').toLowerCase().includes(termo));
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

  async confirmarExclusao(servico: Servico) {
    const alert = await this.alertController.create({
      header: 'Excluir serviço',
      message: `Tem certeza que deseja excluir "${servico.titulo}"?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Excluir', role: 'destructive', handler: async () => {
            await this.servicoService.excluirServico(servico.id);
            this.servicos = this.servicos.filter(s => s.id !== servico.id);
            this.aplicarFiltro();
          }
        }
      ]
    });
    await alert.present();
  }

  editar(servico: Servico) {
    this.router.navigate(['/cadastro-servico'], { queryParams: { id: servico.id } });
  }

  novo() {
    this.router.navigate(['/cadastro-servico']);
  }

  trackById(index: number, item: Servico): string {
    return item.id;
  }
}
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { searchOutline, trashOutline, createOutline, addOutline, arrowUndoOutline } from 'ionicons/icons';
import { HeaderComponent } from '../../componentes/header/header.component';
import { RouterLinkWithHref, Router } from '@angular/router';
import { Barbeiro } from 'src/app/interfaces/barbeiro';
import { BarbeiroService } from 'src/app/services/barbeiroService/barbeiro.service';
import { IMAGENS_PADRAO } from 'src/app/config/imagens-padrao';



@Component({
  selector: 'app-painel-barbeiros',
  templateUrl: './painel-barbeiros.page.html',
  styleUrls: ['./painel-barbeiros.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HeaderComponent, RouterLinkWithHref]
})
export class PainelBarbeirosPage implements OnInit {
  termo = '';
  barbeiros: Barbeiro[] = [];
  IMAGENS_PADRAO = IMAGENS_PADRAO;
  filtrados: Barbeiro[] = [];
  pagina: Barbeiro[] = [];
  currentPage = 1;
  pageSize = 10;

  constructor(
    private barbeiroService: BarbeiroService,
    private alertController: AlertController,
    private router: Router
  ) {
    addIcons({ searchOutline, trashOutline, createOutline, addOutline, arrowUndoOutline });
  }

  ngOnInit(): void {
    this.barbeiroService.getBarbeiros().subscribe(list => {
      this.barbeiros = list || [];
      this.aplicarFiltro();
    });
  }

  aplicarFiltro() {
    const termo = (this.termo || '').toLowerCase().trim();
    if (!termo) {
      this.filtrados = this.barbeiros.slice();
      this.currentPage = 1;
      this.atualizarPagina();
      return;
    }
    this.filtrados = this.barbeiros.filter(b =>
      (b.nome || '').toLowerCase().includes(termo) ||
      (b.email || '').toLowerCase().includes(termo)
    );
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

  async confirmarExclusao(barbeiro: Barbeiro) {
    const alert = await this.alertController.create({
      header: 'Excluir barbeiro',
      message: `Tem certeza que deseja excluir "${barbeiro.nome}"?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Excluir', role: 'destructive', handler: async () => {
            await this.barbeiroService.excluirBarbeiro(barbeiro.id);
            this.barbeiros = this.barbeiros.filter(b => b.id !== barbeiro.id);
            this.aplicarFiltro();
          }
        }
      ]
    });
    await alert.present();
  }

  editar(barbeiro: Barbeiro) {
    this.router.navigate(['/cadastro-barbeiro'], { queryParams: { id: barbeiro.id } });
  }

  novo() {
    this.router.navigate(['/cadastro-barbeiro']);
  }

  trackById(index: number, item: Barbeiro): string {
    return item.id;
  }
}

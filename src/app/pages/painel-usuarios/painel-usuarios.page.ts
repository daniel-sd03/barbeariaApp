import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { IonButton, IonIcon, IonContent, IonSearchbar, IonItem, IonLabel, IonList, IonAvatar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { searchOutline, trashOutline, createOutline, addOutline, arrowUndoOutline } from 'ionicons/icons';
import { HeaderComponent } from '../../componentes/header/header.component';
import { RouterLinkWithHref, Router } from '@angular/router';
import { Usuario } from 'src/app/interfaces/usuario';
import { UsuarioService } from 'src/app/services/usuarioService/usuario.service';

@Component({
  selector: 'app-painel-usuarios',
  templateUrl: './painel-usuarios.page.html',
  styleUrls: ['./painel-usuarios.page.scss'],
  standalone: true,
  imports: [IonButton, IonIcon, IonContent, IonSearchbar, IonItem, IonLabel, IonList, IonAvatar, CommonModule, FormsModule, HeaderComponent, RouterLinkWithHref]
})
export class PainelUsuariosPage implements OnInit {
  termo = '';
  usuarios: Usuario[] = [];
  filtrados: Usuario[] = [];
  pagina: Usuario[] = [];
  currentPage = 1;
  pageSize = 10;

  constructor(
    private usuarioService: UsuarioService,
    private alertController: AlertController,
    private router: Router
  ) {
    addIcons({ searchOutline, trashOutline, createOutline, addOutline, arrowUndoOutline });
  }

  ngOnInit(): void {
    this.usuarioService.getUsuarios().subscribe(list => {
      this.usuarios = list || [];
      this.aplicarFiltro();
    });
  }

  aplicarFiltro() {
    const termo = (this.termo || '').toLowerCase().trim();
    if (!termo) {
      this.filtrados = this.usuarios.slice();
      this.currentPage = 1;
      this.atualizarPagina();
      return;
    }
    this.filtrados = this.usuarios.filter(u =>
      (u.nome || '').toLowerCase().includes(termo) ||
      (u.email || '').toLowerCase().includes(termo)
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

  async confirmarExclusao(usuario: Usuario) {
    const alert = await this.alertController.create({
      header: 'Excluir usuário',
      message: `Tem certeza que deseja excluir "${usuario.nome}"?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Excluir', role: 'destructive', handler: async () => {
            await this.usuarioService.excluirUsuario(usuario.id);
            this.usuarios = this.usuarios.filter(u => u.id !== usuario.id);
            this.aplicarFiltro();
          }
        }
      ]
    });
    await alert.present();
  }

  editar(usuario: Usuario) {
    this.router.navigate(['/cadastro-usuario'], { queryParams: { id: usuario.id } });
  }

  novo() {
    this.router.navigate(['/cadastro-usuario']);
  }

  trackById(index: number, item: Usuario): string {
    return item.id;
  }
}
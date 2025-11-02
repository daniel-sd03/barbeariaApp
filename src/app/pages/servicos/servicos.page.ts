
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { caretForwardCircleOutline, closeOutline } from 'ionicons/icons';
import { HeaderComponent } from '../../componentes/header/header.component';
import { RouterLinkWithHref } from '@angular/router';
import { Observable } from 'rxjs';
import { Servico } from '../../interfaces/servico';
import { ServicoService } from 'src/app/services/servicoService/servico.service';


@Component({
  selector: 'app-servicos',
  templateUrl: './servicos.page.html',
  styleUrls: ['./servicos.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,HeaderComponent, RouterLinkWithHref]
})
export class ServicosPage{
  // Observable para usar com | async no template
  servicos$: Observable<Servico[]>;

  constructor(private servicoService: ServicoService){
    addIcons({ caretForwardCircleOutline,closeOutline});
    // Busca dinâmica do Firestore via Service
    this.servicos$ = this.servicoService.getServicos();
  }

  // trackBy para performance do *ngFor
  trackById(index: number, item: Servico) {
    return item.id;
  }
}

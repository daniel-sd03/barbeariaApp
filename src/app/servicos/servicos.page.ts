import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { caretForwardCircleOutline, closeOutline } from 'ionicons/icons';
import { HeaderComponent } from '../componentes/header/header.component';
import { RouterLinkWithHref } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Servico } from '../interfaces/servico'; 


@Component({
  selector: 'app-servicos',
  templateUrl: './servicos.page.html',
  styleUrls: ['./servicos.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,HeaderComponent, RouterLinkWithHref]
})
export class ServicosPage{
   // Expor como Observable para manter compatibilidade com o template (| async)
  servicos$: Observable<Servico[]>;

  constructor(){
    addIcons({ caretForwardCircleOutline,closeOutline});
     this.servicos$ = of(this.dadosMock);
  }
  
  // Dados estáticos para teste
  private dadosMock: Servico[] = [
    {
      id: 1,
      titulo: 'Cortes',
      duracao: '30 minutos',
      imagem: 'assets/fotos/servicos/servico01.jpg',
      preco: 30
    },
    {
      id: 2,
      titulo: 'Corte e barba',
      duracao: '45 minutos',
      imagem: 'assets/fotos/servicos/servico02.jpg',
      preco: 50
    },
    {
      id: 3,
      titulo: 'Barba',
      duracao: '20 minutos',
      imagem: 'assets/fotos/servicos/servico03.jpeg',
      preco: 25
    },
    {
      id: 4,
      titulo: 'Nevou',
      duracao: '30 minutos',
      imagem: 'assets/fotos/servicos/servico04.jpeg',
      preco: 35
    }
  ];

  // trackBy para performance do *ngFor
  trackById(index: number, item: Servico) {
    return item.id;
  }
}



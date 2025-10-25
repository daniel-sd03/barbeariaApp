import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterLinkWithHref } from '@angular/router';
import { addIcons } from 'ionicons';
import { closeOutline } from 'ionicons/icons';
import { HeaderComponent } from '../../componentes/header/header.component';

@Component({
  selector: 'app-cadastro-servico',
  templateUrl: './cadastro-servico.page.html',
  styleUrls: ['./cadastro-servico.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HeaderComponent, RouterLinkWithHref]
})
export class CadastroServicoPage{
 constructor() {
    addIcons({closeOutline})
   }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { closeOutline } from 'ionicons/icons';
import { HeaderComponent } from '../../componentes/header/header.component';
import { RouterLinkWithHref } from '@angular/router';

@Component({
  selector: 'app-cadastro-barbeiro',
  templateUrl: './cadastro-barbeiro.page.html',
  styleUrls: ['./cadastro-barbeiro.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HeaderComponent, RouterLinkWithHref]
})
export class CadastroBarbeiroPage {
  constructor() {
    addIcons({closeOutline})
   }
}

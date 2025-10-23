import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterLinkWithHref } from '@angular/router';
import { addIcons } from 'ionicons';
import { closeOutline } from 'ionicons/icons';
import { HeaderComponent } from '../componentes/header/header.component';

@Component({
  selector: 'app-cadastro-produto',
  templateUrl: './cadastro-produto.page.html',
  styleUrls: ['./cadastro-produto.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HeaderComponent, RouterLinkWithHref]
})
export class CadastroProdutoPage {

  constructor() {
    addIcons({closeOutline})
   }
}

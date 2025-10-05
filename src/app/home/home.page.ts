import { Component } from '@angular/core';
import {IonContent, IonButton, IonCardContent,
  IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonIcon,IonMenu } from '@ionic/angular/standalone';
import { RouterLinkWithHref } from '@angular/router';
import { HeaderComponent } from '../componentes/header/header.component';
import { addIcons } from 'ionicons';
import { reorderThreeOutline} from 'ionicons/icons';
import { MenuComponent } from '../componentes/menu/menu.component';
import { MenuController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonContent, IonButton, IonCardContent,
    IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle,
    RouterLinkWithHref, HeaderComponent, IonIcon, IonMenu, MenuComponent],
})

export class HomePage {
  constructor(private menu: MenuController) {
    addIcons({ reorderThreeOutline });
  }

  abrirMenu() {
    this.menu.open('main-menu');
  }
}

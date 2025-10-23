import { Component, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { IonContent, IonButton, IonIcon, IonMenu, IonItem, IonFooter, IonToolbar } from '@ionic/angular/standalone';
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
  imports: [IonContent, IonButton, HeaderComponent, IonIcon,
    IonMenu, MenuComponent, IonItem, IonFooter, IonToolbar, RouterLinkWithHref],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class HomePage {
  constructor(private menu: MenuController) {
    addIcons({ reorderThreeOutline });
  }

  abrirMenu() {
    this.menu.open('main-menu');
  }
}

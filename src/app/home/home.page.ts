import { Component } from '@angular/core';
import {IonContent, IonButton, IonCardContent,
  IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonIcon } from '@ionic/angular/standalone';
import { ActivatedRoute, RouterLinkWithHref } from '@angular/router';
import { HeaderComponent } from '../componentes/header/header.component';
import { addIcons } from 'ionicons';
import { reorderThreeOutline} from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonContent, IonButton, IonCardContent,
    IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle,
    RouterLinkWithHref, HeaderComponent, IonIcon],
})
export class HomePage {
  constructor() {
    addIcons({reorderThreeOutline});
  }
}

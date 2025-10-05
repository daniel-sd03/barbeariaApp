import { Component } from '@angular/core';
import { IonList, IonItem, IonHeader, IonToolbar, 
  IonTitle, IonMenuToggle, IonAccordionGroup, IonAccordion, IonIcon} from '@ionic/angular/standalone';
import { RouterLinkWithHref } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: true,
  imports: [IonList, IonItem, IonHeader,
     IonToolbar, IonTitle, IonMenuToggle, 
     RouterLinkWithHref, IonAccordionGroup, 
     IonAccordion] ,
})
export class MenuComponent {}

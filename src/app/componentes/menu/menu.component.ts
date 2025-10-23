  import { Component } from '@angular/core';
  import { IonList, IonItem, IonHeader, IonToolbar,
    IonTitle, IonMenuToggle, IonAccordionGroup, IonAccordion} from '@ionic/angular/standalone';
  import { RouterLinkWithHref } from '@angular/router';
  import { AuthService } from 'src/app/services/autenticador/auth.service';
  import { CommonModule } from '@angular/common';
  import { Observable, take } from 'rxjs';

  @Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss'],
    standalone: true,
    imports: [IonList, IonItem, IonHeader,
      IonToolbar, IonTitle, IonMenuToggle,
      RouterLinkWithHref, IonAccordionGroup,
      IonAccordion, CommonModule],
  })
  export class MenuComponent {
      public readonly isAdmin$: Observable<boolean>;

    constructor(private auth: AuthService){
       this.isAdmin$ = this.auth.isAdmin$;
    }

    logout(){ this.auth.logout(); }
  }

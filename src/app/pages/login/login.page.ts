import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLinkWithHref } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/autenticadorService/auth.service';
import { IonContent, IonButton, IonInput, } from "@ionic/angular/standalone";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonButton, IonContent, IonInput,  CommonModule, FormsModule, RouterLinkWithHref]
})
export class LoginPage {
  username = '';
  password = '';
  redirectTo: string | null = null;

  constructor(private route: ActivatedRoute, private router: Router, private auth: AuthService) {
    this.redirectTo = this.route.snapshot.queryParamMap.get('redirectTo');
  }

  async login() {
    try {
      const success = await this.auth.login(this.username, this.password);
      if (success) {
        const target = this.redirectTo || '/home';
        this.router.navigateByUrl(target);
      } else {
        alert('Usuário ou senha inválidos');
      }
    } catch (error) {
      console.error(error);
      alert('Erro no login');
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterLinkWithHref } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/autenticadorService/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLinkWithHref]
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

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, LoadingController, AlertController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { closeOutline } from 'ionicons/icons';
import { HeaderComponent } from '../../componentes/header/header.component';
import { RouterLinkWithHref } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-cadastro-usuario',
  templateUrl: './cadastro-usuario.page.html',
  styleUrls: ['./cadastro-usuario.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HeaderComponent, RouterLinkWithHref, ReactiveFormsModule]
})

export class CadastroUsuarioPage implements OnInit {
  credentials!: FormGroup;

  erroCadastro: string | null = null;

  constructor(
    private fb: FormBuilder,
    private UsuarioService: UsuarioService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {
    addIcons({ closeOutline })
  }

  ngOnInit() {
    this.credentials = this.fb.group({
      nome: ['', Validators.required],
      telefone: ['', Validators.required],
      cpf: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmaSenha: ['', Validators.required]
    }, { validator: this.passwordsMatch });
  }

  passwordsMatch(group: FormGroup) {
    const senha = group.get('senha')?.value;
    const confirma = group.get('confirmaSenha')?.value;
    return senha === confirma ? null : { notMatching: true };
  }

  async cadastrar() {
    this.erroCadastro = null;

    if (this.credentials.invalid) {
      this.erroCadastro = 'Erro', 'Preencha todos os campos corretamente.';
      return;
    }

    const loading = await this.loadingController.create();
    await loading.present();

    try {
      const user = await this.UsuarioService.cadastrarUsuario(this.credentials.value);
      await loading.dismiss();

      if (user) {
        this.router.navigateByUrl('/login', { replaceUrl: true });
      }
    } catch (error: any) {
      await loading.dismiss();

      const erroObj = this.tratarErro(error);
      this.erroCadastro = erroObj.message;
      if (erroObj.level === 'warn') console.warn("[CadastroUsuarioPage]", error.code, error.message);
      else console.error("[CadastroUsuarioPage] erro inesperado:", error);

    }
  }

  tratarErro(error: any) {
    const code = error?.code;
    switch (code) {
      case 'auth/email-already-in-use':
        return { message: 'Este e-mail já está cadastrado.', level: 'warn' };
      case 'auth/invalid-email':
        return { message: 'E-mail inválido.', level: 'warn' };
      case 'auth/weak-password':
        return { message: 'Senha fraca. Use no mínimo 6 caracteres.', level: 'warn' };
      default:
        return { message: 'Falha no registro. Tente novamente!', level: 'error' };
    }
  }

}

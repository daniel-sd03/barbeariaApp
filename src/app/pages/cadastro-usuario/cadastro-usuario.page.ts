import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingController, AlertController } from '@ionic/angular';
import { IonContent, IonItem, IonInput, IonSelect, IonSelectOption, IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeOutline } from 'ionicons/icons';
import { HeaderComponent } from '../../componentes/header/header.component';
import { RouterLinkWithHref, ActivatedRoute } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuarioService/usuario.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-cadastro-usuario',
  templateUrl: './cadastro-usuario.page.html',
  styleUrls: ['./cadastro-usuario.page.scss'],
  standalone: true,
  imports: [IonIcon, IonContent, IonItem, IonInput, IonSelect, IonSelectOption, IonButton, CommonModule, FormsModule, HeaderComponent, RouterLinkWithHref, ReactiveFormsModule]
})

export class CadastroUsuarioPage implements OnInit {
  credentials!: FormGroup;

  erroCadastro: string | null = null;
  usuarioId: string | null = null;
  modoEdicao = false;

  constructor(
    private fb: FormBuilder,
    private UsuarioService: UsuarioService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private route: ActivatedRoute
  ) {
    addIcons({ closeOutline })
  }

  ngOnInit() {
    this.credentials = this.fb.group({
      nome: ['', Validators.required],
      telefone: ['', Validators.required],
      cpf: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['User'],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmaSenha: ['', Validators.required]
    }, { validator: this.passwordsMatch });

    this.route.queryParamMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.usuarioId = id;
        this.modoEdicao = true;
        // No modo edição, removemos validação de senha
        this.credentials.get('senha')?.clearValidators();
        this.credentials.get('senha')?.updateValueAndValidity();
        this.credentials.get('confirmaSenha')?.clearValidators();
        this.credentials.get('confirmaSenha')?.updateValueAndValidity();
        this.carregarUsuario(id);
      }
    });
  }

  passwordsMatch(group: FormGroup) {
    const senha = group.get('senha')?.value;
    const confirma = group.get('confirmaSenha')?.value;
    return senha === confirma ? null : { notMatching: true };
  }

  async carregarUsuario(id: string) {
    const loading = await this.loadingController.create({ message: 'Carregando usuário...' });
    await loading.present();
    try {
      this.UsuarioService.getUsuarioById(id).subscribe({
        next: (usuario) => {
          this.credentials.patchValue({
            nome: usuario.nome,
            telefone: usuario.telefone,
            cpf: usuario.cpf,
            email: usuario.email,
            role: usuario.role || 'User'
          });
          loading.dismiss();
        },
        error: (err) => {
          console.error('[CadastroUsuarioPage] erro ao carregar usuário:', err);
          loading.dismiss();
        }
      });
    } catch (err) {
      console.error('[CadastroUsuarioPage] erro ao carregar usuário:', err);
      await loading.dismiss();
    }
  }

  async salvarOuAtualizar() {
    this.erroCadastro = null;

    if (this.credentials.invalid) {
      this.erroCadastro = 'Erro', 'Preencha todos os campos corretamente.';
      return;
    }

    const loading = await this.loadingController.create();
    await loading.present();

    try {
      if (this.modoEdicao && this.usuarioId) {
        await this.UsuarioService.atualizarUsuario(this.usuarioId, {
          nome: this.credentials.value.nome,
          telefone: this.credentials.value.telefone,
          cpf: this.credentials.value.cpf,
          role: this.credentials.value.role
        });
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Sucesso',
          message: 'Usuário atualizado com sucesso.',
          buttons: [{ text: 'OK', handler: () => this.router.navigate(['/painel-usuarios']) }]
        });
        await alert.present();
      } else {
        const user = await this.UsuarioService.cadastrarUsuario(this.credentials.value);
        await loading.dismiss();
        if (user) {
          const alert = await this.alertController.create({
            header: 'Sucesso',
            message: 'Usuário cadastrado com sucesso.',
            buttons: [{ text: 'OK', handler: () => this.router.navigate(['/painel-usuarios']) }]
          });
          await alert.present();
        }
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

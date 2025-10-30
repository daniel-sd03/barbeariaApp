import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLinkWithHref } from '@angular/router';
import { IonicModule, LoadingController, AlertController } from '@ionic/angular';
import { HeaderComponent } from '../../componentes/header/header.component';
import { BarbeiroService } from 'src/app/services/barbeiroService/barbeiro.service';
import { Barbeiro } from 'src/app/interfaces/barbeiro';

@Component({
  selector: 'app-cadastro-barbeiro',
  templateUrl: './cadastro-barbeiro.page.html',
  styleUrls: ['./cadastro-barbeiro.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HeaderComponent, RouterLinkWithHref, ReactiveFormsModule]
})
export class CadastroBarbeiroPage implements OnInit {
  form!: FormGroup;
  erroCadastro: string | null = null;

  constructor(
    private fb: FormBuilder,
    private barbeiroService: BarbeiroService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private router: Router
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      telefone: ['', Validators.required],
      cpf: ['', Validators.required],
       email: ['', [Validators.required, Validators.email]],
    });
  }

  isTelefoneValido(): boolean {
    const tel = this.form.get('telefone')?.value ?? '';
    const telLimpo = String(tel).replace(/\D/g, '');
    return telLimpo.length === 10 || telLimpo.length === 11;
  }

  isCpfValido(): boolean {
    const cpf = this.form.get('cpf')?.value ?? '';
    const cpfLimpo = String(cpf).replace(/\D/g, '');
    return cpfLimpo.length === 11;
  }

  async cadastrar() {
    this.erroCadastro = null;

    // marca todos como touched para mostrar erros do template
    this.form.markAllAsTouched();

    // validações extras (ex.: telefone/CPF)
    if (this.form.invalid || !this.isTelefoneValido() || !this.isCpfValido()) {
      this.erroCadastro = 'Preencha os campos obrigatórios corretamente.';
      return;
    }

    const loading = await this.loadingCtrl.create({ message: 'Cadastrando barbeiro...' });
    await loading.present();

    try {
      const payload: Omit<Barbeiro, 'id'> = {
        nome: this.form.value.nome,
        telefone: this.form.value.telefone,
        cpf: this.form.value.cpf,
        email: this.form.value.email,
        foto: this.form.value.foto ? this.form.value.foto : null
      };

      await this.barbeiroService.cadastrarBarbeiro(payload);
      await loading.dismiss();

      // sucesso: alerta e redireciona para a home
      const alert = await this.alertCtrl.create({
        header: 'Sucesso',
        message: 'Barbeiro cadastrado com sucesso.',
        buttons: [{
          text: 'OK',
          handler: () => this.router.navigateByUrl('/', { replaceUrl: true })
        }]
      });
      await alert.present();
    } catch (erro: any) {
      await loading.dismiss();
      console.error('[CadastroBarbeiroPage] erro ao cadastrar barbeiro:', erro);
      this.erroCadastro = 'Não foi possível concluir o cadastro do barbeiro.\nTente novamente. Se o problema persistir, entre em contato com nossa equipe de desenvolvimento.';
    }
  }
}

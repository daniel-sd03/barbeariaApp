import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLinkWithHref, ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { IonContent, IonItem, IonInput, IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeOutline } from 'ionicons/icons';
import { HeaderComponent } from '../../componentes/header/header.component';
import { BarbeiroService } from 'src/app/services/barbeiroService/barbeiro.service';
import { Barbeiro } from 'src/app/interfaces/barbeiro';

@Component({
  selector: 'app-cadastro-barbeiro',
  templateUrl: './cadastro-barbeiro.page.html',
  styleUrls: ['./cadastro-barbeiro.page.scss'],
  standalone: true,
  imports: [IonIcon, IonContent, IonItem, IonInput, IonButton, CommonModule, FormsModule, HeaderComponent, RouterLinkWithHref, ReactiveFormsModule]
})
export class CadastroBarbeiroPage implements OnInit {
  form!: FormGroup;
  erroCadastro: string | null = null;
  barbeiroId: string | null = null;
  modoEdicao = false;

  constructor(
    private fb: FormBuilder,
    private barbeiroService: BarbeiroService,
    private alertCtrl: AlertController,
    private router: Router,
    private route: ActivatedRoute
  ) {
    addIcons({ closeOutline });
  }

  ngOnInit() {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      telefone: ['', Validators.required],
      cpf: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });

    this.route.queryParamMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.barbeiroId = id;
        this.modoEdicao = true;
          this.carregarBarbeiro(id);
      }
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

  async carregarBarbeiro(id: string) {
    try {
      this.barbeiroService.getBarbeiroById(id).subscribe({
        next: (barbeiro) => {
          this.form.patchValue({
            nome: barbeiro.nome,
            telefone: barbeiro.telefone,
            cpf: barbeiro.cpf,
            email: barbeiro.email
          });
        },
        error: (err) => {
          console.error('[CadastroBarbeiroPage] erro ao carregar barbeiro:', err);
        }
      });
    } catch (err) {
      console.error('[CadastroBarbeiroPage] erro ao carregar barbeiro:', err);
    }
  }

  async salvarOuAtualizar() {
    this.erroCadastro = null;

    // marca todos como touched para mostrar erros do template
    this.form.markAllAsTouched();

    // validações extras (ex.: telefone/CPF)
    if (this.form.invalid || !this.isTelefoneValido() || !this.isCpfValido()) {
      this.erroCadastro = 'Preencha os campos obrigatórios corretamente.';
      return;
    }


    try {
      const payload: Omit<Barbeiro, 'id'> = {
        nome: this.form.value.nome,
        telefone: this.form.value.telefone,
        cpf: this.form.value.cpf,
        email: this.form.value.email,
        foto: this.form.value.foto ? this.form.value.foto : null
      };
      if (this.modoEdicao && this.barbeiroId) {
        await this.barbeiroService.atualizarBarbeiro({id: this.barbeiroId, ...payload});
        const alert = await this.alertCtrl.create({
          header: 'Sucesso',
          message: 'Barbeiro atualizado com sucesso.',
          buttons: [{ text: 'OK', handler: () => this.router.navigate(['/painel-barbeiros']) }]
        });
        await alert.present();
      } else {
        await this.barbeiroService.cadastrarBarbeiro(payload);
        const alert = await this.alertCtrl.create({
          header: 'Sucesso',
          message: 'Barbeiro cadastrado com sucesso.',
          buttons: [{ text: 'OK', handler: () => this.router.navigate(['/painel-barbeiros']) }]
        });
        await alert.present();
      }
    } catch (erro: any) {
      console.error('[CadastroBarbeiroPage] erro ao cadastrar barbeiro:', erro);
      this.erroCadastro = 'Não foi possível concluir o cadastro do barbeiro.\nTente novamente. Se o problema persistir, entre em contato com nossa equipe de desenvolvimento.';
    }
  }
}

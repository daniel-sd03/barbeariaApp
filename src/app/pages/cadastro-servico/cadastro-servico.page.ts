import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastController, AlertController } from '@ionic/angular';
import { IonContent, IonItem, IonInput, IonButton, IonIcon } from '@ionic/angular/standalone';
import { Router, RouterLink, RouterLinkWithHref, ActivatedRoute } from '@angular/router';
import { addIcons } from 'ionicons';
import { closeOutline } from 'ionicons/icons';
import { HeaderComponent } from '../../componentes/header/header.component';
import { ServicoService } from 'src/app/services/servicoService/servico.service';
import { Servico } from 'src/app/interfaces/servico';

@Component({
  selector: 'app-cadastro-servico',
  templateUrl: './cadastro-servico.page.html',
  styleUrls: ['./cadastro-servico.page.scss'],
  standalone: true,
  imports: [IonIcon, IonContent, IonItem, IonInput, IonButton, CommonModule, FormsModule, ReactiveFormsModule, HeaderComponent, RouterLink,  RouterLinkWithHref]
})
export class CadastroServicoPage implements OnInit  {
  form!: FormGroup;
  isSubmitting = false;
  erroCadastro: string | null = null;
  servicoId: string | null = null;
  modoEdicao = false;

  constructor(
    private formBuilder: FormBuilder,
    private servicoService: ServicoService,
    private alertCtrl: AlertController,
    private router: Router,
    private route: ActivatedRoute
  ) {
    addIcons({closeOutline});
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      preco: ['', [Validators.required, Validators.min(0.01)]],
      duracao: ['', [Validators.required]],
      imagem: ['']
    });

    this.route.queryParamMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.servicoId = id;
        this.modoEdicao = true;
        this.carregarServico(id);
      }
    });
  }

  // Método para facilitar acesso aos controles do formulário nos templates
  get f() {
    return this.form.controls;
  }

  // Método para cadastrar o serviço
  async carregarServico(id: string) {
    try {
      this.servicoService.getServicoById(id).subscribe({
        next: (servico) => {
          this.form.patchValue({
            titulo: servico.titulo,
            preco: servico.preco,
            duracao: servico.duracao,
            imagem: servico.imagem
          });
        },
        error: (err) => {
          console.error('[CadastroServicoPage] erro ao carregar serviço:', err);
        }
      });
    } catch (err) {
      console.error('[CadastroServicoPage] erro ao carregar serviço:', err);
    }
  }

  async salvarOuAtualizar() {
    this.erroCadastro = null;

    // marca todos como touched para mostrar erros do template
    this.form.markAllAsTouched();

    // validações
    if (this.form.invalid) {
      this.erroCadastro = 'Preencha os campos obrigatórios corretamente.';
      return;
    }


    try {
      const dados: Omit<Servico, 'id'> = {
        titulo: this.form.value.titulo,
        preco: this.form.value.preco,
        duracao: this.form.value.duracao,
        imagem: this.form.value.imagem || ""
      };
      if (this.modoEdicao && this.servicoId) {
        await this.servicoService.atualizarServico({ id: this.servicoId, ...dados });
        const alert = await this.alertCtrl.create({
          header: 'Sucesso',
          message: 'Serviço atualizado com sucesso.',
          buttons: [{ text: 'OK', handler: () => this.router.navigate(['/painel-servicos']) }]
        });
        await alert.present();
      } else {
        // Chama o serviço para cadastrar
        await this.servicoService.cadastrarServico(dados);
        const alert = await this.alertCtrl.create({
          header: 'Sucesso',
          message: 'Serviço cadastrado com sucesso.',
          buttons: [{ text: 'OK', handler: () => this.router.navigate(['/painel-servicos']) }]
        });
        await alert.present();
      }
    } catch (erro: any) {
      console.error('[CadastroServicoPage] erro ao cadastrar serviço:', erro);
      this.erroCadastro = 'Não foi possível concluir o cadastro do serviço.\nTente novamente. Se o problema persistir, entre em contato com nossa equipe de desenvolvimento.';
    }
  }
}

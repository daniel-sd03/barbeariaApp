import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ToastController, LoadingController, AlertController } from '@ionic/angular';
import { Router, RouterLink, RouterLinkWithHref } from '@angular/router';
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
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, HeaderComponent, RouterLink,  RouterLinkWithHref]
})
export class CadastroServicoPage implements OnInit  {
  form!: FormGroup;
  isSubmitting = false;
  erroCadastro: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private servicoService: ServicoService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private router: Router
  ) {
    addIcons({closeOutline});
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      preco: ['', [Validators.required, Validators.min(0.01)]],
      duracao: ['', [Validators.required]]
    });
  }

  // Método para facilitar acesso aos controles do formulário nos templates
  get f() {
    return this.form.controls;
  }

  // Método para cadastrar o serviço
  async cadastrarServico() {
    this.erroCadastro = null;

    // marca todos como touched para mostrar erros do template
    this.form.markAllAsTouched();

    // validações
    if (this.form.invalid) {
      this.erroCadastro = 'Preencha os campos obrigatórios corretamente.';
      return;
    }

    const loading = await this.loadingCtrl.create({ message: 'Cadastrando serviço...' });
    await loading.present();

    try {
      // Prepara os dados do serviço
      const payload: Omit<Servico, 'id'> = {
        titulo: this.form.value.titulo,
        preco: this.form.value.preco,
        duracao: this.form.value.duracao,
        imagem: 'assets/default-service.jpg' // Imagem padrão para o serviço
      };

      // Chama o serviço para cadastrar
      await this.servicoService.cadastrarServico(payload);
      await loading.dismiss();

      // sucesso: alerta e redireciona para a home
      const alert = await this.alertCtrl.create({
        header: 'Sucesso',
        message: 'Serviço cadastrado com sucesso.',
        buttons: [{
          text: 'OK',
          handler: () => this.router.navigateByUrl('/', { replaceUrl: true })
        }]
      });
      await alert.present();
    } catch (erro: any) {
      await loading.dismiss();
      console.error('[CadastroServicoPage] erro ao cadastrar serviço:', erro);
      this.erroCadastro = 'Não foi possível concluir o cadastro do serviço.\nTente novamente. Se o problema persistir, entre em contato com nossa equipe de desenvolvimento.';
    }
  }
}

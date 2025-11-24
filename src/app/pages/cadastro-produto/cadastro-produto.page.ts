import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { IonContent, IonItem, IonInput, IonButton, IonIcon } from '@ionic/angular/standalone';
import { ActivatedRoute, Router, RouterLink, RouterLinkWithHref } from '@angular/router';
import { addIcons } from 'ionicons';
import { closeOutline } from 'ionicons/icons';
import { HeaderComponent } from '../../componentes/header/header.component';
import { ProdutoService } from 'src/app/services/produtoService/produto.service';
import { Produto } from 'src/app/interfaces/produto';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-cadastro-produto',
  templateUrl: './cadastro-produto.page.html',
  styleUrls: ['./cadastro-produto.page.scss'],
  standalone: true,
  imports: [IonIcon, IonContent, IonItem, IonInput, IonButton, CommonModule, FormsModule, ReactiveFormsModule, HeaderComponent, RouterLink, RouterLinkWithHref]
})
export class CadastroProdutoPage implements OnInit {
  form!: FormGroup;
  erroCadastro: string | null = null;
  produtoId: string | null = null;
  modoEdicao = false;

  constructor(
    private formBuilder: FormBuilder,
    private produtoService: ProdutoService,
    private alertCtrl: AlertController,
    private router: Router,
    private route: ActivatedRoute
  ) {
    addIcons({closeOutline});
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      preco: ['', [Validators.required, Validators.min(0.01)]],
      quantidade: ['', [Validators.required, Validators.min(0)]],
      imagem: ['']
    });

    // Detecta modo edição: se existir ?id= na URL, carrega dados
    this.route.queryParamMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.produtoId = id;
        this.modoEdicao = true;
        this.carregarProduto(id);
      }
    });
  }

  // Método para facilitar acesso aos controles do formulário nos templates
  get f() {
    return this.form.controls;
  }

  private async carregarProduto(id: string) {
    try {
       const produto = await firstValueFrom(this.produtoService.getProdutoById(id));
      if (produto) {
        this.form.patchValue({
          nome: produto.nome,
          preco: produto.preco,
          quantidade: produto.quantidade,
          imagem: produto.imagem || ''
        });
      }
    } catch (erro) {
      console.error('[CadastroProdutoPage] erro ao carregar produto:', erro);
      this.erroCadastro = 'Não foi possível carregar os dados do produto para edição.';
    }
  }

  // Decide entre cadastrar ou atualizar conforme o modo
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
      // Prepara os dados do produto
      const payload: Omit<Produto, 'id'> = {
        nome: this.form.value.nome,
        preco: Number(this.form.value.preco),
        quantidade: Number(this.form.value.quantidade) || 0,
        imagem: this.form.value.imagem || ''
      };

      if (this.modoEdicao && this.produtoId) {
        // Atualiza produto existente
        await this.produtoService.atualizarProduto({ id: this.produtoId, ...payload });
        const alert = await this.alertCtrl.create({
          header: 'Sucesso',
          message: 'Produto atualizado com sucesso.',
          buttons: [{ text: 'OK', handler: () => this.router.navigate(['/painel-produtos']) }]
        });
        await alert.present();
      } else {
        // Cadastra novo produto
        await this.produtoService.cadastrarProduto(payload);
        const alert = await this.alertCtrl.create({
          header: 'Sucesso',
          message: 'Produto cadastrado com sucesso.',
          buttons: [{ text: 'OK', handler: () => this.router.navigate(['/painel-produtos']) }]
        });
        await alert.present();
      }
    } catch (erro: any) {
      console.error('[CadastroProdutoPage] erro ao salvar/atualizar produto:', erro);
      this.erroCadastro = this.modoEdicao
        ? 'Não foi possível atualizar o produto. Tente novamente.'
        : 'Não foi possível concluir o cadastro do produto. Tente novamente.';
    }
  }
}

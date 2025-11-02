import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, LoadingController, AlertController } from '@ionic/angular';
import { Router, RouterLink, RouterLinkWithHref } from '@angular/router';
import { addIcons } from 'ionicons';
import { closeOutline } from 'ionicons/icons';
import { HeaderComponent } from '../../componentes/header/header.component';
import { ProdutoService } from 'src/app/services/produtoService/produto.service';
import { Produto } from 'src/app/interfaces/produto';

@Component({
  selector: 'app-cadastro-produto',
  templateUrl: './cadastro-produto.page.html',
  styleUrls: ['./cadastro-produto.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, HeaderComponent, RouterLink, RouterLinkWithHref]
})
export class CadastroProdutoPage implements OnInit {
  form!: FormGroup;
  erroCadastro: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private produtoService: ProdutoService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private router: Router
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
  }

  // Método para facilitar acesso aos controles do formulário nos templates
  get f() {
    return this.form.controls;
  }

  // Método para cadastrar o produto
  async cadastrarProduto() {
    this.erroCadastro = null;

    // marca todos como touched para mostrar erros do template
    this.form.markAllAsTouched();

    // validações
    if (this.form.invalid) {
      this.erroCadastro = 'Preencha os campos obrigatórios corretamente.';
      return;
    }

    const loading = await this.loadingCtrl.create({ message: 'Cadastrando produto...' });
    await loading.present();

    try {
      // Prepara os dados do produto
      const payload: Omit<Produto, 'id'> = {
        nome: this.form.value.nome,
        preco: this.form.value.preco,
        quantidade: this.form.value.quantidade || 0,
        imagem: this.form.value.imagem || 'assets/default-product.jpg'
      };

      // Chama o serviço para cadastrar
      await this.produtoService.cadastrarProduto(payload);
      await loading.dismiss();

      // sucesso: alerta e redireciona para a home
      const alert = await this.alertCtrl.create({
        header: 'Sucesso',
        message: 'Produto cadastrado com sucesso.',
        buttons: [{
          text: 'OK',
          handler: () => this.router.navigateByUrl('/', { replaceUrl: true })
        }]
      });
      await alert.present();
    } catch (erro: any) {
      await loading.dismiss();
      console.error('[CadastroProdutoPage] erro ao cadastrar produto:', erro);
      this.erroCadastro = 'Não foi possível concluir o cadastro do produto.\nTente novamente. Se o problema persistir, entre em contato com nossa equipe de desenvolvimento.';
    }
  }
}

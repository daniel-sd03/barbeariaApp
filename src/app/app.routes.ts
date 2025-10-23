import { Routes } from '@angular/router';
import { AuthGuard } from './guards/autenticador/auth.guard';
import { AdminGuard } from './guards/admin/admin.guard';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'escolher-servico',
    loadComponent: () => import('./servicos/servicos.page').then( m => m.ServicosPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'agendamento',
    loadComponent: () => import('./agendamento/agendamento.page').then( m => m.AgendamentoPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'carrinho-de-compra',
    loadComponent: () => import('./carrinho/carrinho.page').then( m => m.CarrinhoPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'produtos',
    loadComponent: () => import('./produtos/produtos.page').then( m => m.ProdutosPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'cadastro-usuario',
    loadComponent: () => import('./cadastro-usuario/cadastro-usuario.page').then( m => m.CadastroUsuarioPage),
  },
  {
    path: 'cadastro-produto',
    loadComponent: () => import('./cadastro-produto/cadastro-produto.page').then( m => m.CadastroProdutoPage),
    canActivate: [AdminGuard]
  },
  {
    path: 'cadastro-servico',
    loadComponent: () => import('./cadastro-servico/cadastro-servico.page').then( m => m.CadastroServicoPage),
    canActivate: [AdminGuard]
  },
  {
    path: 'cadastro-barbeiro',
    loadComponent: () => import('./cadastro-barbeiro/cadastro-barbeiro.page').then( m => m.CadastroBarbeiroPage),
    canActivate: [AdminGuard]
  },

];

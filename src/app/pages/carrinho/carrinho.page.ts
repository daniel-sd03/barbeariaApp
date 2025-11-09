import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { closeOutline, timeOutline, addCircleOutline, removeCircleOutline } from 'ionicons/icons';
import { HeaderComponent } from '../../componentes/header/header.component';
import { RouterLinkWithHref } from '@angular/router';
import { Subscription } from 'rxjs';
import { Produto } from 'src/app/interfaces/produto';
import { CarrinhoService } from '../../services/carrinhoService/carrinho.service';
import { Agendamento } from 'src/app/interfaces/agendamento';
import { Barbeiro } from 'src/app/interfaces/barbeiro';
import { Servico } from 'src/app/interfaces/servico';
import { BarbeiroService } from 'src/app/services/barbeiroService/barbeiro.service';
import { ServicoService } from 'src/app/services/servicoService/servico.service';
import { AgendamentoService } from 'src/app/services/agendamentoService/agendamento.service';
import { OrdemServicoService } from 'src/app/services/ordemServicoService/ordem-servico.service';
import { OrdemServico } from 'src/app/interfaces/ordem-servico';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { IMAGENS_PADRAO } from 'src/app/config/imagens-padrao';

@Component({
  selector: 'app-carrinho-de-compra',
  templateUrl: './carrinho.page.html',
  styleUrls: ['./carrinho.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HeaderComponent, RouterLinkWithHref]
})

export class CarrinhoPage implements OnInit, OnDestroy {
  IMAGENS_PADRAO = IMAGENS_PADRAO;
  produtos: Produto[] = [];
  agendamento?: Agendamento;
  barbeiro?: Barbeiro;
  servico?: Servico;
  duracaoMin: number = 0;
  horaFim: string = '';
  total: number = 0;
  private sub!: Subscription;

  constructor(
    private carrinhoService: CarrinhoService,
    private barbeiroService: BarbeiroService,
    private servicoService: ServicoService,
    private agendamentoService: AgendamentoService,
    private ordemServicoService: OrdemServicoService,
    private alertController: AlertController,
    private router: Router,
    private auth: Auth
  ) {
    addIcons({ closeOutline, timeOutline, addCircleOutline, removeCircleOutline })
  }

  ngOnInit() {
    // inscreve no carrinho completo
    this.sub = this.carrinhoService.getCarrinho().subscribe(carrinho => {
      this.produtos = carrinho.produtos;
      this.agendamento = carrinho.agendamento;

      if (this.agendamento) {
        // carregar barbeiro
        this.barbeiroService.getBarbeiroById(this.agendamento.barbeiroId).subscribe(b => {
          this.barbeiro = b;
        });
        // carregar serviço
        this.servicoService.getServicoById(this.agendamento.servicoId).subscribe(s => {
          this.servico = s;
          this.duracaoMin = this.parseDuracaoMinutos(s?.duracao);
          this.horaFim = this.calcularHoraFim(this.agendamento!.horario, this.duracaoMin);
        });
      } else {
        this.barbeiro = undefined;
        this.servico = undefined;
        this.duracaoMin = 0;
        this.horaFim = '';
      }

      this.recalcularTotal();
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  trackById(index: number, item: Produto) {
    return item.id;
  }

  atualizarQuantidade(id: String, valor: any) {
    const qtd = Number(valor);
    if (isNaN(qtd)) return;
    this.carrinhoService.updateProdutoQuantidade(id, Math.max(1, Math.floor(qtd)));
    // a subscription vai atualizar produtos e total automaticamente
  }

  removerProduto(id: String) {
    this.carrinhoService.removeProduto(id);
  }

  removerAgendamento() {
    this.carrinhoService.removeAgendamento();
  }

  recalcularTotal() {
    this.total = (this.servico?.preco || 0) + this.produtos.reduce((acc, p) => acc + (p.preco || 0) * (p.quantidade || 0), 0);
  }

  async finalizarCompra() {
    try {
      // Verifica se tem agendamento ou produtos
      const temAgendamento = !!this.agendamento;
      const temProdutos = (this.produtos || []).some(p => (p.quantidade || 0) > 0);

      if (!temAgendamento && !temProdutos) {
        const alertVazio = await this.alertController.create({
          header: 'Atenção',
          message: 'Adicione um agendamento ou ao menos um produto para finalizar.',
          buttons: ['OK']
        });
        await alertVazio.present();
        return;
      }

      //  1) Salvar agendamento se existir
      let agendamentoId: string | undefined;
      if (temAgendamento && this.agendamento) {
        agendamentoId = await this.agendamentoService.criarAgendamento(this.agendamento);
      }


      //  2) Montar agendamento (com id do Firestore)
      let agendamento: Agendamento | undefined;
      if (temAgendamento && this.agendamento) {
        agendamento = {
          id: agendamentoId!,
          ...this.agendamento
        } as Agendamento;
      }

      //  3) Criar ordem de serviço
      const clienteId = this.auth.currentUser?.uid;
      if (!clienteId) throw new Error('Usuário não autenticado');

      const ordem: Omit<OrdemServico, 'id'> = {
        clienteId,
        ...(temAgendamento ? { agendamento } : {}), // adiciona só se existir
       ...(temProdutos ? { produtos: this.produtos } : {}),          // adiciona só se existir
        total: this.total,
        dtOS: new Date()
      };

      // 🔹 4) Salvar ordem
      await this.ordemServicoService.salvarOrdemServico(ordem);

      // 🔹 5) Limpar carrinho
      this.carrinhoService.removeAgendamento();
      this.carrinhoService.setItems([]);

      // 🔹 6) Sucesso
      const alert = await this.alertController.create({
        header: 'Sucesso',
        message: 'Compra finalizada com sucesso!',
        buttons: [{ text: 'OK', handler: () => this.router.navigate(['/home']) }]
      });
      await alert.present();

    } catch (err) {
      const alertErr = await this.alertController.create({
        header: 'Erro',
        message: 'Não foi possível finalizar a compra. Tente novamente.',
        buttons: ['OK']
      });
      await alertErr.present();
      console.error('[finalizarCompra] erro:', err);
    }
  }

  aumentarQuantidade(id: String) {
    const item = this.produtos.find(p => p.id === id);
    const atual = (item?.quantidade || 0) + 1;
    this.carrinhoService.updateProdutoQuantidade(id, atual);
  }

  diminuirQuantidade(id: String, quantidadeAtual: number) {
    if (quantidadeAtual <= 1) {
      this.carrinhoService.removeProduto(id);
      return;
    }
    this.carrinhoService.updateProdutoQuantidade(id, quantidadeAtual - 1);
  }

  // Helpers de formatação
  formatPreco(valor?: number) {
    return (valor ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

 formatDia(iso?: string) {
  if (!iso) return '';
  const [year, month, day] = iso.split('-').map(Number);
  return String(day).padStart(2, '0'); // não cria Date, só pega o dia
}

formatMesAbrev(iso?: string) {
  if (!iso) return '';
  const meses = ['JAN','FEV','MAR','ABR','MAI','JUN','JUL','AGO','SET','OUT','NOV','DEZ'];
  const [year, month] = iso.split('-').map(Number);
  return meses[month - 1]; // mês vem 1-12
}

  parseDuracaoMinutos(duracao: any): number {
    if (typeof duracao === 'number') return duracao;
    if (typeof duracao === 'string') {
      const n = parseInt(duracao.replace(/\D+/g, ''), 10);
      return isNaN(n) ? 45 : n;
    }
    return 45;
  }

  calcularHoraFim(horaInicio: string, minutos: number): string {
    const [h, m] = horaInicio.split(':').map(n => parseInt(n, 10));
    const start = new Date();
    start.setHours(h || 0, m || 0, 0, 0);
    const fim = new Date(start.getTime() + minutos * 60000);
    const hh = String(fim.getHours()).padStart(2, '0');
    const mm = String(fim.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  }
}

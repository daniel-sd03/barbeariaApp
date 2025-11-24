import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonButton, IonList, IonItem, IonThumbnail, IonLabel, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowUndoOutline } from 'ionicons/icons';
import { HeaderComponent } from '../../componentes/header/header.component';
import { RouterLinkWithHref, ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Barbeiro } from '../../interfaces/barbeiro';
import { Servico } from '../../interfaces/servico';
import { Agendamento, DisponibilidadeBarbeiro } from '../../interfaces/agendamento';
import { BarbeiroService } from '../../services/barbeiroService/barbeiro.service';
import { AgendamentoService } from '../../services/agendamentoService/agendamento.service';
import { ServicoService } from '../../services/servicoService/servico.service';
import { CarrinhoService } from '../../services/carrinhoService/carrinho.service';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { IMAGENS_PADRAO } from 'src/app/config/imagens-padrao';

@Component({
  selector: 'app-agendamento',
  templateUrl: './agendamento.page.html',
  styleUrls: ['./agendamento.page.scss'],
  standalone: true,
  imports: [IonIcon, IonContent, IonButton, IonList, IonItem, IonThumbnail, IonLabel, CommonModule, FormsModule, HeaderComponent, RouterLinkWithHref]
})

export class AgendamentoPage implements OnInit {
  IMAGENS_PADRAO = IMAGENS_PADRAO;
  mesAtual: string = '';
  servicoSelecionado?: Servico;
  clienteId?: string;

  // profissionais vindos do Firestore
  profissionais$: Observable<Barbeiro[]> = of([]);

  // data atualmente selecionada (Date)
  selectedDate = new Date();

  // lista de dias que iremos mostrar (por padrão a semana a partir da selectedDate)
  semana: Date[] = [];

  // disponibilidades por barbeiro para a data selecionada
  disponibilidades: { [barbeiroId: string]: DisponibilidadeBarbeiro } = {};

  // qual profissional/horario foi selecionado (para confirmar)
  selectedProfissional?: Barbeiro;
  selectedHorario?: string;
  selectedDataISO?: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private barbeiroService: BarbeiroService,
    private agendamentoService: AgendamentoService,
    private servicoService: ServicoService,
    private carrinhoService: CarrinhoService,
    private auth: Auth
  ) {
    addIcons({ arrowUndoOutline })
    this.buildSemana();
  }

  ngOnInit() {
    this.mesAtual = this.getMesAtual();

    // Obter ID do cliente autenticado
    this.clienteId = this.auth.currentUser?.uid || undefined;
    onAuthStateChanged(this.auth, (user) => {
      this.clienteId = user?.uid || undefined;
    });

    // Receber o serviço selecionado da navegação
    this.route.queryParams.subscribe(params => {
      if (params['servicoId']) {
        this.servicoSelecionado = { id: params['servicoId'] } as Servico;
        // Buscar detalhes completos do serviço
        this.servicoService.getServicoById(params['servicoId']).subscribe(servico => {
          this.servicoSelecionado = servico;
        });
      }
    });

    // Carregar barbeiros
    this.profissionais$ = this.barbeiroService.getBarbeiros();

    // Carregar disponibilidades para a data atual
    this.carregarDisponibilidades();
  }

  // util: formata Date para YYYY-MM-DD
  toISO(d: Date) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  // retorna string curta (ex: Seg 14)
  diaLabel(d: Date) {
    return d.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit' });
  }

  // retorna ISO YYYY-MM-DD para buscar disponibilidade
  getISO(d: Date) {
    return this.toISO(d);
  }

  // retorna o nome do mês atual da selectedDate (ex: "Setembro")
  getMesAtual(): string {
    const meses = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return meses[this.selectedDate.getMonth()];
  }

  addDays(d: Date, days: number) {
    const r = new Date(d);
    r.setDate(r.getDate() + days);
    return r;
  }

  // cria a array de 7 dias a partir de selectedDate (ou 5 se preferir)
  buildSemana(days = 7) {
    this.semana = [];
    const start = this.selectedDate;
    for (let i = 0; i < days; i++) {
      this.semana.push(this.addDays(start, i));
    }
  }

  // quando usuário escolhe uma data via UI
  onSelectDate(date: Date | null) {
    if (!date) {
      return;
    }
    this.selectedDate = date;
    this.mesAtual = this.getMesAtual();
    this.selectedHorario = undefined;
    this.selectedProfissional = undefined;

    // Carregar disponibilidades para a nova data
    this.carregarDisponibilidades();
  }

  // Carregar disponibilidades de todos os barbeiros para a data selecionada
  carregarDisponibilidades() {
    const dataISO = this.toISO(this.selectedDate);

    this.profissionais$.subscribe(barbeiros => {
      barbeiros.forEach(barbeiro => {
        this.agendamentoService.getDisponibilidadeBarbeiro(barbeiro.id, dataISO)
          .subscribe(disponibilidade => {
            this.disponibilidades[barbeiro.id] = disponibilidade;
          });
      });
    });
  }

  // Obter horários disponíveis para um barbeiro específico
  getHorariosDisponiveis(barbeiroId: string): string[] {
    const disponibilidade = this.disponibilidades[barbeiroId];
    if (!disponibilidade) return [];

    return disponibilidade.horarios
      .filter(h => h.disponivel)
      .map(h => h.horario);
  }

  // selecionar horário
  selecionarHorario(prof: Barbeiro, dataISO: string, horario: string) {
    this.selectedProfissional = prof;
    this.selectedHorario = horario;
    this.selectedDataISO = dataISO;
    console.log('selecionado', prof.nome, dataISO, horario);
  }

  // Adicionar serviço agendado ao carrinho e redirecionar
  confirmarAgendamento() {
    if (!this.clienteId) {
      console.error('Usuário não autenticado.');
      return;
    }

    if (!this.selectedProfissional || !this.selectedHorario || !this.selectedDataISO || !this.servicoSelecionado) {
      console.error('Dados incompletos para adicionar agendamento ao carrinho');
      return;
    }

    const agendamento: Omit<Agendamento, 'id'> = {
      barbeiroId: this.selectedProfissional.id,
      servicoId: this.servicoSelecionado.id,
      clienteId: this.clienteId,
      data: this.selectedDataISO,
      horario: this.selectedHorario,
      duracao: this.servicoSelecionado.duracao,
      status: 'agendado'
    };

    this.carrinhoService.setAgendamento(agendamento as Agendamento);
    this.router.navigate(['/produtos']);
  }

  // converte os possíveis valores do ion-datetime para Date ou null
  converterData(value: string | string[] | null | undefined | Date): Date | null {
    if (value == null) return null;
    if (value instanceof Date) return value;
    const iso = Array.isArray(value) ? value[0] : value;
    if (!iso) return null;
    const d = new Date(iso);
    return isNaN(d.getTime()) ? null : d;
  }

  // trackBy para ngFor de profissionais
  trackByProf(index: number, p: Barbeiro) { return p.id; }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { closeOutline } from 'ionicons/icons';
import { HeaderComponent } from '../../componentes/header/header.component';
import { RouterLinkWithHref } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Profissional } from '../../interfaces/profissional';

@Component({
  selector: 'app-agendamento',
  templateUrl: './agendamento.page.html',
  styleUrls: ['./agendamento.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HeaderComponent, RouterLinkWithHref]
})

export class AgendamentoPage implements OnInit {
  constructor() {
    addIcons({ closeOutline })
    this.profissionais$ = of(this.dadosMock);
    this.buildSemana();
  }

  ngOnInit() {
    this.mesAtual = this.getMesAtual();
  }


  mesAtual: string = '';


  // data atualmente selecionada (Date)
  selectedDate = new Date();

  // lista de dias que iremos mostrar (por padrão a semana a partir da selectedDate)
  semana: Date[] = [];

  // profissionais (mock) — em app real, vem do backend via service
  profissionais$: Observable<Profissional[]>;

  // qual profissional/horario foi selecionado (para confirmar)
  selectedProfissional?: Profissional;
  selectedHorario?: string;
  selectedDataISO?: string;

  // mock data
  private dadosMock: Profissional[] = [
    {
      id: 1,
      nome: 'Farah',
      foto: 'assets/fotos/servicos/servico03.jpeg',
      disponibilidade: [
        { dataISO: this.toISO(new Date()), horarios: ['08:20', '09:40', '11:00'] },
        { dataISO: this.toISO(this.addDays(new Date(), 1)), horarios: ['09:00', '10:30'] }
      ]
    },
    {
      id: 2,
      nome: 'João',
      foto: 'assets/fotos/servicos/servico02.jpg',
      disponibilidade: [
        { dataISO: this.toISO(new Date()), horarios: ['08:00', '12:00'] },
        { dataISO: this.toISO(this.addDays(new Date(), 2)), horarios: ['14:00', '15:30'] }
      ]
    }
  ];

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
  }

  // encontra horários disponíveis do profissional para a data ISO
  horariosDisponiveis(prof: Profissional, dataISO: string): string[] {
    const disp = prof.disponibilidade.find(d => d.dataISO === dataISO);
    return disp ? disp.horarios : [];
  }

  // selecionar horário
  selecionarHorario(prof: Profissional, dataISO: string, horario: string) {
    this.selectedProfissional = prof;
    this.selectedHorario = horario;
    this.selectedDataISO = dataISO;
    // aqui poderia abrir modal de confirmação / ir pra próxima tela
    console.log('selecionado', prof.nome, dataISO, horario);
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
  trackByProf(index: number, p: Profissional) { return p.id; }
}

import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, query, where, deleteDoc, doc, updateDoc } from '@angular/fire/firestore';
import { Observable, from, catchError, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { Agendamento, HorarioDisponivel, DisponibilidadeBarbeiro } from '../../interfaces/agendamento';

@Injectable({
  providedIn: 'root'
})
export class AgendamentoService {
  private horaAbrir = 8;
  private horaFechar = 18;
  private intervaloHorarios = 45

  constructor(private firestore: Firestore) { }

  // Gerar horários disponíveis (8h às 18h, intervalos de 45min)
  gerarHorariosDisponiveis(inicio = this.horaAbrir, fim = this.horaFechar, intervalo = this.intervaloHorarios): string[] {
    const horarios: string[] = [];
    const inicioMin = inicio * 60;
    const fimMin = fim * 60;

    for (let t = inicioMin; t < fimMin; t += intervalo) {
      horarios.push(this.minutesParaHhmm(t));
    }

    return horarios;
  }

  pad2(n: number) {
    return n.toString().padStart(2, '0');
  }

  //Transformar minutos em HH:MM
  minutesParaHhmm(minutes: number): string {
    const hh = Math.floor(minutes / 60);
    const mm = minutes % 60;
    return `${this.pad2(hh)}:${this.pad2(mm)}`;
  }

  // Buscar agendamentos por barbeiro e data
  getAgendamentosPorBarbeiroEData(barbeiroId: string, data: string): Observable<Agendamento[]> {
    try {
      const agendamentosRef = collection(this.firestore, 'agendamentos');
      const q = query(
        agendamentosRef,
        where('barbeiroId', '==', barbeiroId),
        where('data', '==', data),
        where('status', '==', 'agendado')
      );

      return from(getDocs(q)).pipe(
        map(snapshot => {
          return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          } as Agendamento));
        }),
        catchError(error => {
          console.error('Erro ao buscar agendamentos por barbeiro e data:', error);
          return throwError(() => error);
        })
      );
    } catch (error) {
      console.error('Erro ao buscar agendamentos por barbeiro e data:', error);
      throw error;
    }
  }

  // Verificar disponibilidade de horários para um barbeiro em uma data específica
  getDisponibilidadeBarbeiro(barbeiroId: string, data: string): Observable<DisponibilidadeBarbeiro> {
    return this.getAgendamentosPorBarbeiroEData(barbeiroId, data).pipe(
      map(agendamentos => {
        // Gera todos os slots do dia (ex: ['08:00', '08:45', ...])
        const todosHorarios = this.gerarHorariosDisponiveis();

        // Cria um Set (para evitar duplicados) com todos os horários ocupados
        const ocupadosSet = new Set<string>();

        for (const ag of agendamentos) {
          // Aqui é onde você chama expandirSlotsStrict 👇
          const slotsOcupados = this.verificarQtdSlotsUsados(ag.horario, ag.duracao, todosHorarios);
          slotsOcupados.forEach(slot => ocupadosSet.add(slot));
        }

        // Agora mapeia todos os horários marcando disponíveis ou não
        const horarios: HorarioDisponivel[] = todosHorarios.map(horario => ({
          horario,
          disponivel: !ocupadosSet.has(horario)
        }));

        return { barbeiroId, data, horarios };
      }),
      catchError(error => {
        console.error('Erro ao verificar disponibilidade do barbeiro:', error);
        return throwError(() => error);
      })
    );
  }
  // Criar novo agendamento
  async criarAgendamento(agendamento: Omit<Agendamento, 'id'>): Promise<string> {
    try {
      const agendamentosRef = collection(this.firestore, 'agendamentos');
      const agendamentoComData = {
        ...agendamento,
        criadoEm: new Date()
      };

      const docRef = await addDoc(agendamentosRef, agendamentoComData);
      console.log('Agendamento criado com sucesso:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      throw error;
    }
  }

  // Buscar todos os agendamentos
  getAgendamentos(): Observable<Agendamento[]> {
    try {
      const agendamentosRef = collection(this.firestore, 'agendamentos');

      return from(getDocs(agendamentosRef)).pipe(
        map(snapshot => {
          return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          } as Agendamento));
        }),
        catchError(error => {
          console.error('Erro ao buscar agendamentos:', error);
          return throwError(() => error);
        })
      );
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
      throw error;
    }
  }

  // Atualizar status do agendamento
  async atualizarStatusAgendamento(id: string, status: 'agendado' | 'concluido' | 'cancelado'): Promise<void> {
    try {
      const agendamentoRef = doc(this.firestore, 'agendamentos', id);
      await updateDoc(agendamentoRef, { status });
      console.log('Status do agendamento atualizado com sucesso:', id);
    } catch (error) {
      console.error('Erro ao atualizar status do agendamento:', error);
      throw error;
    }
  }

  // Cancelar agendamento
  async cancelarAgendamento(id: string): Promise<void> {
    try {
      await this.atualizarStatusAgendamento(id, 'cancelado');
      console.log('Agendamento cancelado com sucesso:', id);
    } catch (error) {
      console.error('Erro ao cancelar agendamento:', error);
      throw error;
    }
  }

  verificarQtdSlotsUsados(inicio: string, duracao: number, todosHorarios: string[]): string[] {
    if (!todosHorarios || todosHorarios.length === 0) return [];

    // Encontra o índice exato do horário de início
    const startIndex = todosHorarios.indexOf(inicio);
    if (startIndex === -1) {
      // Horário inicial não existe na grade de slots: não faz aproximação — retorna vazio
      return [];
    }

    // Quantos slots são necessários (ceiling)
    const slotsNecessarios = Math.ceil(duracao / this.intervaloHorarios);

    const result: string[] = [];
    for (let i = 0; i < slotsNecessarios; i++) {
      const idx = startIndex + i;
      if (idx >= todosHorarios.length) break;
      result.push(todosHorarios[idx]);
    }
    return result;
  }
}

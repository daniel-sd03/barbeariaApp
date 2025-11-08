export interface Agendamento {
  id?: string;
  barbeiroId: string;
  servicoId: string;
  clienteId: string; // Para futuras implementações de autenticação
  data: string; // YYYY-MM-DD
  horario: string; // HH:MM
  duracao: number; // HH:MM
  status: 'agendado' | 'concluido' | 'cancelado';
  criadoEm?: Date;
}

export interface HorarioDisponivel {
  horario: string;
  disponivel: boolean;
}

export interface DisponibilidadeBarbeiro {
  barbeiroId: string;
  data: string;
  horarios: HorarioDisponivel[];
}

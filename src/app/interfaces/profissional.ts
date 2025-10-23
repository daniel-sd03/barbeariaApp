export interface Profissional {
  id: number;
  nome: string;
  foto?: string;
  disponibilidade: Disponibilidade[]; // lista de dias com horários
}

export interface Disponibilidade {
  dataISO: string;       // ex: '2025-10-14' (YYYY-MM-DD)
  horarios: string[];    // ex: ['08:20', '09:40', '11:00']
}

import { Agendamento } from './agendamento';
import { Produto } from './produto';

export interface OrdemServico {
  id?: string;
  clienteId: string;

  // Agendamento (opcional)
  agendamento?: Agendamento;

  // Produtos (opcional)
  produtos?: Produto[];

  // Totais e data do OS
  total?: number;
  dtOS?: Date;
}

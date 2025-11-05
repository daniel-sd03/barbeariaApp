import { Agendamento } from './agendamento';
import { Produto } from './produto';

export interface Carrinho {
  agendamento?: Agendamento;
  produtos: Produto[];
}
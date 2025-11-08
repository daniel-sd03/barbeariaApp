import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import { OrdemServico } from 'src/app/interfaces/ordem-servico';

@Injectable({ providedIn: 'root' })
export class OrdemServicoService {
  private colecao = 'ordensServico';

  constructor(private firestore: Firestore) { }

  async salvarOrdemServico(ordem: Omit<OrdemServico, 'id'>): Promise<boolean> {
    try {
      const colRef = collection(this.firestore, this.colecao);
      const ordemComData = { ...ordem, dtOS: new Date() } as any;
      await addDoc(colRef, ordemComData);
      return true;
    } catch (error) {
      console.error('[ordemServicoService] Erro ao salvar ordem de serviço:', error);
      throw error;
    }
  }
}

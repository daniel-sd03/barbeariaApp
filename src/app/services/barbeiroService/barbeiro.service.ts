import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, serverTimestamp, doc, updateDoc } from '@angular/fire/firestore';
import { Barbeiro } from 'src/app/interfaces/barbeiro';


@Injectable({
  providedIn: 'root'
})
export class BarbeiroService {

  constructor(private firestore: Firestore) { }


  async cadastrarBarbeiro(payload: Omit<Barbeiro, 'id'>): Promise<boolean>{

    try {
      const colRef = collection(this.firestore, 'barbeiros');

      // adiciona o barbeiro (sem id)
      const docRef = await addDoc(colRef, {
        ...payload,
      });

      // atualiza o documento com o id dentro dele (pra consultas futuras)
      const docRefWithId = doc(this.firestore, 'barbeiros', docRef.id);
      await updateDoc(docRefWithId, { id: docRef.id });

      return true;
    } catch (error) {
      console.error("[barbeiroService] erro ao tentar cadastrar barbeiro: " + error);
      throw error;
    }
  }
}

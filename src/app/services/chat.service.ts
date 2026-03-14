import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // Añadimos HttpHeaders
import { IMessage } from '../Interfaces/imessage';

@Injectable({
  providedIn: 'root',
})
export class ChatService {

  // URL de tu Space en Hugging Face
  private messageArray: IMessage[] = [];
  private conversation = new Subject<IMessage[]>();

  constructor(private http: HttpClient) { }

  getConversation() {
    return this.conversation.asObservable();
  }

  sendMessage(text: string, HF_API_URL: string) {
    // 1. Agregar mensaje del usuario a la UI
    const userMsg: IMessage = { text, sender: 'user', timestamp: new Date() };
    this.messageArray.push(userMsg);
    this.conversation.next([...this.messageArray]);

    // 2. Configuración de headers limpia
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // 3. Petición a Hugging Face
    // Ajustamos la interfaz de respuesta a lo que configuramos en Python: { intent: string, response: string }
    this.http.post<{ intent: string, response: string }>(
      HF_API_URL, 
      { query: text }, // Cambiado de 'message' a 'query'
      { headers }
    )
    .subscribe({
      next: (res) => {
        const botMsg: IMessage = {
          text: res.response, // Cambiado de 'reply' a 'response'
          sender: 'bot',
          timestamp: new Date()
        };
        this.messageArray.push(botMsg);
        this.conversation.next([...this.messageArray]);
      },
      error: (err) => {
        console.error('Error en SIA-AGRO API:', err);
        const errorMsg: IMessage = {
          text: 'Lo siento, hubo un problema al conectar con el servidor de SIA-AGRO.',
          sender: 'bot',
          timestamp: new Date()
        };
        this.messageArray.push(errorMsg);
        this.conversation.next([...this.messageArray]);
      }
    });
  }
}

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // Añadimos HttpHeaders
import { IMessage } from '../Interfaces/imessage';

@Injectable({
  providedIn: 'root',
})
export class ChatService {

  // private readonly API_URL = 'https://heavy-laws-lay.loca.lt/ask';

  private messageArray: IMessage[] = [];
  private conversation = new Subject<IMessage[]>();

  constructor(private http: HttpClient) { }

  getConversation() {
    return this.conversation.asObservable();
  }

  sendMessage(text: string, API_URL: string) {
    const userMsg: IMessage = { text, sender: 'user', timestamp: new Date() };
    this.messageArray.push(userMsg);
    this.conversation.next([...this.messageArray]);

    // CONFIGURACIÓN DE CABECERAS PARA LOCAL-TUNNEL
    const headers = new HttpHeaders({
      'Bypass-Tunnel-Reminder': 'true',
      'Content-Type': 'application/json'
    });

    this.http.post<{ reply: string }>(`${API_URL}`, { message: text }, { headers })
      .subscribe({
        next: (res) => {
          const botMsg: IMessage = {
            text: res.reply,
            sender: 'bot',
            timestamp: new Date()
          };
          this.messageArray.push(botMsg);
          this.conversation.next([...this.messageArray]);
        },
        error: (err) => {
          console.error('Error detallado:', err);
          const errorMsg: IMessage = {
            text: 'Error de conexión.',
            sender: 'bot',
            timestamp: new Date()
          };
          this.messageArray.push(errorMsg);
          this.conversation.next([...this.messageArray]);
        }
      });
  }
}

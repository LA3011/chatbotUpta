import { Component, NgModule, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { IMessage } from '../../Interfaces/imessage';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ChatComponent implements OnInit {
  messages: IMessage[] = [];
  userInput: string = '';

  // Propiedades para la configuración de la URL
  showConfig: boolean = false;
  apiUrl: string = 'https://luisalvarez123-siaagro.hf.space/query'; // URL por defecto

  constructor(
    private chatService: ChatService,
    private router: Router
  ) {}
  

  ngOnInit() {
    // Recuperar la URL guardada si existe
    const savedUrl = localStorage.getItem('siaagro_api_url');
    if (savedUrl) {
      this.apiUrl = savedUrl;
    }

    this.chatService.getConversation().subscribe(msg => {
      this.messages = msg;
    });
  }

  // Guardar la URL en el navegador
  saveConfig() {
    localStorage.setItem('siaagro_api_url', this.apiUrl);
    this.showConfig = false;
    console.log("Nueva URL configurada:", this.apiUrl);
  }

  send() {
    if (this.userInput.trim()) {
      // Si tu servicio acepta la URL como parámetro, la pasamos aquí
      // De lo contrario, asegúrate de que el ChatService lea de localStorage
      this.chatService.sendMessage(this.userInput, this.apiUrl); 
      this.userInput = '';
    }
  }

  goBack() {
    this.router.navigate(['']);
  }
  
}
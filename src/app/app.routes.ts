import { Routes } from '@angular/router';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { ChatComponent } from './components/chat/chat.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent }, // Ruta por defecto
  { path: 'chat', component: ChatComponent },
  { path: '**', redirectTo: '' } // Catch-all
];
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Importante para os links funcionarem

export interface SidebarItem {
  rotulo: string;      // Nome que aparece na tela (ex: 'Home', 'Dashboard')
  rota: string;        // Caminho da URL (ex: '/home', '/pets')
  classeIcone: string; // Classe do Bootstrap Icon (ex: 'bi-house', 'bi-speedometer2')
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class Sidebar {
  // Recebe a lista de funcionalidades dinamicamente de fora
  @Input() itensMenu: SidebarItem[] = [];
}
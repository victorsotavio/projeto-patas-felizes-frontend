import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Navbar } from '../navbar/navbar';
import { Sidebar, SidebarItem } from '../sidebar/sidebar';

@Component({
  selector: 'app-vet',
  standalone: true,
  imports: [
    Navbar,
    Sidebar,
    RouterOutlet
  ],
  templateUrl: './vet.html',
  styleUrl: './vet.css'
})
export class Vet {

  itensMenu: SidebarItem[] = [
    {
      rotulo: 'Home',
      rota: '/vet/home',
      classeIcone: 'bi-house-door-fill'
    },
    {
      rotulo: 'Atendimentos',
      rota: '/vet/atendimentos',
      classeIcone: 'bi-clipboard2-pulse-fill'
    }
  ];
}
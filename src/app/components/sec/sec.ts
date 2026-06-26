import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Navbar } from '../navbar/navbar';
import { Sidebar, SidebarItem } from '../sidebar/sidebar';

@Component({
  selector: 'app-sec',
  standalone: true,
  imports: [
    Navbar,
    Sidebar,
    RouterOutlet
  ],
  templateUrl: './sec.html',
  styleUrl: './sec.css'
})
export class Sec {

  itensMenu: SidebarItem[] = [
    {
      rotulo: 'Home',
      rota: '/sec/home',
      classeIcone: 'bi-house-door-fill'
    },
    {
      rotulo: 'Clientes',
      rota: '/sec/clientes',
      classeIcone: 'bi-people-fill'
    },
    {
      rotulo: 'Animais',
      rota: '/sec/animais',
      classeIcone: 'bi-heart-fill'
    },
    {
      rotulo: 'Atendimentos',
      rota: '/sec/atendimentos',
      classeIcone: 'bi-calendar-check-fill'
    }
  ];
}
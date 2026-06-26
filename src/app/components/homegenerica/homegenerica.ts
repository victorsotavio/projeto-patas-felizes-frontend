import { Component } from '@angular/core';
import { Navbar } from "../navbar/navbar";
import { Sidebar } from "../sidebar/sidebar"; // 1. Importando o Componente correto aqui
import { SidebarItem } from '../sidebar/sidebar'; // Mantido apenas para tipagem se necessário
import { GerenciarPetsComponent } from "../gerenciar-pets/gerenciar-pets";

@Component({
  selector: 'app-homegenerica',
  standalone: true, // Garanta que está como standalone se usar o array imports direto
  imports: [Navbar, Sidebar, GerenciarPetsComponent], // 2. Corrigido para a classe Sidebar
  templateUrl: './homegenerica.html',
  styleUrl: './homegenerica.css',
})
export class Homegenerica {
  // Sua lista mapeada perfeitamente
  meuMenu: SidebarItem[] = [
    { rotulo: 'Home', rota: '', classeIcone: 'bi-house-door-fill' },
    { rotulo: 'Dashboard', rota: '/sec', classeIcone: 'bi-speedometer2' },
    { rotulo: 'Gerenciar Patas 🐾', rota: '/pets', classeIcone: 'bi-paw-fill' },
    { rotulo: 'Clientes', rota: '/clientes', classeIcone: 'bi-people-fill' }
  ];
}
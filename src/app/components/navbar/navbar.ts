import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
logout() {
  // Sua lógica para deslogar o usuário aqui
  console.log('Usuário deslogou');
}
}

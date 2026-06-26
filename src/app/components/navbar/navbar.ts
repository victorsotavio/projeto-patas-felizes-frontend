import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {

  private router = inject(Router);

  logout(): void {
    // Sua lógica para deslogar o usuário aqui
    localStorage.removeItem('usuarioLogado');
    localStorage.removeItem('token');
    this.router.navigate(['/']);

  }
}

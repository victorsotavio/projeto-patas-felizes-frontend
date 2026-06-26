import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Modalgenerico } from '../modalgenerico/modalgenerico';

@Component({
  selector: 'app-homegenerica',
  standalone: true,
  imports: [
    FormsModule,
    Modalgenerico
  ],
  templateUrl: './homegenerica.html',
  styleUrl: './homegenerica.css'
})
export class Homegenerica {

  usuario = {
    nome: 'Carlos',
    cpf: '222.222.222-22',
    email: 'veterinario@patasfelizes.com',
    perfil: 'Veterinário'
  };

  senhaAtual = '';
  novaSenha = '';
  confirmarNovaSenha = '';

  alterarSenha(): void {
    if (this.novaSenha !== this.confirmarNovaSenha) {
      console.log('As novas senhas não coincidem.');
      return;
    }

    console.log('Alteração de senha solicitada.');

    this.senhaAtual = '';
    this.novaSenha = '';
    this.confirmarNovaSenha = '';
  }
}
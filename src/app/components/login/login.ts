import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AutenticacaoService } from '../../services/autenticacao.service';
import { Credencial } from '../../models/credencial';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  mensagemErro = '';
  formLogin: FormGroup;

  constructor(
    private fb: FormBuilder,
    private autenticacaoService: AutenticacaoService,
    private router: Router
  ) {
    this.formLogin = this.fb.group({
      email: ['', [Validators.required, Validators.minLength(3)]],
      senha: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  entrar(): void {
    if (this.formLogin.invalid) {
      this.formLogin.markAllAsTouched();
      return;
    }

    const credencial: Credencial = this.formLogin.value;

    this.autenticacaoService.login(credencial).subscribe({
      next: (usuario) => {
        console.log('Login retornado pelo backend:', usuario);

        this.autenticacaoService.salvarUsuario(usuario);

        switch (usuario.perfil) {
          case 'SECRETARIA':
            this.router.navigate(['/sec']);
            break;

          case 'VETERINARIO':
            this.router.navigate(['/vet']);
            break;

          case 'CLIENTE':
            this.autenticacaoService.sair();
            
            this.mensagemErro =
              'O perfil de cliente ainda não possui acesso ao sistema.';
            break;
        }
      },
      error: () => {
        this.mensagemErro = 'Login ou senha inválidos.';
      }
    });
  }

  validarCampo(campo: string, erro: string): boolean {
    const controle = this.formLogin.get(campo);
    return !!(controle && controle.touched && controle.hasError(erro));
  }
}

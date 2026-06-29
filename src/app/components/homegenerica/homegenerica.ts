import {
  Component,
  inject,
  OnInit
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { Modalgenerico } from '../modalgenerico/modalgenerico';
import { CpfPipe } from '../../pipes/cpf-pipe';

import { Pessoa } from '../../models/pessoa';

import {
  AutenticacaoService
} from '../../services/autenticacao.service';

import {
  PessoaService
} from '../../services/pessoa.service';

import {
  UsuarioService
} from '../../services/usuario.service';

@Component({
  selector: 'app-homegenerica',
  standalone: true,
  imports: [
    FormsModule,
    Modalgenerico,
    CpfPipe
  ],
  templateUrl: './homegenerica.html',
  styleUrl: './homegenerica.css'
})
export class Homegenerica implements OnInit {

  private readonly autenticacaoService =
    inject(AutenticacaoService);

  private readonly pessoaService =
    inject(PessoaService);

  private readonly usuarioService =
    inject(UsuarioService);

  usuario: Pessoa | null = null;

  perfilExibicao: string = '';

  senhaAtual: string = '';
  novaSenha: string = '';
  confirmarNovaSenha: string = '';

  carregando: boolean = false;
  mensagemErro: string = '';
  mensagemSucesso: string = '';

  ngOnInit(): void {
    this.carregarUsuario();
  }

  carregarUsuario(): void {
    const autenticacao =
      this.autenticacaoService.getAutenticacao();

    if (!autenticacao) {
      this.mensagemErro =
        'Não foi possível identificar o usuário autenticado.';
      return;
    }

    this.perfilExibicao =
      this.formatarPerfil(autenticacao.perfil);

    this.carregando = true;
    this.mensagemErro = '';

    this.pessoaService
      .buscarPorId(autenticacao.pessoaId)
      .subscribe({
        next: (pessoa: Pessoa) => {
          this.usuario = pessoa;
          this.carregando = false;
        },

        error: (erro: HttpErrorResponse) => {
          console.error(
            'Erro ao carregar usuário:',
            erro
          );

          this.mensagemErro =
            'Não foi possível carregar os dados do usuário.';

          this.carregando = false;
        }
      });
  }

  alterarSenha(): void {
    this.mensagemErro = '';
    this.mensagemSucesso = '';

    if (
      !this.senhaAtual ||
      !this.novaSenha ||
      !this.confirmarNovaSenha
    ) {
      this.mensagemErro =
        'Preencha todos os campos de senha.';
      return;
    }

    if (this.novaSenha !== this.confirmarNovaSenha) {
      this.mensagemErro =
        'As novas senhas não coincidem.';
      return;
    }

    const autenticacao =
      this.autenticacaoService.getAutenticacao();

    if (!autenticacao) {
      this.mensagemErro =
        'Não foi possível identificar o usuário autenticado.';
      return;
    }

    this.usuarioService
      .alterarSenha(
        autenticacao.id,
        {
          senhaAtual: this.senhaAtual,
          novaSenha: this.novaSenha
        }
      )
      .subscribe({
        next: () => {
          this.mensagemSucesso =
            'Senha alterada com sucesso.';

          this.limparCamposSenha();
        },

        error: (erro: HttpErrorResponse) => {
          console.error(
            'Erro ao alterar senha:',
            erro
          );

          this.mensagemErro =
            this.obterMensagemErro(
              erro,
              'Não foi possível alterar a senha.'
            );
        }
      });
  }

  private limparCamposSenha(): void {
    this.senhaAtual = '';
    this.novaSenha = '';
    this.confirmarNovaSenha = '';
  }

  private formatarPerfil(perfil: string): string {
    const perfis: Record<string, string> = {
      SECRETARIA: 'Secretária',
      VETERINARIO: 'Veterinário',
      CLIENTE: 'Cliente'
    };

    return perfis[perfil] ?? perfil;
  }

  private obterMensagemErro(
    erro: HttpErrorResponse,
    mensagemPadrao: string
  ): string {

    if (typeof erro.error === 'string' && erro.error) {
      return erro.error;
    }

    if (erro.error?.message) {
      return erro.error.message;
    }

    if (erro.error?.mensagem) {
      return erro.error.mensagem;
    }

    if (erro.error?.error) {
      return erro.error.error;
    }

    return mensagemPadrao;
  }
}
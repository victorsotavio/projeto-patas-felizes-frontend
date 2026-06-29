import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import {
    Crudgenerico,
    CrudColuna
} from '../crudgenerico/crudgenerico';

import { Modalgenerico } from '../modalgenerico/modalgenerico';

import { Pessoa } from '../../models/pessoa';
import { PessoaService } from '../../services/pessoa.service';

@Component({
    selector: 'app-gerenciar-clientes',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        Crudgenerico,
        Modalgenerico
    ],
    templateUrl: './gerenciar-clientes.html',
    styleUrl: './gerenciar-clientes.css'
})
export class GerenciarClientesComponent implements OnInit {

    private readonly pessoaService = inject(PessoaService);

    colunasCliente: CrudColuna[] = [
        {
            chave: 'id',
            titulo: 'Código'
        },
        {
            chave: 'nome',
            titulo: 'Nome'
        },
        {
            chave: 'cpf',
            titulo: 'CPF'
        },
        {
            chave: 'email',
            titulo: 'E-mail'
        }
    ];

    listaDeClientes: Pessoa[] = [];

    clienteCadastrar: Pessoa = {
        nome: '',
        cpf: '',
        email: ''
    };

    clienteEditar: Pessoa = {
        nome: '',
        cpf: '',
        email: ''
    };

    clienteExcluir: Pessoa | null = null;

    carregando: boolean = false;
    mensagemErro: string = '';
    mensagemSucesso: string = '';

    ngOnInit(): void {
        this.carregarClientes();
    }

    carregarClientes(): void {
        this.carregando = true;
        this.mensagemErro = '';

        this.pessoaService.listarClientes().subscribe({
            next: (clientes: Pessoa[]) => {
                this.listaDeClientes = clientes;
                this.carregando = false;
            },

            error: (erro: HttpErrorResponse) => {
                console.error('Erro ao carregar clientes:', erro);

                this.mensagemErro = this.obterMensagemErro(
                    erro,
                    'Não foi possível carregar os clientes.'
                );

                this.carregando = false;
            }
        });
    }

    cadastrar(): void {
        this.mensagemErro = '';
        this.mensagemSucesso = '';

        const novoCliente: Pessoa = {
            nome: this.clienteCadastrar.nome,
            cpf: this.clienteCadastrar.cpf,
            email: this.clienteCadastrar.email
        };

        this.pessoaService.inserir(novoCliente).subscribe({
            next: () => {
                this.mensagemSucesso =
                    'Cliente cadastrado com sucesso.';

                this.limparFormularioCadastro();
                this.carregarClientes();
            },

            error: (erro: HttpErrorResponse) => {
                console.error('Erro ao cadastrar cliente:', erro);

                this.mensagemErro = this.obterMensagemErro(
                    erro,
                    'Não foi possível cadastrar o cliente.'
                );
            }
        });
    }

    prepararEdicao(cliente: Pessoa): void {
        this.mensagemErro = '';
        this.mensagemSucesso = '';

        this.clienteEditar = {
            ...cliente
        };
    }

    salvarEdicao(): void {
        if (this.clienteEditar.id === undefined) {
            this.mensagemErro =
                'Não foi possível identificar o cliente.';
            return;
        }

        this.mensagemErro = '';
        this.mensagemSucesso = '';

        const clienteAlterado: Pessoa = {
            nome: this.clienteEditar.nome,
            cpf: this.clienteEditar.cpf,
            email: this.clienteEditar.email
        };

        this.pessoaService
            .alterar(this.clienteEditar.id, clienteAlterado)
            .subscribe({
                next: () => {
                    this.mensagemSucesso =
                        'Cliente alterado com sucesso.';

                    this.carregarClientes();
                },

                error: (erro: HttpErrorResponse) => {
                    console.error('Erro ao alterar cliente:', erro);

                    this.mensagemErro = this.obterMensagemErro(
                        erro,
                        'Não foi possível alterar o cliente.'
                    );
                }
            });
    }

    prepararExclusao(cliente: Pessoa): void {
        this.mensagemErro = '';
        this.mensagemSucesso = '';

        this.clienteExcluir = cliente;
    }

    deletar(): void {
        if (
            !this.clienteExcluir ||
            this.clienteExcluir.id === undefined
        ) {
            this.mensagemErro =
                'Não foi possível identificar o cliente.';
            return;
        }

        const idCliente = this.clienteExcluir.id;

        this.mensagemErro = '';
        this.mensagemSucesso = '';

        this.pessoaService.excluir(idCliente).subscribe({
            next: () => {
                this.mensagemSucesso =
                    'Cliente excluído com sucesso.';

                this.clienteExcluir = null;
                this.carregarClientes();
            },

            error: (erro: HttpErrorResponse) => {
                console.error('Erro ao excluir cliente:', erro);

                this.mensagemErro = this.obterMensagemErro(
                    erro,
                    'Não foi possível excluir o cliente.'
                );
            }
        });
    }

    private limparFormularioCadastro(): void {
        this.clienteCadastrar = {
            nome: '',
            cpf: '',
            email: ''
        };
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
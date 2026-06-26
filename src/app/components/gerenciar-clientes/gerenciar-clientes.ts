import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
    Crudgenerico,
    CrudColuna
} from '../crudgenerico/crudgenerico';

import { Modalgenerico } from '../modalgenerico/modalgenerico';

interface Cliente {
    id: number;
    nome: string;
    cpf: string;
    email: string;
}

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
export class GerenciarClientesComponent {

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

    listaDeClientes: Cliente[] = [
        {
            id: 1,
            nome: 'João Silva',
            cpf: '333.333.333-33',
            email: 'joao@email.com'
        },
        {
            id: 2,
            nome: 'Maria Oliveira',
            cpf: '444.444.444-44',
            email: 'maria@email.com'
        }
    ];

    clienteCadastrar: Omit<Cliente, 'id'> = {
        nome: '',
        cpf: '',
        email: ''
    };

    clienteEditar: Cliente = {
        id: 0,
        nome: '',
        cpf: '',
        email: ''
    };

    clienteExcluir: Cliente | null = null;

    cadastrar(): void {
        const maiorId = this.listaDeClientes.reduce(
            (maior, cliente) => Math.max(maior, cliente.id),
            0
        );

        const novoCliente: Cliente = {
            id: maiorId + 1,
            ...this.clienteCadastrar
        };

        this.listaDeClientes.push(novoCliente);

        this.clienteCadastrar = {
            nome: '',
            cpf: '',
            email: ''
        };
    }

    prepararEdicao(cliente: Cliente): void {
        this.clienteEditar = { ...cliente };
    }

    salvarEdicao(): void {
        const index = this.listaDeClientes.findIndex(
            cliente => cliente.id === this.clienteEditar.id
        );

        if (index !== -1) {
            this.listaDeClientes[index] = {
                ...this.clienteEditar
            };
        }
    }

    prepararExclusao(cliente: Cliente): void {
        this.clienteExcluir = cliente;
    }

    deletar(): void {
        if (!this.clienteExcluir) {
            return;
        }

        this.listaDeClientes = this.listaDeClientes.filter(
            cliente => cliente.id !== this.clienteExcluir?.id
        );

        this.clienteExcluir = null;
    }
}
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import {
    Crudgenerico,
    CrudColuna
} from '../crudgenerico/crudgenerico';

import { Modalgenerico } from '../modalgenerico/modalgenerico';

type PerfilTela = 'SECRETARIA' | 'VETERINARIO';

type SituacaoAtendimento =
    | 'AGENDADO'
    | 'EM_ANDAMENTO'
    | 'REALIZADO';

interface ServicoAtendimento {
    nome: string;
    quantidade: number;
    valor: number;
    subtotal: number;
}

interface Atendimento {
    id: number;
    situacao: SituacaoAtendimento;
    dataPrevista: string;
    dataRealizada: string | null;

    idAnimal: number;
    nomeAnimal: string;

    idProfissional: number;
    nomeProfissional: string;

    valorTotal: number;
    diagnostico: string | null;

    servicos: ServicoAtendimento[];
}

interface AtendimentoTabela {
    id: number;
    situacaoExibicao: string;
    dataPrevistaExibicao: string;
    dataRealizadaExibicao: string;
    nomeAnimal: string;
    nomeProfissional: string;
    valorTotalExibicao: string;
}

@Component({
    selector: 'app-gerenciar-atendimentos',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        Crudgenerico,
        Modalgenerico
    ],
    templateUrl: './gerenciar-atendimentos.html',
    styleUrl: './gerenciar-atendimentos.css'
})
export class GerenciarAtendimentosComponent {

    private route = inject(ActivatedRoute);

    perfil: PerfilTela =
        this.route.snapshot.data['perfil'] ?? 'SECRETARIA';

    colunasAtendimento: CrudColuna[] = [
        {
            chave: 'id',
            titulo: 'ID'
        },
        {
            chave: 'situacaoExibicao',
            titulo: 'Situação'
        },
        {
            chave: 'dataPrevistaExibicao',
            titulo: 'Data prevista'
        },
        {
            chave: 'dataRealizadaExibicao',
            titulo: 'Data realizada'
        },
        {
            chave: 'nomeAnimal',
            titulo: 'Animal'
        },
        {
            chave: 'nomeProfissional',
            titulo: 'Veterinário'
        },
        {
            chave: 'valorTotalExibicao',
            titulo: 'Valor total'
        }
    ];

    listaAnimais = [
        {
            id: 1,
            nome: 'Rex'
        },
        {
            id: 2,
            nome: 'Mia'
        },
        {
            id: 3,
            nome: 'Bolinha'
        }
    ];

    listaVeterinarios = [
        {
            id: 2,
            nome: 'Carlos'
        }
    ];

    listaAtendimentos: Atendimento[] = [
        {
            id: 1,
            situacao: 'AGENDADO',
            dataPrevista: '2026-06-30T14:00',
            dataRealizada: null,
            idAnimal: 1,
            nomeAnimal: 'Rex',
            idProfissional: 2,
            nomeProfissional: 'Carlos',
            valorTotal: 0,
            diagnostico: null,
            servicos: []
        },
        {
            id: 2,
            situacao: 'REALIZADO',
            dataPrevista: '2026-06-20T10:00',
            dataRealizada: '2026-06-20T10:30',
            idAnimal: 3,
            nomeAnimal: 'Bolinha',
            idProfissional: 2,
            nomeProfissional: 'Carlos',
            valorTotal: 150,
            diagnostico:
                'Bolinha apresentou leve alergia. Prescrito antialérgico e repouso.',
            servicos: [
                {
                    nome: 'Consulta de Rotina',
                    quantidade: 1,
                    valor: 150,
                    subtotal: 150
                }
            ]
        },
        {
            id: 3,
            situacao: 'EM_ANDAMENTO',
            dataPrevista: '2026-06-26T13:00',
            dataRealizada: null,
            idAnimal: 2,
            nomeAnimal: 'Mia',
            idProfissional: 2,
            nomeProfissional: 'Carlos',
            valorTotal: 200,
            diagnostico: null,
            servicos: [
                {
                    nome: 'Ultrassonografia',
                    quantidade: 1,
                    valor: 200,
                    subtotal: 200
                }
            ]
        }
    ];

    novoAtendimento = {
        dataPrevista: '',
        idAnimal: 0,
        idProfissional: 0
    };

    atendimentoSelecionado: Atendimento | null = null;
    atendimentoEditar: Atendimento | null = null;
    atendimentoExcluir: Atendimento | null = null;

    diagnosticoDigitado: string = '';

    get ehSecretaria(): boolean {
        return this.perfil === 'SECRETARIA';
    }

    get ehVeterinario(): boolean {
        return this.perfil === 'VETERINARIO';
    }

    get dadosTabela(): AtendimentoTabela[] {
        return this.listaAtendimentos.map(atendimento => ({
            id: atendimento.id,
            situacaoExibicao:
                this.formatarSituacao(atendimento.situacao),

            dataPrevistaExibicao:
                this.formatarData(atendimento.dataPrevista),

            dataRealizadaExibicao:
                this.formatarData(atendimento.dataRealizada),

            nomeAnimal: atendimento.nomeAnimal,
            nomeProfissional: atendimento.nomeProfissional,

            valorTotalExibicao:
                this.formatarValor(atendimento.valorTotal)
        }));
    }

    cadastrar(): void {
        const animal = this.listaAnimais.find(
            item => item.id === this.novoAtendimento.idAnimal
        );

        const veterinario = this.listaVeterinarios.find(
            item => item.id === this.novoAtendimento.idProfissional
        );

        if (
            !this.novoAtendimento.dataPrevista ||
            !animal ||
            !veterinario
        ) {
            return;
        }

        const maiorId = this.listaAtendimentos.reduce(
            (maior, atendimento) =>
                Math.max(maior, atendimento.id),
            0
        );

        this.listaAtendimentos.push({
            id: maiorId + 1,
            situacao: 'AGENDADO',
            dataPrevista: this.novoAtendimento.dataPrevista,
            dataRealizada: null,
            idAnimal: animal.id,
            nomeAnimal: animal.nome,
            idProfissional: veterinario.id,
            nomeProfissional: veterinario.nome,
            valorTotal: 0,
            diagnostico: null,
            servicos: []
        });

        this.novoAtendimento = {
            dataPrevista: '',
            idAnimal: 0,
            idProfissional: 0
        };
    }

    prepararDetalhes(item: AtendimentoTabela): void {
        this.atendimentoSelecionado =
            this.buscarAtendimento(item.id);
    }

    prepararEdicao(item: AtendimentoTabela): void {
        const atendimento = this.buscarAtendimento(item.id);

        if (!atendimento) {
            this.atendimentoEditar = null;
            return;
        }

        this.atendimentoEditar = {
            ...atendimento,
            servicos: [...atendimento.servicos]
        };
    }

    salvarEdicao(): void {
        if (!this.atendimentoEditar) {
            return;
        }

        if (this.ehSecretaria) {
            const animal = this.listaAnimais.find(
                item => item.id === this.atendimentoEditar?.idAnimal
            );

            const veterinario = this.listaVeterinarios.find(
                item => item.id ===
                    this.atendimentoEditar?.idProfissional
            );

            if (!animal || !veterinario) {
                return;
            }

            this.atendimentoEditar.nomeAnimal = animal.nome;
            this.atendimentoEditar.nomeProfissional =
                veterinario.nome;
        }

        if (this.ehVeterinario) {
            if (
                this.atendimentoEditar.situacao === 'REALIZADO' &&
                !this.atendimentoEditar.dataRealizada
            ) {
                this.atendimentoEditar.dataRealizada =
                    this.obterDataHoraAtual();
            }

            if (
                this.atendimentoEditar.situacao !== 'REALIZADO'
            ) {
                this.atendimentoEditar.dataRealizada = null;
            }
        }

        const index = this.listaAtendimentos.findIndex(
            atendimento =>
                atendimento.id === this.atendimentoEditar?.id
        );

        if (index !== -1) {
            this.listaAtendimentos[index] = {
                ...this.atendimentoEditar
            };
        }
    }

    prepararExclusao(item: AtendimentoTabela): void {
        this.atendimentoExcluir =
            this.buscarAtendimento(item.id);
    }

    deletar(): void {
        if (!this.atendimentoExcluir) {
            return;
        }

        this.listaAtendimentos =
            this.listaAtendimentos.filter(
                atendimento =>
                    atendimento.id !== this.atendimentoExcluir?.id
            );

        this.atendimentoExcluir = null;
    }

    prepararDiagnostico(item: AtendimentoTabela): void {
        this.atendimentoSelecionado =
            this.buscarAtendimento(item.id);

        this.diagnosticoDigitado =
            this.atendimentoSelecionado?.diagnostico ?? '';
    }

    salvarDiagnostico(): void {
        if (!this.atendimentoSelecionado) {
            return;
        }

        const index = this.listaAtendimentos.findIndex(
            atendimento =>
                atendimento.id === this.atendimentoSelecionado?.id
        );

        if (index !== -1) {
            this.listaAtendimentos[index].diagnostico =
                this.diagnosticoDigitado;
        }

        this.diagnosticoDigitado = '';
    }

    formatarData(data: string | null): string {
        if (!data) {
            return '-';
        }

        return new Intl.DateTimeFormat('pt-BR', {
            dateStyle: 'short',
            timeStyle: 'short'
        }).format(new Date(data));
    }

    formatarValor(valor: number): string {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    }

    formatarSituacao(
        situacao: SituacaoAtendimento
    ): string {
        const situacoes: Record<SituacaoAtendimento, string> = {
            AGENDADO: 'Agendado',
            EM_ANDAMENTO: 'Em andamento',
            REALIZADO: 'Realizado'
        };

        return situacoes[situacao];
    }

    private buscarAtendimento(
        id: number
    ): Atendimento | null {
        return this.listaAtendimentos.find(
            atendimento => atendimento.id === id
        ) ?? null;
    }

    private obterDataHoraAtual(): string {
        const agora = new Date();

        const diferencaFuso =
            agora.getTimezoneOffset() * 60000;

        return new Date(
            agora.getTime() - diferencaFuso
        )
            .toISOString()
            .slice(0, 16);
    }
}
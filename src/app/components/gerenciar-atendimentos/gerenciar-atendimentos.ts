import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from "@angular/common/http";

import { Animal } from '../../models/animal';
import { Usuario } from '../../models/usuario';

import { AnimalService } from '../../services/animal.service';
import { UsuarioService } from '../../services/usuario.service';

import { Crudgenerico, CrudColuna } from '../crudgenerico/crudgenerico';

import { Modalgenerico } from '../modalgenerico/modalgenerico';

import { Atendimento as AtendimentoBackend } from '../../models/atendimento';
import { AtendimentoService } from '../../services/atendimento.service';

type PerfilTela = 'SECRETARIA' | 'VETERINARIO';

type SituacaoAtendimento =
    | 'AGENDADO'
    | 'EM_ANDAMENTO'
    | 'REALIZADO'
    | 'CANCELADO';

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

interface VeterinarioOpcao {
    id: number;
    nome: string;
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
export class GerenciarAtendimentosComponent implements OnInit {

    private readonly route = inject(ActivatedRoute);
    private readonly atendimentoService = inject(AtendimentoService);
    private readonly animalService = inject(AnimalService);
    private readonly usuarioService = inject(UsuarioService);

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

    listaAtendimentos: Atendimento[] = [];
    listaAnimais: Animal[] = [];
    listaVeterinarios: VeterinarioOpcao[] = [];

    carregandoAtendimentos: boolean = false;
    mensagemErroAtendimentos: string = '';

    ngOnInit(): void {
        this.carregarAtendimentos();
        this.carregarAnimais();
        this.carregarVeterinarios();
    }

    carregarAtendimentos(): void {
        this.carregandoAtendimentos = true;
        this.mensagemErroAtendimentos = '';

        this.atendimentoService.listar().subscribe({
            next: (
                atendimentos: AtendimentoBackend[]
            ) => {
                this.listaAtendimentos =
                    atendimentos.map(atendimento => ({
                        id: atendimento.id,
                        situacao: atendimento.situacao,
                        dataPrevista: atendimento.dataPrevista,
                        dataRealizada: atendimento.dataRealizada,

                        idAnimal: atendimento.idAnimal,
                        nomeAnimal: atendimento.nomeAnimal,

                        idProfissional:
                            atendimento.idPessoaProfissional,

                        nomeProfissional:
                            atendimento.nomeProfissional,

                        valorTotal: atendimento.valorTotal,
                        diagnostico: null,
                        servicos: []
                    }));

                this.carregandoAtendimentos = false;
            },

            error: (erro: HttpErrorResponse) => {
                console.error(
                    'Erro ao carregar atendimentos:',
                    erro
                );

                this.mensagemErroAtendimentos =
                    'Não foi possível carregar os atendimentos.';

                this.carregandoAtendimentos = false;
            }
        });
    }

    carregarAnimais(): void {
        this.animalService.listar().subscribe({
            next: (animais: Animal[]) => {
                this.listaAnimais = animais;
            },

            error: (erro: HttpErrorResponse) => {
                console.error(
                    'Erro ao carregar animais:',
                    erro
                );

                this.mensagemErroAtendimentos =
                    'Não foi possível carregar os animais.';
            }
        });
    }

    carregarVeterinarios(): void {
        this.usuarioService
            .listarVeterinarios()
            .subscribe({
                next: (veterinarios: Usuario[]) => {
                    this.listaVeterinarios =
                        veterinarios.map(veterinario => ({
                            id: veterinario.pessoaId,
                            nome: veterinario.nomePessoa
                        }));
                },

                error: (erro: HttpErrorResponse) => {
                    console.error(
                        'Erro ao carregar veterinários:',
                        erro
                    );

                    this.mensagemErroAtendimentos =
                        'Não foi possível carregar os veterinários.';
                }
            });
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
            REALIZADO: 'Realizado',
            CANCELADO: 'Cancelado'
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
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, forkJoin, map, Observable, of, switchMap } from 'rxjs';

import { Animal } from '../../models/animal';
import { Usuario } from '../../models/usuario';
import { Atendimento as AtendimentoBackend, AtendimentoRequest, SituacaoAtendimento } from '../../models/atendimento';
import { AtendimentoServico } from '../../models/atendimento-servico';
import { Diagnostico } from '../../models/diagnostico';
import { Servico } from '../../models/servico';

import { AnimalService } from '../../services/animal.service';
import { UsuarioService } from '../../services/usuario.service';
import { AtendimentoService } from '../../services/atendimento.service';
import { AtendimentoServicoService } from '../../services/atendimento-servico.service';
import { DiagnosticoService } from '../../services/diagnostico.service';
import { ServicoService } from '../../services/servico.service';
import { AutenticacaoService } from '../../services/autenticacao.service';

import { Crudgenerico, CrudColuna } from '../crudgenerico/crudgenerico';
import { Modalgenerico } from '../modalgenerico/modalgenerico';

type PerfilTela = 'SECRETARIA' | 'VETERINARIO';

interface ServicoAtendimento {
    id: number;
    idServico: number;
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

    diagnosticoId: number | null;
    diagnostico: string | null;

    servicos: ServicoAtendimento[];
}

interface AtendimentoTabela {
    id: number;
    situacao: SituacaoAtendimento;
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

    private readonly atendimentoService =
        inject(AtendimentoService);

    private readonly animalService =
        inject(AnimalService);

    private readonly usuarioService =
        inject(UsuarioService);

    private readonly atendimentoServicoService =
        inject(AtendimentoServicoService);

    private readonly diagnosticoService =
        inject(DiagnosticoService);

    private readonly servicoService =
        inject(ServicoService);

    private readonly autenticacaoService =
        inject(AutenticacaoService);

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

    novoServico = {
        idServico: 0,
        quantidade: 1
    };

    atendimentoSelecionado: Atendimento | null = null;
    atendimentoEditar: Atendimento | null = null;
    atendimentoExcluir: Atendimento | null = null;

    situacaoPersistidaEdicao:
        SituacaoAtendimento | null = null;

    diagnosticoDigitado: string = '';

    listaAtendimentos: Atendimento[] = [];
    listaAnimais: Animal[] = [];
    listaVeterinarios: VeterinarioOpcao[] = [];
    listaServicos: Servico[] = [];

    carregandoAtendimentos: boolean = false;
    salvandoAtendimento: boolean = false;

    mensagemErroAtendimentos: string = '';
    mensagemSucessoAtendimentos: string = '';

    get ehSecretaria(): boolean {
        return this.perfil === 'SECRETARIA';
    }

    get ehVeterinario(): boolean {
        return this.perfil === 'VETERINARIO';
    }

    get podeGerenciarServicos(): boolean {
        return (
            this.ehVeterinario &&
            this.situacaoPersistidaEdicao === 'EM_ANDAMENTO'
        );
    }

    get situacoesDisponiveisEdicao():
        SituacaoAtendimento[] {

        if (this.situacaoPersistidaEdicao === 'AGENDADO') {
            return [
                'AGENDADO',
                'EM_ANDAMENTO',
                'CANCELADO'
            ];
        }

        if (
            this.situacaoPersistidaEdicao ===
            'EM_ANDAMENTO'
        ) {
            return [
                'EM_ANDAMENTO',
                'REALIZADO',
                'CANCELADO'
            ];
        }

        if (this.situacaoPersistidaEdicao) {
            return [this.situacaoPersistidaEdicao];
        }

        return [];
    }

    ngOnInit(): void {
        this.carregarAtendimentos();
        this.carregarAnimais();
        this.carregarVeterinarios();
        this.carregarServicos();
    }

    carregarAtendimentos(): void {
        this.carregandoAtendimentos = true;
        this.mensagemErroAtendimentos = '';

        this.atendimentoService.listar()
            .pipe(
                switchMap(atendimentos => {
                    let atendimentosFiltrados = atendimentos;

                    if (this.ehVeterinario) {
                        const autenticacao =
                            this.autenticacaoService
                                .getAutenticacao();

                        if (autenticacao) {
                            atendimentosFiltrados =
                                atendimentos.filter(
                                    atendimento =>
                                        atendimento
                                            .idPessoaProfissional ===
                                        autenticacao.pessoaId
                                );
                        }
                    }

                    if (
                        atendimentosFiltrados.length === 0
                    ) {
                        return of([] as Atendimento[]);
                    }

                    return forkJoin(
                        atendimentosFiltrados.map(
                            atendimento =>
                                this.buscarAtendimentoCompleto(
                                    atendimento
                                )
                        )
                    );
                })
            )
            .subscribe({
                next: atendimentos => {
                    this.listaAtendimentos = atendimentos;
                    this.carregandoAtendimentos = false;
                },

                error: (erro: HttpErrorResponse) => {
                    console.error(
                        'Erro ao carregar atendimentos:',
                        erro
                    );

                    this.mensagemErroAtendimentos =
                        this.obterMensagemErro(
                            erro,
                            'Não foi possível carregar os atendimentos.'
                        );

                    this.carregandoAtendimentos = false;
                }
            });
    }

    carregarAnimais(): void {
        this.animalService.listar().subscribe({
            next: animais => {
                this.listaAnimais = animais;
            },

            error: (erro: HttpErrorResponse) => {
                console.error(
                    'Erro ao carregar animais:',
                    erro
                );

                this.mensagemErroAtendimentos =
                    this.obterMensagemErro(
                        erro,
                        'Não foi possível carregar os animais.'
                    );
            }
        });
    }

    carregarVeterinarios(): void {
        this.usuarioService
            .listarVeterinarios()
            .subscribe({
                next: (veterinarios: Usuario[]) => {
                    this.listaVeterinarios =
                        veterinarios.map(
                            veterinario => ({
                                id: veterinario.pessoaId,
                                nome: veterinario.nomePessoa
                            })
                        );
                },

                error: (erro: HttpErrorResponse) => {
                    console.error(
                        'Erro ao carregar veterinários:',
                        erro
                    );

                    this.mensagemErroAtendimentos =
                        this.obterMensagemErro(
                            erro,
                            'Não foi possível carregar os veterinários.'
                        );
                }
            });
    }

    carregarServicos(): void {
        this.servicoService.listar().subscribe({
            next: servicos => {
                this.listaServicos = servicos;
            },

            error: (erro: HttpErrorResponse) => {
                console.error(
                    'Erro ao carregar serviços:',
                    erro
                );

                this.mensagemErroAtendimentos =
                    this.obterMensagemErro(
                        erro,
                        'Não foi possível carregar os serviços.'
                    );
            }
        });
    }

    get dadosTabela(): AtendimentoTabela[] {
        return this.listaAtendimentos.map(
            atendimento => ({
                id: atendimento.id,
                situacao: atendimento.situacao,

                situacaoExibicao:
                    this.formatarSituacao(
                        atendimento.situacao
                    ),

                dataPrevistaExibicao:
                    this.formatarData(
                        atendimento.dataPrevista
                    ),

                dataRealizadaExibicao:
                    this.formatarData(
                        atendimento.dataRealizada
                    ),

                nomeAnimal: atendimento.nomeAnimal,

                nomeProfissional:
                    atendimento.nomeProfissional,

                valorTotalExibicao:
                    this.formatarValor(
                        atendimento.valorTotal
                    )
            })
        );
    }

    cadastrar(): void {
        this.limparMensagens();

        const animal = this.listaAnimais.find(
            item =>
                item.id ===
                this.novoAtendimento.idAnimal
        );

        const veterinario =
            this.listaVeterinarios.find(
                item =>
                    item.id ===
                    this.novoAtendimento.idProfissional
            );

        if (
            !this.novoAtendimento.dataPrevista ||
            !animal ||
            !veterinario
        ) {
            this.mensagemErroAtendimentos =
                'Preencha todos os campos do atendimento.';

            return;
        }

        const request: AtendimentoRequest = {
            dataPrevista:
                this.novoAtendimento.dataPrevista,

            dataRealizada: null,
            situacao: 'AGENDADO',

            idAnimal:
                this.novoAtendimento.idAnimal,

            idPessoaProfissional:
                this.novoAtendimento.idProfissional
        };

        this.salvandoAtendimento = true;

        this.atendimentoService
            .inserir(request)
            .subscribe({
                next: () => {
                    this.novoAtendimento = {
                        dataPrevista: '',
                        idAnimal: 0,
                        idProfissional: 0
                    };

                    this.mensagemSucessoAtendimentos =
                        'Atendimento cadastrado com sucesso.';

                    this.salvandoAtendimento = false;

                    this.carregarAtendimentos();
                },

                error: (erro: HttpErrorResponse) => {
                    console.error(
                        'Erro ao cadastrar atendimento:',
                        erro
                    );

                    this.mensagemErroAtendimentos =
                        this.obterMensagemErro(
                            erro,
                            'Não foi possível cadastrar o atendimento.'
                        );

                    this.salvandoAtendimento = false;
                }
            });
    }

    prepararDetalhes(
        item: AtendimentoTabela
    ): void {

        this.atendimentoSelecionado =
            this.buscarAtendimento(item.id);
    }

    prepararEdicao(
        item: AtendimentoTabela
    ): void {

        this.limparMensagens();

        const atendimento =
            this.buscarAtendimento(item.id);

        if (!atendimento) {
            this.atendimentoEditar = null;
            return;
        }

        if (
            this.ehSecretaria &&
            atendimento.situacao !== 'AGENDADO'
        ) {
            this.atendimentoEditar = null;

            this.mensagemErroAtendimentos =
                'A secretária só pode editar atendimentos agendados.';

            return;
        }

        if (
            this.ehVeterinario &&
            (
                atendimento.situacao === 'REALIZADO' ||
                atendimento.situacao === 'CANCELADO'
            )
        ) {
            this.atendimentoEditar = null;

            this.mensagemErroAtendimentos =
                'Atendimentos encerrados não podem ser alterados.';

            return;
        }

        this.atendimentoEditar = {
            ...atendimento,
            servicos: atendimento.servicos.map(
                servico => ({ ...servico })
            )
        };

        this.situacaoPersistidaEdicao =
            atendimento.situacao;

        this.novoServico = {
            idServico: 0,
            quantidade: 1
        };
    }

    salvarEdicao(): void {
        this.persistirEdicao();
    }

    salvarSituacaoVeterinario(): void {
        if (!this.ehVeterinario) {
            return;
        }

        this.persistirEdicao();
    }

    private persistirEdicao(): void {
        this.limparMensagens();

        if (!this.atendimentoEditar) {
            return;
        }

        if (
            this.ehSecretaria &&
            this.situacaoPersistidaEdicao !==
            'AGENDADO'
        ) {
            this.mensagemErroAtendimentos =
                'Somente atendimentos agendados podem ser editados.';

            return;
        }

        if (
            this.situacaoPersistidaEdicao ===
            'REALIZADO' ||
            this.situacaoPersistidaEdicao ===
            'CANCELADO'
        ) {
            this.mensagemErroAtendimentos =
                'Atendimentos encerrados não podem ser alterados.';

            return;
        }

        const request: AtendimentoRequest = {
            dataPrevista:
                this.atendimentoEditar.dataPrevista,

            dataRealizada: null,

            situacao:
                this.atendimentoEditar.situacao,

            idAnimal:
                this.atendimentoEditar.idAnimal,

            idPessoaProfissional:
                this.atendimentoEditar.idProfissional
        };

        this.salvandoAtendimento = true;

        this.atendimentoService
            .alterar(
                this.atendimentoEditar.id,
                request
            )
            .subscribe({
                next: atendimentoAtualizado => {
                    this.atualizarBaseAtendimento(
                        atendimentoAtualizado
                    );

                    this.situacaoPersistidaEdicao =
                        atendimentoAtualizado.situacao;

                    this.mensagemSucessoAtendimentos =
                        'Atendimento atualizado com sucesso.';

                    this.salvandoAtendimento = false;
                },

                error: (erro: HttpErrorResponse) => {
                    console.error(
                        'Erro ao atualizar atendimento:',
                        erro
                    );

                    this.mensagemErroAtendimentos =
                        this.obterMensagemErro(
                            erro,
                            'Não foi possível atualizar o atendimento.'
                        );

                    this.salvandoAtendimento = false;
                }
            });
    }

    adicionarServico(): void {
        this.limparMensagens();

        if (!this.atendimentoEditar) {
            return;
        }

        if (!this.podeGerenciarServicos) {
            this.mensagemErroAtendimentos =
                'Serviços só podem ser adicionados quando o atendimento estiver em andamento.';

            return;
        }

        if (
            this.novoServico.idServico <= 0 ||
            this.novoServico.quantidade < 1
        ) {
            this.mensagemErroAtendimentos =
                'Selecione um serviço e informe uma quantidade válida.';

            return;
        }

        const servicoJaAdicionado =
            this.atendimentoEditar.servicos.some(
                servico =>
                    servico.idServico ===
                    this.novoServico.idServico
            );

        if (servicoJaAdicionado) {
            this.mensagemErroAtendimentos =
                'Este serviço já foi adicionado ao atendimento.';

            return;
        }

        const idAtendimento =
            this.atendimentoEditar.id;

        this.atendimentoServicoService
            .inserir({
                idAtendimento,
                idServico:
                    this.novoServico.idServico,
                quantidade:
                    this.novoServico.quantidade
            })
            .pipe(
                switchMap(() =>
                    this.atendimentoService
                        .buscarPorId(idAtendimento)
                ),
                switchMap(atendimento =>
                    this.buscarAtendimentoCompleto(
                        atendimento
                    )
                )
            )
            .subscribe({
                next: atendimentoAtualizado => {
                    this.substituirAtendimento(
                        atendimentoAtualizado
                    );

                    this.atendimentoEditar = {
                        ...atendimentoAtualizado,
                        servicos:
                            atendimentoAtualizado
                                .servicos
                                .map(
                                    servico => ({
                                        ...servico
                                    })
                                )
                    };

                    this.novoServico = {
                        idServico: 0,
                        quantidade: 1
                    };

                    this.mensagemSucessoAtendimentos =
                        'Serviço adicionado com sucesso.';
                },

                error: (erro: HttpErrorResponse) => {
                    console.error(
                        'Erro ao adicionar serviço:',
                        erro
                    );

                    this.mensagemErroAtendimentos =
                        this.obterMensagemErro(
                            erro,
                            'Não foi possível adicionar o serviço.'
                        );
                }
            });
    }

    removerServico(
        servico: ServicoAtendimento
    ): void {

        this.limparMensagens();

        if (
            !this.atendimentoEditar ||
            !this.podeGerenciarServicos
        ) {
            this.mensagemErroAtendimentos =
                'Serviços só podem ser removidos quando o atendimento estiver em andamento.';

            return;
        }

        const idAtendimento =
            this.atendimentoEditar.id;

        this.atendimentoServicoService
            .excluir(servico.id)
            .pipe(
                switchMap(() =>
                    this.atendimentoService
                        .buscarPorId(idAtendimento)
                ),
                switchMap(atendimento =>
                    this.buscarAtendimentoCompleto(
                        atendimento
                    )
                )
            )
            .subscribe({
                next: atendimentoAtualizado => {
                    this.substituirAtendimento(
                        atendimentoAtualizado
                    );

                    this.atendimentoEditar = {
                        ...atendimentoAtualizado,
                        servicos:
                            atendimentoAtualizado
                                .servicos
                                .map(
                                    item => ({
                                        ...item
                                    })
                                )
                    };

                    this.mensagemSucessoAtendimentos =
                        'Serviço removido com sucesso.';
                },

                error: (erro: HttpErrorResponse) => {
                    console.error(
                        'Erro ao remover serviço:',
                        erro
                    );

                    this.mensagemErroAtendimentos =
                        this.obterMensagemErro(
                            erro,
                            'Não foi possível remover o serviço.'
                        );
                }
            });
    }

    prepararExclusao(
        item: AtendimentoTabela
    ): void {

        this.limparMensagens();

        const atendimento =
            this.buscarAtendimento(item.id);

        if (
            !atendimento ||
            atendimento.situacao !== 'AGENDADO'
        ) {
            this.atendimentoExcluir = null;

            this.mensagemErroAtendimentos =
                'Somente atendimentos agendados podem ser excluídos.';

            return;
        }

        this.atendimentoExcluir = atendimento;
    }

    deletar(): void {
        this.limparMensagens();

        if (!this.atendimentoExcluir) {
            return;
        }

        if (
            this.atendimentoExcluir.situacao !==
            'AGENDADO'
        ) {
            this.mensagemErroAtendimentos =
                'Somente atendimentos agendados podem ser excluídos.';

            return;
        }

        const id = this.atendimentoExcluir.id;

        this.atendimentoService
            .excluir(id)
            .subscribe({
                next: () => {
                    this.listaAtendimentos =
                        this.listaAtendimentos.filter(
                            atendimento =>
                                atendimento.id !== id
                        );

                    this.atendimentoExcluir = null;

                    this.mensagemSucessoAtendimentos =
                        'Atendimento excluído com sucesso.';
                },

                error: (erro: HttpErrorResponse) => {
                    console.error(
                        'Erro ao excluir atendimento:',
                        erro
                    );

                    this.mensagemErroAtendimentos =
                        this.obterMensagemErro(
                            erro,
                            'Não foi possível excluir o atendimento.'
                        );
                }
            });
    }

    prepararDiagnostico(
        item: AtendimentoTabela
    ): void {

        this.limparMensagens();

        this.atendimentoSelecionado =
            this.buscarAtendimento(item.id);

        this.diagnosticoDigitado =
            this.atendimentoSelecionado
                ?.diagnostico ?? '';
    }

    salvarDiagnostico(): void {
        this.limparMensagens();

        const atendimento =
            this.atendimentoSelecionado;

        if (!atendimento) {
            return;
        }

        if (
            atendimento.situacao !==
            'EM_ANDAMENTO'
        ) {
            this.mensagemErroAtendimentos =
                'O diagnóstico só pode ser registrado ou alterado quando o atendimento estiver em andamento.';

            return;
        }

        const descricao =
            this.diagnosticoDigitado.trim();

        if (!descricao) {
            this.mensagemErroAtendimentos =
                'Informe a descrição do diagnóstico.';

            return;
        }

        const request = {
            descricao,
            idAtendimento: atendimento.id
        };

        const editando =
            atendimento.diagnosticoId !== null;

        const operacao = editando
            ? this.diagnosticoService.alterar(
                atendimento.diagnosticoId!,
                request
            )
            : this.diagnosticoService.inserir(
                request
            );

        operacao.subscribe({
            next: diagnostico => {

                const atendimentoAtualizado: Atendimento = {
                    ...atendimento,

                    diagnosticoId:
                        diagnostico.id,

                    diagnostico:
                        diagnostico.descricao
                };

                this.atendimentoSelecionado =
                    atendimentoAtualizado;

                this.substituirAtendimento(
                    atendimentoAtualizado
                );

                this.diagnosticoDigitado =
                    diagnostico.descricao;

                this.mensagemSucessoAtendimentos =
                    editando
                        ? 'Diagnóstico atualizado com sucesso.'
                        : 'Diagnóstico registrado com sucesso.';
            },

            error: (erro: HttpErrorResponse) => {
                console.error(
                    'Erro ao salvar diagnóstico:',
                    erro
                );

                this.mensagemErroAtendimentos =
                    this.obterMensagemErro(
                        erro,
                        editando
                            ? 'Não foi possível atualizar o diagnóstico.'
                            : 'Não foi possível registrar o diagnóstico.'
                    );
            }
        });
    }

    podeEditarAtendimento(
        item: AtendimentoTabela
    ): boolean {

        if (this.ehSecretaria) {
            return item.situacao === 'AGENDADO';
        }

        return (
            item.situacao !== 'REALIZADO' &&
            item.situacao !== 'CANCELADO'
        );
    }

    podeExcluirAtendimento(
        item: AtendimentoTabela
    ): boolean {

        return (
            this.ehSecretaria &&
            item.situacao === 'AGENDADO'
        );
    }

    podeRegistrarDiagnostico(
        item: AtendimentoTabela
    ): boolean {

        const atendimento =
            this.buscarAtendimento(item.id);

        return (
            this.ehVeterinario &&
            atendimento?.situacao ===
            'EM_ANDAMENTO'
        );
    }

    possuiDiagnostico(
        item: AtendimentoTabela
    ): boolean {

        const atendimento =
            this.buscarAtendimento(item.id);

        return (
            atendimento?.diagnosticoId !== null &&
            atendimento?.diagnosticoId !== undefined
        );
    }

    formatarData(
        data: string | null
    ): string {

        if (!data) {
            return '-';
        }

        return new Intl.DateTimeFormat(
            'pt-BR',
            {
                dateStyle: 'short',
                timeStyle: 'short'
            }
        ).format(new Date(data));
    }

    formatarValor(valor: number): string {
        return new Intl.NumberFormat(
            'pt-BR',
            {
                style: 'currency',
                currency: 'BRL'
            }
        ).format(valor);
    }

    formatarSituacao(
        situacao: SituacaoAtendimento
    ): string {

        const situacoes:
            Record<
                SituacaoAtendimento,
                string
            > = {

            AGENDADO: 'Agendado',
            EM_ANDAMENTO: 'Em andamento',
            REALIZADO: 'Realizado',
            CANCELADO: 'Cancelado'
        };

        return situacoes[situacao];
    }

    private buscarAtendimentoCompleto(
        atendimento: AtendimentoBackend
    ): Observable<Atendimento> {

        return forkJoin({
            servicos:
                this.atendimentoServicoService
                    .listarPorAtendimento(
                        atendimento.id
                    )
                    .pipe(
                        catchError(
                            (
                                erro:
                                    HttpErrorResponse
                            ) => {

                                console.error(
                                    'Erro ao carregar serviços do atendimento:',
                                    erro
                                );

                                return of(
                                    [] as AtendimentoServico[]
                                );
                            }
                        )
                    ),

            diagnostico:
                this.diagnosticoService
                    .buscarPorAtendimento(
                        atendimento.id
                    )
                    .pipe(
                        catchError(
                            (
                                erro:
                                    HttpErrorResponse
                            ) => {

                                if (erro.status !== 404) {
                                    console.error(
                                        'Erro ao carregar diagnóstico:',
                                        erro
                                    );
                                }

                                return of<
                                    Diagnostico | null
                                >(null);
                            }
                        )
                    )
        }).pipe(
            map(({ servicos, diagnostico }) =>
                this.converterAtendimento(
                    atendimento,
                    servicos,
                    diagnostico
                )
            )
        );
    }

    private converterAtendimento(
        atendimento: AtendimentoBackend,
        servicos: AtendimentoServico[],
        diagnostico: Diagnostico | null
    ): Atendimento {

        return {
            id: atendimento.id,
            situacao: atendimento.situacao,

            dataPrevista:
                atendimento.dataPrevista,

            dataRealizada:
                atendimento.dataRealizada,

            idAnimal:
                atendimento.idAnimal,

            nomeAnimal:
                atendimento.nomeAnimal,

            idProfissional:
                atendimento.idPessoaProfissional,

            nomeProfissional:
                atendimento.nomeProfissional,

            valorTotal:
                atendimento.valorTotal,

            diagnosticoId:
                diagnostico?.id ?? null,

            diagnostico:
                diagnostico?.descricao ?? null,

            servicos: servicos.map(
                servico => ({
                    id: servico.id,
                    idServico:
                        servico.idServico,
                    nome:
                        servico.nomeServico,
                    quantidade:
                        servico.quantidade,
                    valor:
                        servico.valor,
                    subtotal:
                        servico.subTotal
                })
            )
        };
    }

    private atualizarBaseAtendimento(
        atendimento: AtendimentoBackend
    ): void {

        const existente =
            this.buscarAtendimento(
                atendimento.id
            );

        const atualizado: Atendimento = {
            id: atendimento.id,
            situacao: atendimento.situacao,

            dataPrevista:
                atendimento.dataPrevista,

            dataRealizada:
                atendimento.dataRealizada,

            idAnimal:
                atendimento.idAnimal,

            nomeAnimal:
                atendimento.nomeAnimal,

            idProfissional:
                atendimento.idPessoaProfissional,

            nomeProfissional:
                atendimento.nomeProfissional,

            valorTotal:
                atendimento.valorTotal,

            diagnosticoId:
                existente?.diagnosticoId ?? null,

            diagnostico:
                existente?.diagnostico ?? null,

            servicos:
                existente?.servicos ?? []
        };

        this.substituirAtendimento(atualizado);

        this.atendimentoEditar = {
            ...atualizado,
            servicos: atualizado.servicos.map(
                servico => ({ ...servico })
            )
        };
    }

    private substituirAtendimento(
        atendimentoAtualizado: Atendimento
    ): void {

        const index =
            this.listaAtendimentos.findIndex(
                atendimento =>
                    atendimento.id ===
                    atendimentoAtualizado.id
            );

        if (index !== -1) {
            this.listaAtendimentos[index] =
                atendimentoAtualizado;
        }

        if (
            this.atendimentoSelecionado?.id ===
            atendimentoAtualizado.id
        ) {
            this.atendimentoSelecionado =
                atendimentoAtualizado;
        }
    }

    private buscarAtendimento(
        id: number
    ): Atendimento | null {

        return this.listaAtendimentos.find(
            atendimento =>
                atendimento.id === id
        ) ?? null;
    }

    private limparMensagens(): void {
        this.mensagemErroAtendimentos = '';
        this.mensagemSucessoAtendimentos = '';
    }

    private obterMensagemErro(
        erro: HttpErrorResponse,
        mensagemPadrao: string
    ): string {

        const mensagemBackend =
            erro.error?.message;

        if (
            typeof mensagemBackend ===
            'string' &&
            mensagemBackend.trim()
        ) {
            return mensagemBackend;
        }

        return mensagemPadrao;
    }
}
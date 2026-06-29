export type SituacaoAtendimento =
    | 'AGENDADO'
    | 'EM_ANDAMENTO'
    | 'REALIZADO'
    | 'CANCELADO';

export interface Atendimento {
    id: number;
    dataPrevista: string;
    dataRealizada: string | null;
    situacao: SituacaoAtendimento;
    valorTotal: number;
    idAnimal: number;
    nomeAnimal: string;
    idPessoaProfissional: number;
    nomeProfissional: string;
}

export interface AtendimentoRequest {
    dataPrevista: string;
    dataRealizada: string | null;
    situacao: SituacaoAtendimento;
    idAnimal: number;
    idPessoaProfissional: number;
}
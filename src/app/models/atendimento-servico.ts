export interface AtendimentoServico {
    id: number;
    idAtendimento: number;
    idServico: number;
    nomeServico: string;
    quantidade: number;
    valor: number;
    subTotal: number;
}

export interface AtendimentoServicoRequest {
    quantidade: number;
    idAtendimento: number;
    idServico: number;
}
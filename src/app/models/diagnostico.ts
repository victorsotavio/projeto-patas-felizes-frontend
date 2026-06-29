export interface Diagnostico {
    id: number;
    descricao: string;
    idAtendimento: number;
}

export interface DiagnosticoRequest {
    descricao: string;
    idAtendimento: number;
}
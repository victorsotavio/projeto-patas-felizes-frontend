import { Atendimento } from "./atendimento";

export interface Diagnostico {
    id?: number;
    descricao: string;
    atendimento: Atendimento;
}
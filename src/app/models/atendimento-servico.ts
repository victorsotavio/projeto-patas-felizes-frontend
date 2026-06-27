import { Atendimento } from "./atendimento";
import { Servico } from "./servico";

export interface AtendimentoServico {
    id?: number;
    quantidade: number;
    valor: number;
    atendimento?: Atendimento;
    servico: Servico;
}
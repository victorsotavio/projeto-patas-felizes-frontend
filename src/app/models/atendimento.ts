import { Animal } from "./animal";
import { AtendimentoServico } from "./atendimento-servico";
import { Pessoa } from "./pessoa";

export interface Atendimento {
    id?: number;
    dataPrevista: string; // ISO String (LocalDateTime)
    dataRealizada?: string; // Opcional (pode ser nulo no Java)
    situacao: 'AGENDADO' | 'EM_ANDAMENTO' | 'CONCLUIDO' | 'CANCELADO' | string; // Ajuste conforme seu SituacaoAtendimento.java
    valorTotal: number;
    animal: Animal;
    profissional: Pessoa;
    servicos: AtendimentoServico[];
}
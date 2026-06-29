import { Pessoa } from "./pessoa";

export interface Animal {
    id: number;
    nome: string;
    idPessoaDono: number; // Dono do animal
}

export interface AnimalRequest {
    nome: string;
    idPessoaDono: number; // Dono do animal
}
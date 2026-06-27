import { Pessoa } from "./pessoa";

export interface Animal {
    id?: number;
    nome: string;
    pessoa?: Pessoa; // Dono do animal
}
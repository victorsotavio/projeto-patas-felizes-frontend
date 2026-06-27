import { Pessoa } from "./pessoa";

export interface Usuario {
    id?: number;
    email: string;
    senha?: string; // Opcional, pois geralmente não expomos a senha em listagens
    perfil: 'ADMINISTRADOR' | 'VETERINARIO' | 'RECEPCIONISTA' | string; // Ajuste conforme seus enums reais
    pessoa: Pessoa;
}
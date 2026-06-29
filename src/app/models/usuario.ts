export interface Usuario {
    id: number;
    email: string;
    perfil: 'SECRETARIA' | 'VETERINARIO' | 'CLIENTE';
    pessoaId: number;
    nomePessoa: string;
}
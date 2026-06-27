export interface Autenticacao {
    id: number;
    email: string;
    perfil: 'ADMINISTRADOR' | 'VETERINARIO' | 'SECRETARIA';
    pessoaId: number;
    nomePessoa: string;
}

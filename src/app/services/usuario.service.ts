import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
    AlterarSenhaRequest
} from '../models/alterar-senha';

import { Usuario } from '../models/usuario';

@Injectable({
    providedIn: 'root'
})
export class UsuarioService {

    private readonly apiUrl =
        'http://localhost:8080/usuarios';

    private readonly http = inject(HttpClient);

    listarVeterinarios(): Observable<Usuario[]> {
        return this.http.get<Usuario[]>(
            `${this.apiUrl}/veterinarios`
        );
    }

    alterarSenha(
        idUsuario: number,
        dados: AlterarSenhaRequest
    ): Observable<void> {

        return this.http.put<void>(
            `${this.apiUrl}/${idUsuario}/senha`,
            dados
        );
    }
}
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
    Atendimento,
    AtendimentoRequest
} from '../models/atendimento';

@Injectable({
    providedIn: 'root'
})
export class AtendimentoService {

    private readonly apiUrl =
        'http://localhost:8080/atendimentos';

    private readonly http = inject(HttpClient);

    listar(): Observable<Atendimento[]> {
        return this.http.get<Atendimento[]>(
            this.apiUrl
        );
    }

    buscarPorId(id: number): Observable<Atendimento> {
        return this.http.get<Atendimento>(
            `${this.apiUrl}/${id}`
        );
    }

    inserir(
        atendimento: AtendimentoRequest
    ): Observable<Atendimento> {
        return this.http.post<Atendimento>(
            this.apiUrl,
            atendimento
        );
    }

    alterar(
        id: number,
        atendimento: AtendimentoRequest
    ): Observable<Atendimento> {
        return this.http.put<Atendimento>(
            `${this.apiUrl}/${id}`,
            atendimento
        );
    }

    excluir(id: number): Observable<void> {
        return this.http.delete<void>(
            `${this.apiUrl}/${id}`
        );
    }
}
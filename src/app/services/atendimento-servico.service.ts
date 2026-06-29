import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
    AtendimentoServico,
    AtendimentoServicoRequest
} from '../models/atendimento-servico';

@Injectable({
    providedIn: 'root'
})
export class AtendimentoServicoService {

    private readonly apiUrl =
        'http://localhost:8080/atendimento-servicos';

    private readonly http = inject(HttpClient);

    listar(): Observable<AtendimentoServico[]> {
        return this.http.get<AtendimentoServico[]>(
            this.apiUrl
        );
    }

    listarPorAtendimento(
        idAtendimento: number
    ): Observable<AtendimentoServico[]> {
        return this.http.get<AtendimentoServico[]>(
            `${this.apiUrl}/atendimento/${idAtendimento}`
        );
    }

    buscarPorId(
        id: number
    ): Observable<AtendimentoServico> {
        return this.http.get<AtendimentoServico>(
            `${this.apiUrl}/${id}`
        );
    }

    inserir(
        item: AtendimentoServicoRequest
    ): Observable<AtendimentoServico> {
        return this.http.post<AtendimentoServico>(
            this.apiUrl,
            item
        );
    }

    excluir(id: number): Observable<void> {
        return this.http.delete<void>(
            `${this.apiUrl}/${id}`
        );
    }
}
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
    Diagnostico,
    DiagnosticoRequest
} from '../models/diagnostico';

@Injectable({
    providedIn: 'root'
})
export class DiagnosticoService {

    private readonly apiUrl =
        'http://localhost:8080/diagnosticos';

    private readonly http = inject(HttpClient);

    inserir(
        diagnostico: DiagnosticoRequest
    ): Observable<Diagnostico> {

        return this.http.post<Diagnostico>(
            this.apiUrl,
            diagnostico
        );
    }

    alterar(
        id: number,
        diagnostico: DiagnosticoRequest
    ): Observable<Diagnostico> {

        return this.http.put<Diagnostico>(
            `${this.apiUrl}/${id}`,
            diagnostico
        );
    }

    buscarPorId(
        id: number
    ): Observable<Diagnostico> {

        return this.http.get<Diagnostico>(
            `${this.apiUrl}/${id}`
        );
    }

    buscarPorAtendimento(
        idAtendimento: number
    ): Observable<Diagnostico> {

        return this.http.get<Diagnostico>(
            `${this.apiUrl}/atendimento/${idAtendimento}`
        );
    }
}
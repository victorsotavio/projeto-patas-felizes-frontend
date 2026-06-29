import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Servico } from '../models/servico';

@Injectable({
    providedIn: 'root'
})
export class ServicoService {

    private readonly apiUrl =
        'http://localhost:8080/servicos';

    private readonly http = inject(HttpClient);

    listar(): Observable<Servico[]> {
        return this.http.get<Servico[]>(this.apiUrl);
    }

    buscarPorId(id: number): Observable<Servico> {
        return this.http.get<Servico>(
            `${this.apiUrl}/${id}`
        );
    }
}
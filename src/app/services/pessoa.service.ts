import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Pessoa } from '../models/pessoa';

@Injectable({
    providedIn: 'root'
})
export class PessoaService {

    private readonly apiUrl = 'http://localhost:8080/pessoas';

    private readonly http = inject(HttpClient);

    listar(): Observable<Pessoa[]> {
        return this.http.get<Pessoa[]>(this.apiUrl);
    }

    listarClientes(): Observable<Pessoa[]> {
        return this.http.get<Pessoa[]>(
            `${this.apiUrl}/clientes`
        );
    }

    buscarPorId(id: number): Observable<Pessoa> {
        return this.http.get<Pessoa>(`${this.apiUrl}/${id}`);
    }

    inserir(pessoa: Pessoa): Observable<Pessoa> {
        return this.http.post<Pessoa>(this.apiUrl, pessoa);
    }

    alterar(id: number, pessoa: Pessoa): Observable<Pessoa> {
        return this.http.put<Pessoa>(
            `${this.apiUrl}/${id}`,
            pessoa
        );
    }

    excluir(id: number): Observable<void> {
        return this.http.delete<void>(
            `${this.apiUrl}/${id}`
        );
    }
}
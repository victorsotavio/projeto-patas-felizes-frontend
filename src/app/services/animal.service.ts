import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
    Animal,
    AnimalRequest
} from '../models/animal';

@Injectable({
    providedIn: 'root'
})
export class AnimalService {

    private readonly apiUrl = 'http://localhost:8080/animais';

    private readonly http = inject(HttpClient);

    listar(): Observable<Animal[]> {
        return this.http.get<Animal[]>(this.apiUrl);
    }

    listarPorIdPessoaDono(
        idPessoaDono: number
    ): Observable<Animal[]> {
        return this.http.get<Animal[]>(
            `${this.apiUrl}/pessoa/${idPessoaDono}`
        );
    }

    buscarPorId(id: number): Observable<Animal> {
        return this.http.get<Animal>(
            `${this.apiUrl}/${id}`
        );
    }

    inserir(animal: AnimalRequest): Observable<Animal> {
        return this.http.post<Animal>(
            this.apiUrl,
            animal
        );
    }

    alterar(
        id: number,
        animal: AnimalRequest
    ): Observable<Animal> {
        return this.http.put<Animal>(
            `${this.apiUrl}/${id}`,
            animal
        );
    }

    excluir(id: number): Observable<void> {
        return this.http.delete<void>(
            `${this.apiUrl}/${id}`
        );
    }
}
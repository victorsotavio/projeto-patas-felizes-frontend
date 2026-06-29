import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Credencial } from '../models/credencial';
import { Autenticacao } from '../models/autenticacao';

@Injectable({
  providedIn: 'root',
})
export class AutenticacaoService {
  
private readonly apiUrl = 'http://localhost:8080/login';

  constructor(private http: HttpClient) { }

  login(credencial: Credencial): Observable<Autenticacao> {
    return this.http.post<Autenticacao>(this.apiUrl, credencial);
  }

  salvarUsuario(usuario: Autenticacao): void {
    localStorage.setItem('sgr-autenticacao', JSON.stringify(usuario));
  }

  getAutenticacao(): Autenticacao | null {
    const dados = localStorage.getItem('sgr-autenticacao');

    if (!dados) {
      return null;
    }

    return JSON.parse(dados);
  }

  sair(): void {
    localStorage.removeItem('sgr-autenticacao');
  }

  estaAutenticado(): boolean {
    return this.getAutenticacao() !== null;
  }
}

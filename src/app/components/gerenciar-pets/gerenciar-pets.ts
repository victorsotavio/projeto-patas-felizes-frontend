import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Crudgenerico, CrudColuna } from '../crudgenerico/crudgenerico'; // Ajuste o caminho
import { Modalgenerico } from '../modalgenerico/modalgenerico'; // Ajuste o caminho

@Component({
  selector: 'app-gerenciar-pets',
  standalone: true,
  imports: [CommonModule, FormsModule, Crudgenerico, Modalgenerico],
  templateUrl: './gerenciar-pets.html'
})
export class GerenciarPetsComponent {
  // Configuração das colunas para a tabela
  colunasPet: CrudColuna[] = [
    { chave: 'id', titulo: 'Código 🐾' },
    { chave: 'nome', titulo: 'Nome do Pet' },
    { chave: 'especie', titulo: 'Espécie' }
  ];

  // Povoamento simulado de dados
  listaDePets = [
    { id: 1, nome: 'Thor', especie: 'Cachorro' },
    { id: 2, nome: 'Mel', especie: 'Gato' },
    { id: 3, nome: 'Pipoca', especie: 'Calopsita' },
    { id: 4, nome: 'Pipoca', especie: 'Calopsita' },
    { id: 5, nome: 'Pipoca', especie: 'Calopsita' },
    { id: 6, nome: 'Thor', especie: 'Cachorro' },
    { id: 7, nome: 'Mel', especie: 'Gato' },
    { id: 8, nome: 'Pipoca', especie: 'Calopsita' },
    { id: 9, nome: 'Pacoca', especie: 'Calopsita' },
    { id: 10, nome: 'Jururu', especie: 'Calopsita' }

  ];

  // Objetos para bindar nos inputs dos modais
  petCadastrar = { nome: '', especie: '' };
  petEditar: any = {};
  petExcluir: any = {};

  cadastrar() {
    this.listaDePets.push({ id: this.listaDePets.length + 1, ...this.petCadastrar });
    this.petCadastrar = { nome: '', especie: '' }; // Limpa form
  }

  salvarEdicao() {
    const index = this.listaDePets.findIndex(p => p.id === this.petEditar.id);
    if (index !== -1) this.listaDePets[index] = { ...this.petEditar };
  }

  deletar() {
    this.listaDePets = this.listaDePets.filter(p => p.id !== this.petExcluir.id);
  }
}
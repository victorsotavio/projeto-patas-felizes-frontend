import { Component, Input, Output, EventEmitter, TemplateRef } from '@angular/core'; // Adicionado TemplateRef
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface CrudColuna {
  chave: string;
  titulo: string;
}

@Component({
  selector: 'app-crudgenerico',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crudgenerico.html',
  styleUrls: ['./crudgenerico.css']
})
export class Crudgenerico {
  @Input() tituloFuncionalidade: string = 'Funcionalidade';
  @Input() tituloModalCadastrar: string = 'Cadastrar Novo';
  @Input() textoBotaoNovo: string = 'Adicionar';

  @Input() colunas: CrudColuna[] = [];
  @Input() dados: any[] = [];

  // === NOVO: Inputs para receber os templates dos botões de fora ===
  @Input() templateEditar!: TemplateRef<any>;
  @Input() templateDeletar!: TemplateRef<any>;

  @Output() aoSalvar = new EventEmitter<void>();
  @Output() aoEditar = new EventEmitter<any>();
  @Output() aoDeletar = new EventEmitter<any>();

  entriesPerPage: number = 5;
  currentPage: number = 1;
  searchTerm: string = '';

  get filteredDados() {
    if (!this.searchTerm) return this.dados;
    return this.dados.filter(item => 
      Object.values(item).some(val => 
        String(val).toLowerCase().includes(this.searchTerm.toLowerCase())
      )
    );
  }

  get paginatedDados() {
    const start = (this.currentPage - 1) * this.entriesPerPage;
    return this.filteredDados.slice(start, start + this.entriesPerPage);
  }

  get totalPages() {
    return Math.ceil(this.filteredDados.length / this.entriesPerPage);
  }

  onEdit(item: any) { this.aoEditar.emit(item); }
  onDelete(id: any) { this.aoDeletar.emit(id); }
  salvar() { this.aoSalvar.emit(); }
}
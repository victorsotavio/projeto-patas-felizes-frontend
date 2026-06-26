import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modalgenerico',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modalgenerico.html',
  styleUrls: ['./modalgenerico.css'] // Ajuste o caminho do CSS se necessário
})
export class Modalgenerico {
  // Configurações que o componente vai receber de fora
  @Input() titulo: string = 'Título Padrão';
  @Input() textoSalvar: string = 'Salvar';
  @Input() textoBotaoAbrir: string = 'Abrir';
  @Input() classeBotaoAbrir: string = 'btn-primary'; // Ex: btn-success, btn-danger, etc.

  // Evento para avisar o componente pai que o botão de salvar foi clicado
  @Output() aoSalvar = new EventEmitter<void>();

  isModalOpen = false;

  abrirModal() {
    this.isModalOpen = true;
  }

  fecharModal() {
    this.isModalOpen = false;
  }

  salvar() {
    this.aoSalvar.emit(); // Dispara o evento para o pai
    this.fecharModal();   // Fecha o modal automaticamente após salvar
  }
}
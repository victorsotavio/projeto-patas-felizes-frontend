import {
  Component,
  inject,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import {
  Crudgenerico,
  CrudColuna
} from '../crudgenerico/crudgenerico';

import { Modalgenerico } from '../modalgenerico/modalgenerico';

import {
  Animal,
  AnimalRequest
} from '../../models/animal';

import { Pessoa } from '../../models/pessoa';

import { AnimalService } from '../../services/animal.service';
import { PessoaService } from '../../services/pessoa.service';

interface AnimalTabela extends Animal {
  nomeDono: string;
}

@Component({
  selector: 'app-gerenciar-pets',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Crudgenerico,
    Modalgenerico
  ],
  templateUrl: './gerenciar-pets.html',
  styleUrl: './gerenciar-pets.css'
})
export class GerenciarPetsComponent implements OnInit {

  private readonly animalService = inject(AnimalService);
  private readonly pessoaService = inject(PessoaService);

  colunasPet: CrudColuna[] = [
    {
      chave: 'id',
      titulo: 'Código'
    },
    {
      chave: 'nome',
      titulo: 'Nome do animal'
    },
    {
      chave: 'nomeDono',
      titulo: 'Dono'
    }
  ];

  listaDePets: AnimalTabela[] = [];

  listaDeClientes: Pessoa[] = [];

  petCadastrar: AnimalRequest = {
    nome: '',
    idPessoaDono: 0
  };

  petEditar: Animal = {
    id: 0,
    nome: '',
    idPessoaDono: 0
  };

  petExcluir: AnimalTabela | null = null;

  carregando: boolean = false;
  mensagemErro: string = '';
  mensagemSucesso: string = '';

  ngOnInit(): void {
    this.carregarClientes();
  }

  carregarClientes(): void {
    this.carregando = true;
    this.mensagemErro = '';

    this.pessoaService.listarClientes().subscribe({
      next: (clientes: Pessoa[]) => {
        this.listaDeClientes = clientes;
        this.carregarPets();
      },

      error: (erro: HttpErrorResponse) => {
        console.error('Erro ao carregar clientes:', erro);

        this.mensagemErro = this.obterMensagemErro(
          erro,
          'Não foi possível carregar os donos.'
        );

        this.carregando = false;
      }
    });
  }

  carregarPets(): void {
    this.mensagemErro = '';

    this.animalService.listar().subscribe({
      next: (animais: Animal[]) => {
        this.listaDePets = animais.map((animal) => {
          const dono = this.listaDeClientes.find(
            cliente => cliente.id === animal.idPessoaDono
          );

          return {
            ...animal,
            nomeDono:
              dono?.nome ?? `ID ${animal.idPessoaDono}`
          };
        });

        this.carregando = false;
      },

      error: (erro: HttpErrorResponse) => {
        console.error('Erro ao carregar animais:', erro);

        this.mensagemErro = this.obterMensagemErro(
          erro,
          'Não foi possível carregar os animais.'
        );

        this.carregando = false;
      }
    });
  }

  cadastrar(): void {
    this.mensagemErro = '';
    this.mensagemSucesso = '';

    if (!this.petCadastrar.nome.trim()) {
      this.mensagemErro =
        'Informe o nome do animal.';
      return;
    }

    if (this.petCadastrar.idPessoaDono <= 0) {
      this.mensagemErro =
        'Selecione o dono do animal.';
      return;
    }

    const novoAnimal: AnimalRequest = {
      nome: this.petCadastrar.nome.trim(),
      idPessoaDono: this.petCadastrar.idPessoaDono
    };

    this.animalService.inserir(novoAnimal).subscribe({
      next: () => {
        this.mensagemSucesso =
          'Animal cadastrado com sucesso.';

        this.limparFormularioCadastro();
        this.carregarPets();
      },

      error: (erro: HttpErrorResponse) => {
        console.error('Erro ao cadastrar animal:', erro);

        this.mensagemErro = this.obterMensagemErro(
          erro,
          'Não foi possível cadastrar o animal.'
        );
      }
    });
  }

  prepararEdicao(pet: AnimalTabela): void {
    this.mensagemErro = '';
    this.mensagemSucesso = '';

    this.petEditar = {
      id: pet.id,
      nome: pet.nome,
      idPessoaDono: pet.idPessoaDono
    };
  }

  salvarEdicao(): void {
    this.mensagemErro = '';
    this.mensagemSucesso = '';

    if (this.petEditar.id <= 0) {
      this.mensagemErro =
        'Não foi possível identificar o animal.';
      return;
    }

    if (!this.petEditar.nome.trim()) {
      this.mensagemErro =
        'Informe o nome do animal.';
      return;
    }

    if (this.petEditar.idPessoaDono <= 0) {
      this.mensagemErro =
        'Selecione o dono do animal.';
      return;
    }

    const animalAlterado: AnimalRequest = {
      nome: this.petEditar.nome.trim(),
      idPessoaDono: this.petEditar.idPessoaDono
    };

    this.animalService
      .alterar(this.petEditar.id, animalAlterado)
      .subscribe({
        next: () => {
          this.mensagemSucesso =
            'Animal alterado com sucesso.';

          this.carregarPets();
        },

        error: (erro: HttpErrorResponse) => {
          console.error('Erro ao alterar animal:', erro);

          this.mensagemErro = this.obterMensagemErro(
            erro,
            'Não foi possível alterar o animal.'
          );
        }
      });
  }

  prepararExclusao(pet: AnimalTabela): void {
    this.mensagemErro = '';
    this.mensagemSucesso = '';

    this.petExcluir = pet;
  }

  deletar(): void {
    if (!this.petExcluir) {
      this.mensagemErro =
        'Não foi possível identificar o animal.';
      return;
    }

    const idAnimal = this.petExcluir.id;

    this.mensagemErro = '';
    this.mensagemSucesso = '';

    this.animalService.excluir(idAnimal).subscribe({
      next: () => {
        this.mensagemSucesso =
          'Animal excluído com sucesso.';

        this.petExcluir = null;
        this.carregarPets();
      },

      error: (erro: HttpErrorResponse) => {
        console.error('Erro ao excluir animal:', erro);

        this.mensagemErro = this.obterMensagemErro(
          erro,
          'Não foi possível excluir o animal.'
        );
      }
    });
  }

  private limparFormularioCadastro(): void {
    this.petCadastrar = {
      nome: '',
      idPessoaDono: 0
    };
  }

  private obterMensagemErro(
    erro: HttpErrorResponse,
    mensagemPadrao: string
  ): string {

    if (typeof erro.error === 'string' && erro.error) {
      return erro.error;
    }

    if (erro.error?.message) {
      return erro.error.message;
    }

    if (erro.error?.mensagem) {
      return erro.error.mensagem;
    }

    if (erro.error?.error) {
      return erro.error.error;
    }

    return mensagemPadrao;
  }
}
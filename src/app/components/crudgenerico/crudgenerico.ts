import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  course: string;
}

@Component({
  selector: 'app-crudgenerico',
///  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crudgenerico.html',
  styleUrl: './crudgenerico.css',
})
export class Crudgenerico implements OnInit {
  // Lista original de dados (simulando banco de dados)
  students: Student[] = [
    { id: 1, firstName: 'Funda Of', lastName: 'Web IT', email: 'fundaofwebit@gmail.com', phone: '8889998887', course: 'BCA' },
    { id: 2, firstName: 'User', lastName: 'Bro', email: 'user1@gmail.com', phone: '4567893214', course: 'BCOM' },
    { id: 3, firstName: 'kushbhu', lastName: 'N', email: 'kush@g.c', phone: '8888888888', course: 'BCOM' },
    { id: 4, firstName: 'kkkkkll', lastName: '||||||||', email: 'kkk@gmail.com', phone: '6666666666', course: 'BCA' }
  ];

  searchTerm: string = '';
  entriesPerPage: number = 10;
  currentPage: number = 1;

  ngOnInit(): void {}

  // Filtra os dados com base no termo de busca
  get filteredStudents(): Student[] {
    return this.students.filter(student => 
      student.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      student.course.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  // Retorna apenas os registros da página atual
  get paginatedStudents(): Student[] {
    const startIndex = (this.currentPage - 1) * this.entriesPerPage;
    return this.filteredStudents.slice(startIndex, startIndex + Number(this.entriesPerPage));
  }

  // Total de páginas necessárias
  get totalPages(): number {
    return Math.ceil(this.filteredStudents.length / this.entriesPerPage) || 1;
  }

  // Métodos do CRUD (Ações dos botões)
  onAdd() {
    console.log('Abrir modal/tela de Adicionar');
  }

  onEdit(student: Student) {
    console.log('Editar estudante:', student);
  }

  onDelete(id: number) {
    if(confirm('Tem certeza que deseja deletar este registro?')) {
      this.students = this.students.filter(s => s.id !== id);
    }
  }
}

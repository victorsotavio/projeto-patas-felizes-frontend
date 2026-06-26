import { Modalgenerico } from './components/modalgenerico/modalgenerico';
import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Sec } from './components/sec/sec';
import { Homegenerica } from './components/homegenerica/homegenerica';
import { Crudgenerico } from './components/crudgenerico/crudgenerico';
import { GerenciarPetsComponent } from './components/gerenciar-pets/gerenciar-pets';

export const routes: Routes = [
  {
    path: '',
    component: Login
  },
  {
    path: 'vet',
    component: Homegenerica,
    children: [
      {
        path: 'adicionarservico',
        component: GerenciarPetsComponent
      }
    ]
  },
  {
    path: 'sec',
    component: GerenciarPetsComponent
  },
  {
    path: 'modal',
    component: Modalgenerico
  }
];
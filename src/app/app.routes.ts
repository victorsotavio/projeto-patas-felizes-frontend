import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Sec } from './components/sec/sec';
import { Homegenerica } from './components/homegenerica/homegenerica';
import { Crudgenerico } from './components/crudgenerico/crudgenerico';

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
        component: Homegenerica // Componente FILHO 1 (Acessado via /vet/adicionarservico)
      }
    ]
  },
  {
    path: 'sec',
    component: Crudgenerico
  }
];
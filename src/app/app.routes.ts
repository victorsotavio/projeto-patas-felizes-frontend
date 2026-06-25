import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Vet } from './components/vet/vet';
import { Sec } from './components/sec/sec';

export const routes: Routes = [
  {
    path: '',
    component: Login
  },
  {
    path: 'vet',
    component: Vet,
    children: [
      {
        path: 'adicionarservico',
        component: AdicionarServico // Componente FILHO 1 (Acessado via /vet/adicionarservico)
      }
    ]
  },
  {
    path: 'sec',
    component: Sec,
  }
];
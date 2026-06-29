import { Routes } from '@angular/router';

import { Login } from './components/login/login';
import { Sec } from './components/sec/sec';
import { Vet } from './components/vet/vet';
import { Homegenerica } from './components/homegenerica/homegenerica';
import { Crudgenerico } from './components/crudgenerico/crudgenerico';
import { GerenciarPetsComponent } from './components/gerenciar-pets/gerenciar-pets';
import { Modalgenerico } from './components/modalgenerico/modalgenerico';
import {GerenciarClientesComponent} from './components/gerenciar-clientes/gerenciar-clientes';
import {GerenciarAtendimentosComponent} from './components/gerenciar-atendimentos/gerenciar-atendimentos';
import { authGuard } from './guards/auth-guard';
import {perfilGuard} from './guards/perfil-guard';

export const routes: Routes = [
  {
    path: '',
    component: Login
  },

  {
    path: 'sec',
    component: Sec,
    canActivate: [authGuard, perfilGuard],
    data: {
      perfisPermitidos: ['SECRETARIA']
    },
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        component: Homegenerica
      },
      {
        path: 'clientes',
        component: GerenciarClientesComponent
      },
      {
        path: 'animais',
        component: GerenciarPetsComponent
      },
      {
        path: 'atendimentos',
        component: GerenciarAtendimentosComponent,
        data: {
          perfil: 'SECRETARIA'
        }
      }
    ]
  },

  {
    path: 'vet',
    component: Vet,
    canActivate: [authGuard, perfilGuard],
    data:{
      perfisPermitidos: ['VETERINARIO']
    },
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        component: Homegenerica
      },
      {
        path: 'atendimentos',
        component: GerenciarAtendimentosComponent,
        data: {
          perfil: 'VETERINARIO'
        }
      }
    ]
  },

  {
    path: 'modal',
    component: Modalgenerico
  },

  {
    path: '**',
    redirectTo: ''
  }
];
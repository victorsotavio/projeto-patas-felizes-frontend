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

export const routes: Routes = [
  {
    path: '',
    component: Login
  },

  {
    path: 'sec',
    component: Sec,
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
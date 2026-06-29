import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AutenticacaoService } from '../services/autenticacao.service';

export const perfilGuard: CanActivateFn = (route) => {
    const router = inject(Router);
    const autenticacaoService = inject(AutenticacaoService);

    const autenticacao = autenticacaoService.getAutenticacao();

    if (!autenticacao) {
        return router.createUrlTree(['/']);
    }

    const perfisPermitidos =
        route.data['perfisPermitidos'] as string[] | undefined;

    if (
        perfisPermitidos &&
        perfisPermitidos.includes(autenticacao.perfil)
    ) {
        return true;
    }

    if (autenticacao.perfil === 'SECRETARIA') {
        return router.createUrlTree(['/sec/home']);
    }

    if (autenticacao.perfil === 'VETERINARIO') {
        return router.createUrlTree(['/vet/home']);
    }

    return router.createUrlTree(['/']);
};
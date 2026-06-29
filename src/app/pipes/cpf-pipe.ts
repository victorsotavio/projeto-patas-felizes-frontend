import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'cpf',
    standalone: true
})
export class CpfPipe implements PipeTransform {

    transform(cpf: string | null | undefined): string {
        if (!cpf) {
            return '';
        }

        const apenasNumeros = cpf.replace(/\D/g, '');

        if (apenasNumeros.length !== 11) {
            return cpf;
        }

        return apenasNumeros.replace(
            /^(\d{3})(\d{3})(\d{3})(\d{2})$/,
            '$1.$2.$3-$4'
        );
    }
}
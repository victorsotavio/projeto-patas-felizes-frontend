import { CpfPipe } from './cpf-pipe';

describe('CpfPipe', () => {
    let pipe: CpfPipe;

    beforeEach(() => {
        pipe = new CpfPipe();
    });

    it('deve criar o pipe', () => {
        expect(pipe).toBeTruthy();
    });

    it('deve formatar um CPF com 11 números', () => {
        expect(pipe.transform('33333333333'))
            .toBe('333.333.333-33');
    });

    it('deve aceitar CPF já formatado', () => {
        expect(pipe.transform('333.333.333-33'))
            .toBe('333.333.333-33');
    });

    it('deve retornar vazio quando não houver CPF', () => {
        expect(pipe.transform('')).toBe('');
    });
});
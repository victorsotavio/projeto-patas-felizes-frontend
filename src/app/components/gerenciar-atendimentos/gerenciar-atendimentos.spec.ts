import {
    ComponentFixture,
    TestBed
} from '@angular/core/testing';

import { provideRouter } from '@angular/router';

import {
    GerenciarAtendimentosComponent
} from './gerenciar-atendimentos';

describe('GerenciarAtendimentosComponent', () => {

    let component: GerenciarAtendimentosComponent;
    let fixture:
        ComponentFixture<GerenciarAtendimentosComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                GerenciarAtendimentosComponent
            ],
            providers: [
                provideRouter([])
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(
            GerenciarAtendimentosComponent
        );

        component = fixture.componentInstance;

        await fixture.whenStable();
    });

    it('deve criar o componente', () => {
        expect(component).toBeTruthy();
    });
});
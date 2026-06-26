import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciarClientesComponent } from './gerenciar-clientes';

describe('GerenciarClientesComponent', () => {
    let component: GerenciarClientesComponent;
    let fixture: ComponentFixture<GerenciarClientesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [GerenciarClientesComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(GerenciarClientesComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('deve criar o componente', () => {
        expect(component).toBeTruthy();
    });
});
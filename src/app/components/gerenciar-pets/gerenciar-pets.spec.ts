import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciarPets } from './gerenciar-pets';

describe('GerenciarPets', () => {
  let component: GerenciarPets;
  let fixture: ComponentFixture<GerenciarPets>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenciarPets]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GerenciarPets);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

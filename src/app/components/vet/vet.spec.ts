import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Vet } from './vet';

describe('Vet', () => {
  let component: Vet;
  let fixture: ComponentFixture<Vet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Vet]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Vet);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

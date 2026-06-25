import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Homegenerica } from './homegenerica';

describe('Homegenerica', () => {
  let component: Homegenerica;
  let fixture: ComponentFixture<Homegenerica>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Homegenerica]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Homegenerica);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

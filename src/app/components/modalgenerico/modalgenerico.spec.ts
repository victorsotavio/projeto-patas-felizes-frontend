import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Modalgenerico } from './modalgenerico';

describe('Modalgenerico', () => {
  let component: Modalgenerico;
  let fixture: ComponentFixture<Modalgenerico>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Modalgenerico]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Modalgenerico);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

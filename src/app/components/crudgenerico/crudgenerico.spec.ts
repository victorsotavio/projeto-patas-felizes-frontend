import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Crudgenerico } from './crudgenerico';

describe('Crudgenerico', () => {
  let component: Crudgenerico;
  let fixture: ComponentFixture<Crudgenerico>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Crudgenerico]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Crudgenerico);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

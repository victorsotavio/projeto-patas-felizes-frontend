import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sec } from './sec';

describe('Sec', () => {
  let component: Sec;
  let fixture: ComponentFixture<Sec>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sec]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Sec);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

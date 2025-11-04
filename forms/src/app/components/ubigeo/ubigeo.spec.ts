import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ubigeo } from './ubigeo';

describe('Ubigeo', () => {
  let component: Ubigeo;
  let fixture: ComponentFixture<Ubigeo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ubigeo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Ubigeo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

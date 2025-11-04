import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherPage } from './other-page';

describe('OtherPage', () => {
  let component: OtherPage;
  let fixture: ComponentFixture<OtherPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtherPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtherPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

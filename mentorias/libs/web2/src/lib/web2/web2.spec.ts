import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Web2 } from './web2';

describe('Web2', () => {
  let component: Web2;
  let fixture: ComponentFixture<Web2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Web2],
    }).compileComponents();

    fixture = TestBed.createComponent(Web2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

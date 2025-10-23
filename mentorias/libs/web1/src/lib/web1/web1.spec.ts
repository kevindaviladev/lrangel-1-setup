import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Web1 } from './web1';

describe('Web1', () => {
  let component: Web1;
  let fixture: ComponentFixture<Web1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Web1],
    }).compileComponents();

    fixture = TestBed.createComponent(Web1);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

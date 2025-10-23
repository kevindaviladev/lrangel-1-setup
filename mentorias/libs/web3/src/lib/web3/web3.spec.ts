import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Web3 } from './web3';

describe('Web3', () => {
  let component: Web3;
  let fixture: ComponentFixture<Web3>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Web3],
    }).compileComponents();

    fixture = TestBed.createComponent(Web3);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

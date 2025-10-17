import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Card } from './card';

// Test host component to test content projection
@Component({
  selector: 'lib-test-host',
  template: '<lib-card>Hello</lib-card>',
  imports: [Card]
})
class TestHostComponent {}

describe('Card Component', () => {
  let component: Card;
  let fixture: ComponentFixture<Card>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Card]
    }).compileComponents();

    fixture = TestBed.createComponent(Card);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render with proper styles', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.tagName.toLowerCase()).toBe('div');
  });

  it('should render projected content', async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent]
    }).compileComponents();

    const hostFixture = TestBed.createComponent(TestHostComponent);
    hostFixture.detectChanges();
    
    const compiled = hostFixture.nativeElement as HTMLElement;

    const cardContent = compiled.querySelector('.card-content');
    
    expect(cardContent).toBeTruthy();
    expect(cardContent?.textContent?.trim()).toBe('Hello');
  });
});

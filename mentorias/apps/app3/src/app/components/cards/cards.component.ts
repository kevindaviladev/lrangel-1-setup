import { Component, inject } from '@angular/core';
import { CardStore } from '../../store/cards.content';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-cards',
  standalone: true,
  imports: [JsonPipe],
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.scss'
})
export class CardsComponent {
  readonly store = inject(CardStore);

  ngOnInit(){
    this.loadCards();
  }

  loadCards(){
    this.store.loadPages(0);
  }

}

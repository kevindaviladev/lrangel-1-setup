import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Card } from '../store/cards.content';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CardsService {
  private http = inject(HttpClient);

  loadCards(page = 0) {
    return this.http.get<{data: Card[]}>(
      `https://db.ygoprodeck.com/api/v7/cardinfo.php?num=200&offset=${page * 5}`,
    ).pipe(map((response) => response.data))
  }

  filterCards() {

  }
}

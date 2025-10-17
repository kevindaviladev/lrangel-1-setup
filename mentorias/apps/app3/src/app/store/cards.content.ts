import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop'
import { CardsService } from '../services/cards.service';
import { pipe, switchMap, tap } from 'rxjs';

export interface Card {
  id: string;
  name: string;
  type: string;
}

interface CardState {
  cards: Card[];
  state: 'Loading' | 'Loaded' | 'Error';
  filter: { query: string; page: number };
}

const initialState: CardState = {
  cards: [],
  state: 'Loading',
  filter: { query: '', page: 1 },
};

export const CardStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ cards }) => ({
    cardsCount: computed(() => cards().length),
    spellCards: computed(() =>
      cards().filter((card) => card.type === 'Spell Card').length,
    ),
  })),
  withMethods((store, cardsService = inject(CardsService)) => ({
    updateQuery: (query: string) => {
      patchState(store, (state) => ({ filter: { ...state.filter, query } }));
    },

    loadPages: rxMethod<number>(
        pipe(
            tap(() => patchState(store, {state: 'Loading'})),
            switchMap((page = 0) => {
                return cardsService.loadCards(page).pipe(
                    tap((cards) => {
                        patchState(store, {cards, state: 'Loaded'});
                    })
                )
            })
        )
    )
  })),
);

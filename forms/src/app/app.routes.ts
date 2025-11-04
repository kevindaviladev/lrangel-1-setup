import { inject } from '@angular/core';
import { ControlContainer } from '@angular/forms';
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'some',
    pathMatch: 'full'
  },
  {
    path: 'person-form',
    loadComponent: () => import('./pages/person-form/person-form.component')
      .then(m => m.PersonFormComponent)
  },
  {
    path: 'some',
    loadComponent: () => import('./pages/some/some')
      .then(m => m.SomeComponent)
  },
  {
    path: 'otra-pagina',
    loadComponent: () => import('./pages/other-page/other-page')
      .then(m => m.OtherPage)
  }
];

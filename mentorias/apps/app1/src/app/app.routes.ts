import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'web1',
    loadComponent: () => import('@mentorias/web1').then((c) => c.Web1),
  },
  {
    path: 'web2',
    loadComponent: () => import('@mentorias/web2').then((c) => c.Web2),
  },
  {
    path: 'web3',
    loadComponent: () => import('@mentorias/web3').then((c) => c.Web3),
  },
  { path: '**', redirectTo: 'web1' },
];

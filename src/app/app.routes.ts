import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full',
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./features/products/product-list/product-list').then((m) => m.ProductListComponent),
    data: { animation: 'ListPage' },
  },
  {
    path: 'products/add',
    loadComponent: () =>
      import('./features/products/product-form/product-form').then((m) => m.ProductFormComponent),
    data: { animation: 'AddPage' },
  },
  {
    path: 'products/edit',
    loadComponent: () =>
      import('./features/products/product-form/product-form').then((m) => m.ProductFormComponent),
    data: { animation: 'EditPage' },
  },
];

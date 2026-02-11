import { Signal } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

export abstract class ProductRepository {
  abstract products: Signal<Product[]>;

  abstract isLoading: Signal<boolean>;

  abstract fetchAll(): Observable<Product[]>;

  abstract create(product: Product): Observable<Product>;

  abstract update(product: Product): Observable<Product>;

  abstract delete(id: string): Observable<void>;

  abstract verifyId(id: string): Observable<boolean>;

  abstract getById(id: string): Observable<Product | undefined>;
}

import { inject, Injectable, signal } from '@angular/core';
import { Observable, of, tap, map } from 'rxjs';
import { ProductRepository } from './product.repository';
import { Product } from '../models/product.model';
import { ProductApiService } from '../data-sources/product-api.service';
import { ProductMapper } from '../mappers/product.mapper';

@Injectable({
  providedIn: 'root',
})
export class ProductSignalRepository extends ProductRepository {
  private api = inject(ProductApiService);

  private _products = signal<Product[]>([]);
  private _isLoading = signal<boolean>(false);

  products = this._products.asReadonly();
  isLoading = this._isLoading.asReadonly();

  fetchAll(): Observable<Product[]> {
    this._isLoading.set(true);
    return this.api.getProducts().pipe(
      map((response) => {
        const data = Array.isArray(response) ? response : (response as any)?.data || [];
        return data.map(ProductMapper.toDomain);
      }),
      tap({
        next: (domainProducts) => {
          this._products.set(domainProducts);
        },
        error: () => this._isLoading.set(false),
        complete: () => this._isLoading.set(false),
      }),
    );
  }

  create(product: Product): Observable<Product> {
    const dto = ProductMapper.toDTO(product);
    return this.api.createProduct(dto).pipe(
      map((response) => {
        const data = (response as any)?.data || response;
        return ProductMapper.toDomain(data);
      }),
      tap((newProduct) => {
        this._products.update((list) => [...list, newProduct]);
      }),
    );
  }

  update(product: Product): Observable<Product> {
    const dto = ProductMapper.toDTO(product);
    return this.api.updateProduct(dto).pipe(
      map((response) => {
        const data = (response as any)?.data || response;
        return ProductMapper.toDomain(data);
      }),
      tap((updatedProduct) => {
        this._products.update((list) =>
          list.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)),
        );
      }),
    );
  }

  delete(id: string): Observable<void> {
    return this.api.deleteProduct(id).pipe(
      tap(() => {
        this._products.update((list) => list.filter((p) => p.id !== id));
      }),
    );
  }

  verifyId(id: string): Observable<boolean> {
    return this.api.verifyId(id);
  }

  getById(id: string): Observable<Product | undefined> {
    const existing = this._products().find((p) => p.id === id);
    return of(existing);
  }
}

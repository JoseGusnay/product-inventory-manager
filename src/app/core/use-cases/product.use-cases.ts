import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ProductRepository } from '../repositories/product.repository';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class GetProductsUseCase {
  private repo = inject(ProductRepository);

  execute(): Observable<Product[]> {
    if (this.repo.products().length > 0) {
      return of(this.repo.products());
    }
    return this.repo.fetchAll();
  }
}

@Injectable({ providedIn: 'root' })
export class CreateProductUseCase {
  private repo = inject(ProductRepository);

  execute(product: Product): Observable<Product> {
    return this.repo.create(product);
  }
}

@Injectable({ providedIn: 'root' })
export class UpdateProductUseCase {
  private repo = inject(ProductRepository);

  execute(product: Product): Observable<Product> {
    return this.repo.update(product);
  }
}

@Injectable({ providedIn: 'root' })
export class DeleteProductUseCase {
  private repo = inject(ProductRepository);

  execute(id: string): Observable<void> {
    return this.repo.delete(id);
  }
}

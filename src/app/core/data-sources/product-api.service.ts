import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductDTO } from '../models/product.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductApiService {
  private http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  getProducts(): Observable<ProductDTO[]> {
    return this.http.get<ProductDTO[]>(this.baseUrl);
  }

  createProduct(product: ProductDTO): Observable<ProductDTO> {
    return this.http.post<ProductDTO>(this.baseUrl, product);
  }

  updateProduct(product: ProductDTO): Observable<ProductDTO> {
    return this.http.put<ProductDTO>(`${this.baseUrl}/${product.id}`, product);
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  verifyId(id: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/verification/${id}`);
  }
}

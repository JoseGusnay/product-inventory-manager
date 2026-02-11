import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductApiService } from './product-api.service';
import { ProductDTO } from '../models/product.model';

describe('ProductApiService', () => {
  let service: ProductApiService;
  let httpMock: HttpTestingController;

  const mockProducts: ProductDTO[] = [
    {
      id: '1',
      name: 'P1',
      description: 'D1',
      logo: 'L1',
      date_release: '2025-01-01',
      date_revision: '2026-01-01',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductApiService],
    });
    service = TestBed.inject(ProductApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch products (getProducts)', () => {
    service.getProducts().subscribe((products) => {
      expect(products.length).toBe(1);
      expect(products).toEqual(mockProducts);
    });

    const req = httpMock.expectOne('/bp/products');
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);
  });

  it('should create a product (createProduct)', () => {
    const product = mockProducts[0];
    service.createProduct(product).subscribe((p) => {
      expect(p).toEqual(product);
    });

    const req = httpMock.expectOne('/bp/products');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(product);
    req.flush(product);
  });

  it('should update a product (updateProduct)', () => {
    const product = mockProducts[0];
    service.updateProduct(product).subscribe((p) => {
      expect(p).toEqual(product);
    });

    const req = httpMock.expectOne(`/bp/products/${product.id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(product);
    req.flush(product);
  });

  it('should delete a product (deleteProduct)', () => {
    const id = '123';
    service.deleteProduct(id).subscribe((response) => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne(`/bp/products/${id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should verify product ID (verifyId)', () => {
    const id = '123';
    service.verifyId(id).subscribe((exists) => {
      expect(exists).toBe(true);
    });

    const req = httpMock.expectOne(`/bp/products/verification/${id}`);
    expect(req.request.method).toBe('GET');
    req.flush(true);
  });
});

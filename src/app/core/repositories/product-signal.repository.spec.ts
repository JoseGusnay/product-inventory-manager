import { TestBed } from '@angular/core/testing';
import { ProductSignalRepository } from './product-signal.repository';
import { ProductApiService } from '../data-sources/product-api.service';
import { of, delay } from 'rxjs';
import { Product, ProductDTO } from '../models/product.model';

describe('ProductSignalRepository', () => {
  let repository: ProductSignalRepository;
  let apiMock: any;

  const mockDTOs: ProductDTO[] = [
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
    apiMock = {
      getProducts: jest.fn().mockReturnValue(of(mockDTOs)),
      createProduct: jest.fn(),
      updateProduct: jest.fn(),
      deleteProduct: jest.fn(),
      verifyId: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [ProductSignalRepository, { provide: ProductApiService, useValue: apiMock }],
    });
    repository = TestBed.inject(ProductSignalRepository);
  });

  it('should be created', () => {
    expect(repository).toBeTruthy();
  });

  it('should fetch and update products signal (fetchAll)', (done) => {
    apiMock.getProducts.mockReturnValue(of(mockDTOs).pipe(delay(0)));

    repository.fetchAll().subscribe((products) => {
      expect(products.length).toBe(1);
      expect(repository.products().length).toBe(1);
      expect(repository.isLoading()).toBe(false);
      done();
    });

    expect(repository.isLoading()).toBe(true);
    expect(apiMock.getProducts).toHaveBeenCalled();
  });

  it('should handle wrapped API response {data: []} in fetchAll', () => {
    apiMock.getProducts.mockReturnValue(of({ data: mockDTOs }));
    repository.fetchAll().subscribe((products) => {
      expect(products.length).toBe(1);
      expect(repository.products().length).toBe(1);
    });
  });

  it('should create and update products list (create)', () => {
    const productDTO = mockDTOs[0];
    const domainProduct: Product = {
      id: '1',
      name: 'P1',
      description: 'D1',
      logo: 'L1',
      dateRelease: new Date('2025-01-01'),
      dateRevision: new Date('2026-01-01'),
    };

    apiMock.createProduct.mockReturnValue(of(productDTO));

    expect(repository.products().length).toBe(0);

    repository.create(domainProduct).subscribe((newProduct) => {
      expect(repository.products().length).toBe(1);
      expect(repository.products()[0].id).toBe('1');
    });
  });

  it('should update an existing product in signal (update)', () => {
    repository.fetchAll().subscribe();

    const updatedDTO = { ...mockDTOs[0], name: 'Updated Name' };
    apiMock.updateProduct.mockReturnValue(of(updatedDTO));

    const updatedDomain: Product = {
      id: '1',
      name: 'Updated Name',
      description: 'D1',
      logo: 'L1',
      dateRelease: new Date('2025-01-01'),
      dateRevision: new Date('2026-01-01'),
    };

    repository.update(updatedDomain).subscribe(() => {
      expect(repository.products()[0].name).toBe('Updated Name');
    });
  });

  it('should remove product from signal on delete', () => {
    repository.fetchAll().subscribe();
    expect(repository.products().length).toBe(1);

    apiMock.deleteProduct.mockReturnValue(of(undefined));

    repository.delete('1').subscribe(() => {
      expect(repository.products().length).toBe(0);
    });
  });

  it('should call verifyId on api service', () => {
    apiMock.verifyId.mockReturnValue(of(true));
    repository.verifyId('test').subscribe((exists) => {
      expect(exists).toBe(true);
      expect(apiMock.verifyId).toHaveBeenCalledWith('test');
    });
  });

  it('should get product by ID from signal (getById)', () => {
    repository.fetchAll().subscribe();
    repository.getById('1').subscribe((product) => {
      expect(product?.id).toBe('1');
    });
  });
});

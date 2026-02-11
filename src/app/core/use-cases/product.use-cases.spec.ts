import { TestBed } from '@angular/core/testing';
import {
  GetProductsUseCase,
  CreateProductUseCase,
  UpdateProductUseCase,
  DeleteProductUseCase,
} from './product.use-cases';
import { ProductRepository } from '../repositories/product.repository';
import { of } from 'rxjs';
import { signal } from '@angular/core';
import { Product } from '../models/product.model';

describe('Product Use Cases', () => {
  let repoMock: any;

  const mockProduct: Product = {
    id: '1',
    name: 'P1',
    description: 'D1',
    logo: 'L1',
    dateRelease: new Date(),
    dateRevision: new Date(),
  };

  beforeEach(() => {
    repoMock = {
      fetchAll: jest.fn().mockReturnValue(of([mockProduct])),
      create: jest.fn().mockReturnValue(of(mockProduct)),
      update: jest.fn().mockReturnValue(of(mockProduct)),
      delete: jest.fn().mockReturnValue(of(undefined)),
      products: signal([mockProduct]),
      isLoading: signal(false),
    };

    TestBed.configureTestingModule({
      providers: [
        GetProductsUseCase,
        CreateProductUseCase,
        UpdateProductUseCase,
        DeleteProductUseCase,
        { provide: ProductRepository, useValue: repoMock },
      ],
    });
  });

  it('GetProductsUseCase should call repository.fetchAll', () => {
    const useCase = TestBed.inject(GetProductsUseCase);
    useCase.execute().subscribe((products: Product[]) => {
      expect(products).toEqual([mockProduct]);
      expect(repoMock.fetchAll).toHaveBeenCalled();
    });
  });

  it('CreateProductUseCase should call repository.create', () => {
    const useCase = TestBed.inject(CreateProductUseCase);
    useCase.execute(mockProduct).subscribe((product: Product) => {
      expect(product).toEqual(mockProduct);
      expect(repoMock.create).toHaveBeenCalledWith(mockProduct);
    });
  });

  it('UpdateProductUseCase should call repository.update', () => {
    const useCase = TestBed.inject(UpdateProductUseCase);
    useCase.execute(mockProduct).subscribe((product: Product) => {
      expect(product).toEqual(mockProduct);
      expect(repoMock.update).toHaveBeenCalledWith(mockProduct);
    });
  });

  it('DeleteProductUseCase should call repository.delete', () => {
    const useCase = TestBed.inject(DeleteProductUseCase);
    useCase.execute('1').subscribe(() => {
      expect(repoMock.delete).toHaveBeenCalledWith('1');
    });
  });
});

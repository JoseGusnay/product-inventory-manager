import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ProductListComponent } from './product-list';
import { ProductRepository } from '../../../core/repositories/product.repository';
import {
  GetProductsUseCase,
  DeleteProductUseCase,
} from '../../../core/use-cases/product.use-cases';
import { NavigationStateService } from '../../../core/services/navigation-state.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { Product } from '../../../core/models/product.model';
import { TableComponent } from '../../../shared/components/molecules/table/table';
import { ButtonComponent } from '../../../shared/components/atoms/button/button';
import { ModalComponent } from '../../../shared/components/molecules/modal/modal';

@Component({
  selector: 'app-table',
  standalone: true,
  template: '',
})
class MockTableComponent {
  @Input() data: any[] = [];
  @Input() columns: any[] = [];
  @Input() isLoading = false;
  @Output() actionExecuted = new EventEmitter<any>();
}

@Component({
  selector: 'app-button',
  standalone: true,
  template: '',
})
class MockButtonComponent {
  @Input() label = '';
  @Input() variant = '';
}

@Component({
  selector: 'app-modal',
  standalone: true,
  template: '',
})
class MockModalComponent {
  @Input() isOpen = false;
  @Input() isLoading = false;
  @Input() title = '';
  @Input() confirmLabel = '';
  @Output() confirmed = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();
}

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productRepoMock: any;
  let getProductsUCMock: any;
  let deleteProductUCMock: any;
  let navigationStateServiceMock: any;
  let routerMock: any;

  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Product A',
      description: 'Description A',
      logo: 'logo1.png',
      dateRelease: new Date(),
      dateRevision: new Date(),
    },
    {
      id: '2',
      name: 'Product B',
      description: 'Description B',
      logo: 'logo2.png',
      dateRelease: new Date(),
      dateRevision: new Date(),
    },
    {
      id: '3',
      name: 'Product C',
      description: 'Description C',
      logo: 'logo3.png',
      dateRelease: new Date(),
      dateRevision: new Date(),
    },
    {
      id: '4',
      name: 'Product D',
      description: 'Description D',
      logo: 'logo4.png',
      dateRelease: new Date(),
      dateRevision: new Date(),
    },
    {
      id: '5',
      name: 'Product E',
      description: 'Description E',
      logo: 'logo5.png',
      dateRelease: new Date(),
      dateRevision: new Date(),
    },
    {
      id: '6',
      name: 'Product F',
      description: 'Description F',
      logo: 'logo6.png',
      dateRelease: new Date(),
      dateRevision: new Date(),
    },
  ];

  beforeEach(async () => {
    productRepoMock = {
      products: signal(mockProducts),
      isLoading: signal(false),
    };

    getProductsUCMock = {
      execute: jest.fn().mockReturnValue(of(mockProducts)),
    };

    deleteProductUCMock = {
      execute: jest.fn().mockReturnValue(of(undefined)),
    };

    navigationStateServiceMock = {
      setSelectedProductId: jest.fn(),
      clearSelectedProductId: jest.fn(),
    };

    routerMock = {
      navigate: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ProductListComponent],
      providers: [
        { provide: ProductRepository, useValue: productRepoMock },
        { provide: GetProductsUseCase, useValue: getProductsUCMock },
        { provide: DeleteProductUseCase, useValue: deleteProductUCMock },
        { provide: NavigationStateService, useValue: navigationStateServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    })
      .overrideComponent(ProductListComponent, {
        remove: { imports: [TableComponent, ButtonComponent, ModalComponent] },
        add: { imports: [MockTableComponent, MockButtonComponent, MockModalComponent] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and load products on init', () => {
    expect(component).toBeTruthy();
    expect(getProductsUCMock.execute).toHaveBeenCalled();
    expect(component.products().length).toBe(6);
  });

  describe('Search Filter', () => {
    it('should filter products matching search term', () => {
      component.searchTerm.set('Product A');
      const filtered = component.filteredProducts();
      expect(filtered.length).toBe(1);
      expect(filtered[0].name).toBe('Product A');
    });

    it('should filter products matching ID', () => {
      component.searchTerm.set('1');
      const filtered = component.filteredProducts();
      expect(filtered.length).toBe(1);
      expect(filtered[0].id).toBe('1');
    });

    it('should handle products with null/undefined fields in filter', () => {
      const incompleteProduct = { id: null, name: null, description: null } as any;
      productRepoMock.products.set([...mockProducts, incompleteProduct]);

      component.searchTerm.set('search');
      const filtered = component.filteredProducts();
      expect(filtered.find((p) => p.id === null)).toBeUndefined();
    });

    it('should filter products matching ID specifically when name/desc do not match', () => {
      component.searchTerm.set('6');
      const filtered = component.filteredProducts();
      expect(filtered.length).toBe(1);
      expect(filtered[0].id).toBe('6');
    });

    it('should update searchTerm on onSearch event', () => {
      const event = { target: { value: 'new search' } } as any;
      component.onSearch(event);
      expect(component.searchTerm()).toBe('new search');
    });

    it('should update itemsPerPage on change', () => {
      const event = { target: { value: '10' } } as any;
      component.onItemsPerPageChange(event);
      expect(component.itemsPerPage()).toBe(10);
    });
  });

  describe('Actions & Navigation', () => {
    it('should navigate to add page', () => {
      component.onAddProduct();
      expect(navigationStateServiceMock.clearSelectedProductId).toHaveBeenCalled();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/products/add']);
    });

    it('should navigate to edit page on edit action', () => {
      const product = mockProducts[0];
      component.onAction({ label: 'Edit', value: 'edit' }, product);
      expect(navigationStateServiceMock.setSelectedProductId).toHaveBeenCalledWith(product.id);
      expect(routerMock.navigate).toHaveBeenCalledWith(['/products/edit']);
    });

    it('should handle unknown actions in onAction', () => {
      const product = mockProducts[0];
      component.onAction({ label: 'Unknown', value: 'unknown' }, product);
      expect(routerMock.navigate).not.toHaveBeenCalled();
      expect(component.isModalOpen()).toBe(false);
    });

    it('should toggle dropdown open/close', () => {
      component.toggleDropdown('1', true);
      expect(component.openDropdownId()).toBe('1');
      component.toggleDropdown('1', false);
      expect(component.openDropdownId()).toBeNull();
    });
  });

  describe('Delete Flow', () => {
    it('should open modal and set productToDelete on delete action', () => {
      const product = mockProducts[0];
      component.onAction({ label: 'Delete', value: 'delete' }, product);
      expect(component.productToDelete()).toEqual(product);
      expect(component.isModalOpen()).toBe(true);
    });

    it('should not proceed with deletion if no product is selected', () => {
      component.productToDelete.set(null);
      component.confirmDelete();
      expect(component.isDeleting()).toBe(false);
      expect(deleteProductUCMock.execute).not.toHaveBeenCalled();
    });

    it('should return correct delete message', () => {
      const product = mockProducts[0];
      component.productToDelete.set(product);
      expect(component.deleteMessage()).toContain(product.name);

      component.productToDelete.set(null);
      expect(component.deleteMessage()).toBe('');
    });

    it('should call deleteProduct use case on confirmation', fakeAsync(() => {
      const product = mockProducts[0];
      component.productToDelete.set(product);
      component.isModalOpen.set(true);

      deleteProductUCMock.execute.mockReturnValue(of(undefined).pipe(delay(100)));

      component.confirmDelete();

      expect(component.isDeleting()).toBe(true);
      tick(100);

      expect(deleteProductUCMock.execute).toHaveBeenCalledWith(product.id);
      expect(component.isDeleting()).toBe(false);
      expect(component.isModalOpen()).toBe(false);
    }));

    it('should handle delete error', fakeAsync(() => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const product = mockProducts[0];
      component.productToDelete.set(product);

      deleteProductUCMock.execute.mockReturnValue(throwError(() => new Error('Delete failed')));

      component.confirmDelete();

      expect(component.isDeleting()).toBe(false);
      expect(component.isModalOpen()).toBe(false);
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    }));
  });

  it('should initialize columns in ngAfterViewInit', fakeAsync(() => {
    component.columns.set([]);
    component.ngAfterViewInit();
    tick();
    expect(component.columns().length).toBeGreaterThan(0);
    expect(component.columns()[1].field).toBe('name');
  }));
});

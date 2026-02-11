import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ProductFormComponent } from './product-form';
import { ProductRepository } from '../../../core/repositories/product.repository';
import {
  CreateProductUseCase,
  UpdateProductUseCase,
} from '../../../core/use-cases/product.use-cases';
import { NavigationStateService } from '../../../core/services/navigation-state.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, throwError, delay } from 'rxjs';
import { Component, Input, forwardRef } from '@angular/core';
import { NotificationService } from '../../../core/services/notification.service';
import { FormFieldComponent } from '../../../shared/components/molecules/form-field/form-field';
import { ButtonComponent } from '../../../shared/components/atoms/button/button';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-form-field',
  standalone: true,
  template: '',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MockFormFieldComponent),
      multi: true,
    },
  ],
})
class MockFormFieldComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() formControlName = '';
  @Input() errorMessages: any;
  @Input() type = 'text';
  @Input() loading = false;
  writeValue(obj: any): void {}
  registerOnChange(fn: any): void {}
  registerOnTouched(fn: any): void {}
}

@Component({ selector: 'app-button', standalone: true, template: '' })
class MockButtonComponent {
  @Input() label = '';
  @Input() variant = '';
  @Input() type = 'button';
  @Input() loading = false;
  @Input() disabled = false;
}

describe('ProductFormComponent', () => {
  let component: ProductFormComponent;
  let fixture: ComponentFixture<ProductFormComponent>;
  let productRepoMock: any;
  let createProductUCMock: any;
  let updateProductUCMock: any;
  let navigationStateServiceMock: any;
  let routerMock: any;
  let notificationServiceMock: any;

  beforeEach(async () => {
    productRepoMock = {
      verifyId: jest.fn().mockReturnValue(of(false)),
      getById: jest.fn().mockReturnValue(of(undefined)),
    };

    createProductUCMock = { execute: jest.fn().mockReturnValue(of({})) };
    updateProductUCMock = { execute: jest.fn().mockReturnValue(of({})) };

    navigationStateServiceMock = {
      selectedProductId: jest.fn().mockReturnValue(null),
      clearSelectedProductId: jest.fn(),
    };

    routerMock = { navigate: jest.fn() };
    notificationServiceMock = { success: jest.fn(), error: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [ProductFormComponent, ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: ProductRepository, useValue: productRepoMock },
        { provide: CreateProductUseCase, useValue: createProductUCMock },
        { provide: UpdateProductUseCase, useValue: updateProductUCMock },
        { provide: NavigationStateService, useValue: navigationStateServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: {} },
        { provide: NotificationService, useValue: notificationServiceMock },
      ],
    })
      .overrideComponent(ProductFormComponent, {
        remove: { imports: [FormFieldComponent, ButtonComponent] },
        add: { imports: [MockFormFieldComponent, MockButtonComponent] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and initialize form', () => {
    expect(component).toBeTruthy();
    expect(component.productForm).toBeDefined();
  });

  it('should submit valid form (Create)', fakeAsync(() => {
    component.productForm.setValue({
      id: 'test-id',
      name: 'Test Name',
      description: 'Test Description',
      logo: 'test-logo.png',
      date_release: '2027-01-01',
      date_revision: '2028-01-01',
    });

    tick(500);
    fixture.detectChanges();
    component.onSubmit();
    tick();

    expect(createProductUCMock.execute).toHaveBeenCalled();
    expect(notificationServiceMock.success).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/products']);
    expect(component.isSubmitting()).toBe(false);
  }));

  it('should handle submission error', fakeAsync(() => {
    updateProductUCMock.execute.mockReturnValue(throwError(() => new Error('API Error')));
    component.isEditMode.set(true);
    component.productForm.setValue({
      id: 'edit-id',
      name: 'Updated Name',
      description: 'Updated Description',
      logo: 'logo.png',
      date_release: '2027-01-01',
      date_revision: '2028-01-01',
    });

    component.onSubmit();
    tick();

    expect(component.isSubmitting()).toBe(false);
    expect(routerMock.navigate).not.toHaveBeenCalledWith(['/products']);
  }));

  describe('Edit Mode Logic', () => {
    const mockProduct = {
      id: 'edit-id',
      name: 'Edit Product',
      description: 'Edit Description',
      logo: 'logo.png',
      dateRelease: new Date('2027-01-01T00:00:00.000Z'),
      dateRevision: new Date('2028-01-01T00:00:00.000Z'),
    };

    it('should handle edit mode initialization', () => {
      navigationStateServiceMock.selectedProductId.mockReturnValue('edit-id');
      productRepoMock.getById.mockReturnValue(of(mockProduct));

      component.ngOnInit();
      fixture.detectChanges();

      expect(component.isEditMode()).toBe(true);
      expect(component.productForm.get('name')?.value).toBe('Edit Product');
    });

    it('should navigate away if product not found in edit mode', () => {
      navigationStateServiceMock.selectedProductId.mockReturnValue('not-found');
      productRepoMock.getById.mockReturnValue(of(null));

      component.ngOnInit();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/products']);
    });

    it('should handle error when loading product for edit', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      navigationStateServiceMock.selectedProductId.mockReturnValue('error-id');
      productRepoMock.getById.mockReturnValue(throwError(() => new Error('Load failed')));

      component.ngOnInit();
      expect(routerMock.navigate).toHaveBeenCalledWith(['/products']);
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('should do nothing if loadProductToEdit is called with no productId', () => {
      component.productId.set(null);
      component.loadProductToEdit();
      expect(productRepoMock.getById).not.toHaveBeenCalled();
    });
  });

  describe('Validators & Logic', () => {
    it('should validate unique ID directly', fakeAsync(() => {
      const idControl = component.productForm.get('id');
      idControl?.setValue('some-value');

      productRepoMock.verifyId.mockReturnValue(of(true).pipe(delay(10)));
      let result: any;
      component.uniqueIdValidator(idControl as any).subscribe((r) => (result = r));
      tick(510);
      expect(result?.['idExists']).toBe(true);

      productRepoMock.verifyId.mockReturnValue(of(false).pipe(delay(10)));
      component.uniqueIdValidator(idControl as any).subscribe((r) => (result = r));
      tick(510);
      expect(result).toBeNull();
    }));

    it('should handle API error in uniqueIdValidator (catchError branch)', fakeAsync(() => {
      productRepoMock.verifyId.mockReturnValue(
        throwError(() => new Error('API Error')).pipe(delay(10)),
      );
      const idControl = component.productForm.get('id');
      idControl?.setValue('error-id');
      let result: any = { some: 'initial' };
      component.uniqueIdValidator(idControl as any).subscribe((r) => (result = r));
      tick(510);
      expect(result).toBeNull();
    }));

    it('should return null if uniqueIdValidator is called with empty value', fakeAsync(() => {
      const idControl = component.productForm.get('id');
      idControl?.setValue('');
      let result: any = { some: 'initial' };
      component.uniqueIdValidator(idControl as any).subscribe((r) => (result = r));
      tick(500);
      expect(result).toBeNull();
    }));

    it('should not submit if form is invalid', () => {
      component.productForm.patchValue({ name: '' });
      component.onSubmit();
      expect(component.isSubmitting()).toBe(false);
      expect(createProductUCMock.execute).not.toHaveBeenCalled();
    });

    it('should handle invalid dates in formatDateForInput', () => {
      const result = (component as any).formatDateForInput(new Date('invalid'));
      expect(result).toBe('');

      const resultCatch = (component as any).formatDateForInput(null);
      expect(resultCatch).toBe('');
    });

    it('should handle API error in uniqueIdValidator', fakeAsync(() => {
      productRepoMock.verifyId.mockReturnValue(throwError(() => new Error('API Error')));
      const idControl = component.productForm.get('id');
      idControl?.setValue('error-id');
      tick(500);
      expect(idControl?.errors?.['idExists']).toBeUndefined();
    }));

    it('should auto-calculate revision date', () => {
      const releaseControl = component.productForm.get('date_release');
      const revisionControl = component.productForm.get('date_revision');

      releaseControl?.setValue('2025-01-01');
      expect(revisionControl?.value).toBe('2026-01-01');
    });

    it('should reset form in create mode', () => {
      component.productForm.patchValue({ name: 'Dirty' });
      component.onReset();
      expect(component.productForm.get('name')?.value).toBeNull();
    });

    it('should reset form to initial values in edit mode', () => {
      component.isEditMode.set(true);
      component.initialProduct = {
        id: '1',
        name: 'Original',
        description: 'Desc',
        logo: 'logo.png',
        dateRelease: new Date('2025-01-01'),
        dateRevision: new Date('2026-01-01'),
      };
      component.productForm.patchValue({ name: 'Modified' });
      component.onReset();
      expect(component.productForm.get('name')?.value).toBe('Original');
    });

    it('should clear navigation state on destroy', () => {
      component.ngOnDestroy();
      expect(navigationStateServiceMock.clearSelectedProductId).toHaveBeenCalled();
    });
  });
});

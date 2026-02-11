import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, of, timer } from 'rxjs';
import { map, catchError, first, switchMap, finalize } from 'rxjs/operators';
import { ProductRepository } from '../../../core/repositories/product.repository';
import {
  CreateProductUseCase,
  UpdateProductUseCase,
} from '../../../core/use-cases/product.use-cases';
import { NavigationStateService } from '../../../core/services/navigation-state.service';
import { Product } from '../../../core/models/product.model';
import { ProductMapper } from '../../../core/mappers/product.mapper';
import { FormFieldComponent } from '../../../shared/components/molecules/form-field/form-field';
import { ButtonComponent } from '../../../shared/components/atoms/button/button';
import { CustomValidators } from '../../../shared/utils/validators.util';
import { NotificationService } from '../../../core/services/notification.service';
import { UI_TEXTS } from '../../../core/constants/ui-texts.constants';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormFieldComponent, ButtonComponent],
  templateUrl: './product-form.html',
  styleUrl: './product-form.scss',
})
export class ProductFormComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private productRepo = inject(ProductRepository);
  private createProductUC = inject(CreateProductUseCase);
  private updateProductUC = inject(UpdateProductUseCase);
  private navigationStateService = inject(NavigationStateService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  productForm!: FormGroup;
  isSubmitting = signal(false);
  isEditMode = signal(false);
  productId = signal<string | null>(null);
  initialProduct: Product | null = null;
  uiTexts = UI_TEXTS;

  formTitle = computed(() =>
    this.isEditMode() ? UI_TEXTS.TITLES.FORM_EDIT : UI_TEXTS.TITLES.FORM_ADD,
  );

  formErrors = {
    id: {
      required: UI_TEXTS.FORM.ERRORS.ID_INVALID,
      minlength: UI_TEXTS.FORM.ERRORS.MIN_LENGTH(3),
      maxlength: UI_TEXTS.FORM.ERRORS.MAX_LENGTH(10),
      idExists: UI_TEXTS.FORM.ERRORS.ID_EXISTS,
    },
    name: {
      required: UI_TEXTS.FORM.ERRORS.REQUIRED,
      minlength: UI_TEXTS.FORM.ERRORS.MIN_LENGTH(5),
      maxlength: UI_TEXTS.FORM.ERRORS.MAX_LENGTH(100),
    },
    description: {
      required: UI_TEXTS.FORM.ERRORS.REQUIRED,
      minlength: UI_TEXTS.FORM.ERRORS.MIN_LENGTH(10),
      maxlength: UI_TEXTS.FORM.ERRORS.MAX_LENGTH(200),
    },
    logo: { required: UI_TEXTS.FORM.ERRORS.REQUIRED },
    date_release: {
      required: UI_TEXTS.FORM.ERRORS.REQUIRED,
      dateInvalid: UI_TEXTS.FORM.ERRORS.DATE_INVALID,
    },
    date_revision: {
      required: UI_TEXTS.FORM.ERRORS.REQUIRED,
      revisionInvalid: UI_TEXTS.FORM.ERRORS.REVISION_INVALID,
    },
  };

  ngOnInit(): void {
    const id = this.navigationStateService.selectedProductId();
    if (id) {
      this.isEditMode.set(true);
      this.productId.set(id);
      this.initForm();
      this.loadProductToEdit();
    } else {
      this.initForm();
    }
  }

  initForm() {
    this.productForm = this.fb.group({
      id: [
        { value: '', disabled: this.isEditMode() },
        {
          validators: [Validators.required, Validators.minLength(3), Validators.maxLength(10)],
          asyncValidators: this.isEditMode() ? [] : [this.uniqueIdValidator.bind(this)],
          updateOn: 'change',
        },
      ],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', [Validators.required]],
      date_release: ['', [Validators.required, CustomValidators.minDateToday]],
      date_revision: [{ value: '', disabled: true }, [Validators.required]],
    });

    this.productForm.get('date_release')?.valueChanges.subscribe((value) => {
      if (value) {
        const releaseDate = new Date(value);
        const revisionDate = new Date(releaseDate);
        revisionDate.setFullYear(releaseDate.getFullYear() + 1);
        this.productForm.get('date_revision')?.setValue(revisionDate.toISOString().split('T')[0]);
      }
    });
  }

  isIdValidating = signal(false);

  uniqueIdValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    if (!control.value) return of(null);
    return timer(500).pipe(
      switchMap(() => {
        this.isIdValidating.set(true);
        return this.productRepo.verifyId(control.value).pipe(
          catchError(() => of(false)),
          finalize(() => this.isIdValidating.set(false)),
        );
      }),
      map((exists) => (exists ? { idExists: true } : null)),
      first(),
    );
  }

  loadProductToEdit() {
    const id = this.productId();
    if (id) {
      this.productRepo.getById(id).subscribe({
        next: (product) => {
          if (product) {
            this.initialProduct = product;
            const release = this.formatDateForInput(product.dateRelease);
            const revision = this.formatDateForInput(product.dateRevision);

            this.productForm.patchValue({
              ...product,
              date_release: release,
              date_revision: revision,
            });
          } else {
            this.router.navigate(['/products']);
          }
        },
        error: (err) => {
          console.error('Error loading product for edit', err);
          this.router.navigate(['/products']);
        },
      });
    }
  }

  private formatDateForInput(date: Date): string {
    try {
      if (isNaN(date.getTime())) return '';
      return date.toISOString().split('T')[0];
    } catch (e) {
      return '';
    }
  }

  onSubmit() {
    if (this.productForm.valid) {
      this.isSubmitting.set(true);
      const formValue = this.productForm.getRawValue();

      const productDTO = ProductMapper.fromFormToDTO(formValue);
      const productDomain = ProductMapper.toDomain(productDTO);

      const action$ = this.isEditMode()
        ? this.updateProductUC.execute(productDomain)
        : this.createProductUC.execute(productDomain);

      action$.subscribe({
        next: () => {
          this.notificationService.success(
            this.isEditMode() ? 'Producto actualizado con éxito' : 'Producto creado con éxito',
          );
          this.isSubmitting.set(false);
          this.router.navigate(['/products']);
        },
        error: () => {
          this.isSubmitting.set(false);
        },
      });
    }
  }

  onReset() {
    if (this.isEditMode() && this.initialProduct) {
      const release = this.initialProduct.dateRelease.toISOString().split('T')[0];
      const revision = this.initialProduct.dateRevision.toISOString().split('T')[0];

      this.productForm.patchValue({
        ...this.initialProduct,
        date_release: release,
        date_revision: revision,
      });
    } else {
      this.productForm.reset();
    }
  }

  ngOnDestroy(): void {
    this.navigationStateService.clearSelectedProductId();
  }
}

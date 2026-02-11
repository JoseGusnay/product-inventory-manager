import {
  Component,
  OnInit,
  signal,
  inject,
  computed,
  ViewChild,
  TemplateRef,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TableComponent } from '../../../shared/components/molecules/table/table';
import { ButtonComponent } from '../../../shared/components/atoms/button/button';
import { ProductRepository } from '../../../core/repositories/product.repository';
import {
  GetProductsUseCase,
  DeleteProductUseCase,
} from '../../../core/use-cases/product.use-cases';
import { NavigationStateService } from '../../../core/services/navigation-state.service';
import { Product } from '../../../core/models/product.model';
import { ModalComponent } from '../../../shared/components/molecules/modal/modal';
import {
  DropdownComponent,
  DropdownOption,
} from '../../../shared/components/atoms/dropdown/dropdown';
import { UI_TEXTS } from '../../../core/constants/ui-texts.constants';
import { AvatarComponent } from '../../../shared/components/atoms/avatar/avatar';
import { TableColumn } from '../../../shared/components/molecules/table/table.interface';
import { PaginationComponent } from '../../../shared/components/molecules/pagination/pagination';

import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    TableComponent,
    ButtonComponent,
    ModalComponent,
    DropdownComponent,
    AvatarComponent,
    PaginationComponent,
  ],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductListComponent implements OnInit, AfterViewInit {
  private productRepo = inject(ProductRepository);
  private getProductsUC = inject(GetProductsUseCase);
  private deleteProductUC = inject(DeleteProductUseCase);
  private navigationStateService = inject(NavigationStateService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  uiTexts = UI_TEXTS;

  products = this.productRepo.products;
  isLoading = this.productRepo.isLoading;

  searchTerm = signal<string>('');
  itemsPerPage = signal<number>(5);
  currentPage = signal<number>(1);

  isModalOpen = signal(false);
  isDeleting = signal(false);
  productToDelete = signal<Product | null>(null);

  columns = signal<TableColumn[]>([]);
  openDropdownId = signal<string | null>(null);

  @ViewChild('logoTemplate') logoTemplate!: TemplateRef<any>;
  @ViewChild('dateTemplate') dateTemplate!: TemplateRef<any>;
  @ViewChild('revisionDateTemplate') revisionDateTemplate!: TemplateRef<any>;
  @ViewChild('actionsTemplate') actionsTemplate!: TemplateRef<any>;

  dropdownOptions: DropdownOption[] = [
    { label: UI_TEXTS.ACTIONS.EDIT, value: 'edit' },
    { label: UI_TEXTS.ACTIONS.DELETE, value: 'delete' },
  ];

  filteredProducts = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.products().filter(
      (p) =>
        (p.name || '').toLowerCase().includes(term) ||
        (p.description || '').toLowerCase().includes(term) ||
        (p.id || '').toLowerCase().includes(term),
    );
  });

  paginatedProducts = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage();
    const end = start + this.itemsPerPage();
    return this.filteredProducts().slice(start, end);
  });

  deleteMessage = computed(() => {
    const product = this.productToDelete();
    return product ? UI_TEXTS.MESSAGES.DELETE_CONFIRMATION(product.name) : '';
  });

  ngOnInit(): void {
    this.loadProducts();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.columns.set([
        {
          header: UI_TEXTS.TABLE.HEADERS.LOGO,
          template: this.logoTemplate,
          align: 'center',
          width: '100px',
        },
        { header: UI_TEXTS.TABLE.HEADERS.NAME, field: 'name', width: '20%' },
        {
          header: UI_TEXTS.TABLE.HEADERS.DESCRIPTION,
          field: 'description',
          width: '30%',
          tooltip: 'Descripción',
        },
        {
          header: UI_TEXTS.TABLE.HEADERS.RELEASE_DATE,
          field: 'dateRelease',
          template: this.dateTemplate,
          width: '15%',
          tooltip: 'Fecha liberación',
        },
        {
          header: UI_TEXTS.TABLE.HEADERS.REVISION_DATE,
          field: 'dateRevision',
          template: this.revisionDateTemplate,
          width: '15%',
          tooltip: 'Fecha revisión',
        },
        { header: '', template: this.actionsTemplate, align: 'center', width: '50px' },
      ]);
    });
  }

  loadProducts() {
    this.getProductsUC.execute().subscribe();
  }

  onAction(option: DropdownOption, product: Product) {
    if (option.value === 'edit') {
      this.navigationStateService.setSelectedProductId(product.id);
      this.router.navigate(['/products/edit']);
    } else if (option.value === 'delete') {
      this.productToDelete.set(product);
      this.isModalOpen.set(true);
    }
    this.openDropdownId.set(null);
  }

  toggleDropdown(productId: string, isOpen: boolean) {
    this.openDropdownId.set(isOpen ? productId : null);
  }

  confirmDelete() {
    const product = this.productToDelete();
    if (product) {
      this.isDeleting.set(true);
      this.deleteProductUC.execute(product.id).subscribe({
        next: () => {
          this.isDeleting.set(false);
          this.isModalOpen.set(false);
          this.notificationService.success(UI_TEXTS.MESSAGES.DELETE_SUCCESS);
        },
        error: (err) => {
          console.error('Error deleting product', err);
          this.isDeleting.set(false);
          this.isModalOpen.set(false);
          this.notificationService.error(UI_TEXTS.MESSAGES.DELETE_ERROR);
        },
      });
    }
  }

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
    this.currentPage.set(1);
  }

  onItemsPerPageChange(value: number) {
    this.itemsPerPage.set(value);
    this.currentPage.set(1);
  }

  onPageChange(page: number) {
    this.currentPage.set(page);
  }

  onAddProduct() {
    this.navigationStateService.clearSelectedProductId();
    this.router.navigate(['/products/add']);
  }
}

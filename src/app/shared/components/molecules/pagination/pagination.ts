import { Component, input, output, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.html',
  styleUrl: './pagination.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent {
  totalItems = input.required<number>();
  itemsPerPage = input.required<number>();
  currentPage = input.required<number>();

  pageChange = output<number>();
  itemsPerPageChange = output<number>();

  totalPages = computed(() => {
    return Math.ceil(this.totalItems() / this.itemsPerPage()) || 1;
  });

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.pageChange.emit(this.currentPage() + 1);
    }
  }

  prevPage() {
    if (this.currentPage() > 1) {
      this.pageChange.emit(this.currentPage() - 1);
    }
  }

  onItemsPerPageChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.itemsPerPageChange.emit(Number(value));
    this.pageChange.emit(1);
  }
}

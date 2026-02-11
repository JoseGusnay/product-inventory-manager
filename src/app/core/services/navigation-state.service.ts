import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NavigationStateService {
  private _selectedProductId = signal<string | null>(null);

  get selectedProductId() {
    return this._selectedProductId.asReadonly();
  }

  setSelectedProductId(id: string | null) {
    this._selectedProductId.set(id);
  }

  clearSelectedProductId() {
    this._selectedProductId.set(null);
  }
}

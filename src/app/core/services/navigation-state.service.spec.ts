import { TestBed } from '@angular/core/testing';
import { NavigationStateService } from './navigation-state.service';

describe('NavigationStateService', () => {
  let service: NavigationStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NavigationStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have initial selectedProductId as null', () => {
    expect(service.selectedProductId()).toBeNull();
  });

  it('should set selectedProductId', () => {
    const testId = 'test-id-123';
    service.setSelectedProductId(testId);
    expect(service.selectedProductId()).toBe(testId);
  });

  it('should clear selectedProductId', () => {
    service.setSelectedProductId('test-id');
    service.clearSelectedProductId();
    expect(service.selectedProductId()).toBeNull();
  });
});

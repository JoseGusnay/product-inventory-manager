import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginationComponent } from './pagination';

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.componentRef.setInput('totalItems', 10);
    fixture.componentRef.setInput('itemsPerPage', 5);
    fixture.componentRef.setInput('currentPage', 1);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should calculate total pages correctly', () => {
    fixture.componentRef.setInput('totalItems', 11);
    fixture.componentRef.setInput('itemsPerPage', 5);
    fixture.componentRef.setInput('currentPage', 1);
    fixture.detectChanges();
    expect(component.totalPages()).toBe(3);
  });

  it('should emit pageChange on nextPage', () => {
    fixture.componentRef.setInput('totalItems', 20);
    fixture.componentRef.setInput('itemsPerPage', 5);
    fixture.componentRef.setInput('currentPage', 1);
    fixture.detectChanges();

    const emitSpy = jest.spyOn(component.pageChange, 'emit');
    component.nextPage();
    expect(emitSpy).toHaveBeenCalledWith(2);
  });

  it('should emit pageChange on prevPage', () => {
    fixture.componentRef.setInput('totalItems', 20);
    fixture.componentRef.setInput('itemsPerPage', 5);
    fixture.componentRef.setInput('currentPage', 2);
    fixture.detectChanges();

    const emitSpy = jest.spyOn(component.pageChange, 'emit');
    component.prevPage();
    expect(emitSpy).toHaveBeenCalledWith(1);
  });

  it('should not emit if on first page and prevPage called', () => {
    fixture.componentRef.setInput('totalItems', 20);
    fixture.componentRef.setInput('itemsPerPage', 5);
    fixture.componentRef.setInput('currentPage', 1);
    fixture.detectChanges();

    const emitSpy = jest.spyOn(component.pageChange, 'emit');
    component.prevPage();
    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should emit current page 1 on itemsPerPageChange', () => {
    fixture.componentRef.setInput('totalItems', 20);
    fixture.componentRef.setInput('itemsPerPage', 5);
    fixture.componentRef.setInput('currentPage', 2);
    fixture.detectChanges();

    const itemsSpy = jest.spyOn(component.itemsPerPageChange, 'emit');
    const pageSpy = jest.spyOn(component.pageChange, 'emit');

    const event = { target: { value: '10' } } as any;
    component.onItemsPerPageChange(event);

    expect(itemsSpy).toHaveBeenCalledWith(10);
    expect(pageSpy).toHaveBeenCalledWith(1);
  });
});

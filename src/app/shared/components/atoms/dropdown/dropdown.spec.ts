import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DropdownComponent, DropdownOption } from './dropdown';

describe('DropdownComponent', () => {
  let component: DropdownComponent;
  let fixture: ComponentFixture<DropdownComponent>;

  const mockOptions: DropdownOption[] = [
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropdownComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DropdownComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('options', mockOptions);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle and calculate position when opening', () => {
    const toggleSpy = jest.spyOn(component.toggled, 'emit');
    const calcSpy = jest.spyOn(component as any, 'calculatePosition');

    fixture.componentRef.setInput('isOpen', false);
    const event = new MouseEvent('click');
    component.toggle(event);

    expect(calcSpy).toHaveBeenCalled();
    expect(toggleSpy).toHaveBeenCalledWith(true);
  });

  it('should select option and emit', () => {
    const selectSpy = jest.spyOn(component.optionSelected, 'emit');
    const event = new MouseEvent('click');
    const option = mockOptions[0];

    component.select(option, event);
    expect(selectSpy).toHaveBeenCalledWith(option);
  });

  it('should emit false on document click if open', () => {
    const toggleSpy = jest.spyOn(component.toggled, 'emit');
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();

    component.close();
    expect(toggleSpy).toHaveBeenCalledWith(false);
  });

  it('should emit false on window scroll if open', () => {
    const toggleSpy = jest.spyOn(component.toggled, 'emit');
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();

    component.onScroll(new Event('scroll'));
    expect(toggleSpy).toHaveBeenCalledWith(false);
  });

  it('should emit false on window resize if open', () => {
    const toggleSpy = jest.spyOn(component.toggled, 'emit');
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();

    component.onResize();
    expect(toggleSpy).toHaveBeenCalledWith(false);
  });

  it('should correctly calculate position for bottom opening', () => {
    const trigger = fixture.nativeElement.querySelector('.a-dropdown__trigger');
    jest.spyOn(trigger, 'getBoundingClientRect').mockReturnValue({
      top: 100,
      bottom: 130,
      left: 500,
      right: 530,
      width: 30,
      height: 30,
    } as DOMRect);

    window.innerHeight = 800;
    window.innerWidth = 1000;

    (component as any).calculatePosition();

    const style = component.dropdownStyle();
    expect(style['top']).toBe('134px');
    expect(style['bottom']).toBe('auto');
    expect(component.dropdownPosition()).toBe('bottom');
  });

  it('should not calculate position if already open when toggling', () => {
    const calcSpy = jest.spyOn(component as any, 'calculatePosition');
    fixture.componentRef.setInput('isOpen', true);
    const event = new MouseEvent('click');

    component.toggle(event);
    expect(calcSpy).not.toHaveBeenCalled();
  });
  it('should correctly calculate position for top opening when near bottom', () => {
    const trigger = fixture.nativeElement.querySelector('.a-dropdown__trigger');
    jest.spyOn(trigger, 'getBoundingClientRect').mockReturnValue({
      top: 750,
      bottom: 780,
      left: 500,
      right: 530,
      width: 30,
      height: 30,
    } as DOMRect);

    window.innerHeight = 800;

    (component as any).calculatePosition();

    const style = component.dropdownStyle();
    expect(style['bottom']).toBe('54px'); // 800 - 750 + 4
    expect(component.dropdownPosition()).toBe('top');
  });

  it('should align left if menu overflows left edge', () => {
    const trigger = fixture.nativeElement.querySelector('.a-dropdown__trigger');
    jest.spyOn(trigger, 'getBoundingClientRect').mockReturnValue({
      top: 100,
      bottom: 130,
      left: 50,
      right: 80,
      width: 30,
      height: 30,
    } as DOMRect);

    // menuWidth is 150. right(80) - 150 = -70. -70 < 10, so it should align left.
    (component as any).calculatePosition();

    const style = component.dropdownStyle();
    expect(style['left']).toBe('50px');
  });

  it('should close when document is clicked', () => {
    const spy = jest.spyOn(component.toggled, 'emit');
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();

    document.dispatchEvent(new MouseEvent('click'));
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith(false);
  });

  it('should close on window scroll', () => {
    const spy = jest.spyOn(component.toggled, 'emit');
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();

    window.dispatchEvent(new Event('scroll'));
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith(false);
  });

  it('should close on window resize', () => {
    const spy = jest.spyOn(component.toggled, 'emit');
    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();

    window.dispatchEvent(new Event('resize'));
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith(false);
  });
});

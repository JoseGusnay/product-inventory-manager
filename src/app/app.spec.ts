import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { App } from './app';
import { Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { Subject } from 'rxjs';

describe('App', () => {
  let component: App;
  let fixture: ComponentFixture<App>;
  let router: Router;
  let location: Location;
  let routerEvents$: Subject<any>;

  beforeEach(async () => {
    routerEvents$ = new Subject();

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, NoopAnimationsModule, App],
      providers: [
        {
          provide: Router,
          useValue: {
            events: routerEvents$.asObservable(),
            navigate: jest.fn(),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);

    fixture.detectChanges();
  });

  it('should create the app shell', () => {
    expect(component).toBeTruthy();
  });

  it('should have a router outlet', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
  });

  it('should update showBackButton based on URL', fakeAsync(() => {
    routerEvents$.next(new NavigationEnd(1, '/', '/'));
    tick();
    expect(component.showBackButton()).toBe(false);

    routerEvents$.next(new NavigationEnd(2, '/products', '/products'));
    tick();
    expect(component.showBackButton()).toBe(false);

    routerEvents$.next(new NavigationEnd(3, '/products/add', '/products/add'));
    tick();
    expect(component.showBackButton()).toBe(true);
  }));

  it('should call location.back() inside goBack()', () => {
    const backSpy = jest.spyOn(location, 'back');
    component.goBack();
    expect(backSpy).toHaveBeenCalled();
  });
});

import { Component, inject, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterOutlet, ChildrenOutletContexts, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { slideInAnimation } from './shared/animations/route-animations';

import { NotificationComponent } from './shared/components/molecules/notification/notification';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NotificationComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  animations: [slideInAnimation],
})
export class App {
  private contexts = inject(ChildrenOutletContexts);
  private router = inject(Router);
  private location = inject(Location);

  showBackButton = signal(false);

  constructor() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const url = event.urlAfterRedirects || event.url;
        this.showBackButton.set(url !== '/products' && url !== '/');
      });
  }

  prepareRoute() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
  }

  goBack() {
    this.location.back();
  }
}

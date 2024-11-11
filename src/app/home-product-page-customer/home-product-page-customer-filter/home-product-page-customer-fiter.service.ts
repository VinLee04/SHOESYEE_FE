import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  showFilter = signal<boolean>(false);

  toggleFilter() {
    this.showFilter.update((value) => !value);
  }
}

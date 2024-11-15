import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NavService {
    private readonly nav = signal<boolean>(true);
    get navSignal(){
        return this.nav;
    }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  private currentUserSubject: BehaviorSubject<any | null>;
  public currentUser$: Observable<any | null>;

  constructor() {
    let storedUser = null;
    if (typeof window !== 'undefined' && window.localStorage) {
      const userJson = localStorage.getItem('currentUser');
      storedUser = userJson ? JSON.parse(userJson) : null;
    }
    this.currentUserSubject = new BehaviorSubject<any | null>(storedUser);
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  setUser(user: any): void {
    this.currentUserSubject.next(user);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    }
  }

  getUser(): any | null {
    return this.currentUserSubject.value;
  }

  logout(): void {
    this.currentUserSubject.next(null);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('currentUser');
    }
  }

  isLoggedIn(): boolean {
    return !!this.getUser();
  }
}

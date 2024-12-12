import { Injectable, OnDestroy } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

export class SessionService implements OnDestroy {
  private readonly TOKEN_KEY = 'authToken';

  constructor() {
    /*if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', this.clearToken);
    }*/
  }

  storeToken(token: string): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(this.TOKEN_KEY, token);
      }
    } catch (error) {
      console.error('Error storing the token:', error);
    }
  }

  getToken(): string | null {
    if (typeof window !== 'undefined' && localStorage) {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    console.warn('localStorage is not available');
    return null;
  }

  logout(): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(this.TOKEN_KEY);
      }
    } catch (error) {
      console.error('Error removing the token:', error);
    }
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return token !== null;
  }

  clearSession(): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.clear();
      }
    } catch (error) {
      console.error('Error clearing session data:', error);
    }
  }

  private clearToken = (): void => {
    console.log('Clearing token before page unload');
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.TOKEN_KEY);
    }
  };

  ngOnDestroy() {
    /*if (typeof window !== 'undefined') {
      window.removeEventListener('beforeunload', this.clearToken);
    }*/
  }
}

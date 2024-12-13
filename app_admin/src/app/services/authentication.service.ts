import { Inject, Injectable } from '@angular/core';
import { BROWSER_STORAGE } from '../storage';
import { User } from '../models/user';
import { AuthResponse } from '../models/authResponse';
import { TripDataService } from '../services/trip-data.service';
import { LoginCredentials } from '../models/login-credentials';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class AuthenticationService {
constructor(
 @Inject(BROWSER_STORAGE) private storage: Storage,
 private tripDataService: TripDataService
) { }

private isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;
    
    try {
      const payload = this.decodeToken(token);
      if (!payload) return true;
      return payload.exp ? payload.exp * 1000 < Date.now() : true;
    } catch {
      return true;
    }
}

public saveToken(token: string): void {
    if (!token) {
      console.error('Attempted to save invalid token');
      return;
    }
    try {
      const payload = this.decodeToken(token);
      if (!payload) throw new Error('Invalid token structure');
      this.storage.setItem('travlr-token', token);
    } catch (err) {
      console.error('Error saving token:', err);
      this.logout();
    }
  }

public getToken(): string {
  return this.storage.getItem('travlr-token') || '';
}

public login(credentials: LoginCredentials): Promise<any> {
  return this.tripDataService.login(credentials)
      .then((authResp: AuthResponse) => {
          this.saveToken(authResp.token);
          return authResp;
      })
      .catch((error) => {
          console.error('Login error:', error);
          throw error;
      });
}

public register(user: User): Promise<any> {
 return this
 .tripDataService
 .register(user)
 .then((authResp: AuthResponse) =>
this.saveToken(authResp.token));
 }

public logout(): void {
 this.storage.removeItem('travlr-token');
 }

 public isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    try {
      if (this.isTokenExpired()) {
        this.logout(); // Clear invalid token
        return false;
      }
      return true;
    } catch (err) {
      console.error('Error checking login status:', err);
      return false;
    }
  }
 
 public getCurrentUser(): User | null {
    if (this.isLoggedIn()) {
        const token: string = this.getToken();
        const { email, name } = JSON.parse(atob(token.split('.')[1]));
        return { email, name } as User;
    }
    return null;
  }

  private decodeToken(token: string): any {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (err) {
        console.error('Error decoding token:', err);
        return null;
    }
}
}

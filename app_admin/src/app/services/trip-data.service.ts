import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom, Observable, catchError } from 'rxjs';
import { Trip } from '../models/trip';
import { User } from '../models/user';
import { AuthResponse } from '../models/authResponse';
import { BROWSER_STORAGE } from '../storage';
import { LoginCredentials } from '../models/login-credentials';

@Injectable({
  providedIn: 'root'
})
export class TripDataService {
  private apiBaseUrl = 'http://localhost:3000/api';
  private tripUrl = `${this.apiBaseUrl}/trips`;
  private authUrl = 'http://localhost:3000/api';

  constructor(
    private http: HttpClient,
    @Inject(BROWSER_STORAGE) private storage: Storage
  ) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.storage.getItem('travlr-token');
    console.log('Token structure:', {
      length: token?.length,
      prefix: token?.substring(0, 20) + '...' // Log first part of token
    });
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getTrips(): Observable<Trip[]> {
    return this.http.get<Trip[]>(this.tripUrl);
  }

  getTrip(tripCode: string): Observable<Trip[]> {
    return this.http.get<Trip[]>(`${this.tripUrl}/${tripCode}`);
  }
  
  addTrip(formData: Trip): Observable<Trip> {
    return this.http.post<Trip>(
      this.tripUrl, 
      formData,
      { headers: this.getAuthHeaders() }
    );
  }

  updateTrip(formData: Trip): Observable<Trip> {
    console.log('Update URL:', `${this.tripUrl}/${formData.code}`);
    console.log('Update Data:', formData);
    
    try {
      const token = this.storage.getItem('travlr-token');
      console.log('Token present:', !!token); // Log token presence
      
      const headers = this.getAuthHeaders();
      console.log('Headers:', headers.keys()); // Log header keys
      
      return this.http.put<Trip>(
        `${this.tripUrl}/${formData.code}`,
        formData,
        { headers }
      ).pipe(
        catchError(error => {
          console.error('Update error details:', {
            status: error.status,
            message: error.error?.message,
            headers: error.headers
          });
          throw error;
        })
      );
    } catch (error) {
      console.error('Error in updateTrip:', error);
      throw error;
    }
  }

  deleteTrip(tripCode: string): Observable<any> {
    return this.http.delete(
      `${this.tripUrl}/${tripCode}`,
      { headers: this.getAuthHeaders() }
    );
  }

  public async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.makeAuthApiCall('login', credentials);
    // Add logging
    console.log('Login successful, token received:', !!response.token);
    if (response.token) {
      this.storage.setItem('travlr-token', response.token);
    }
    return response;
  }

  public async register(user: User): Promise<AuthResponse> {
    return this.makeAuthApiCall('register', user);
  }
  
  private async makeAuthApiCall(urlPath: string, credentials: LoginCredentials | User): Promise<AuthResponse> {
    const url: string = `${this.authUrl}/${urlPath}`;
    const headers = {
      'Content-Type': 'application/json'
    };
    
    console.log('Making auth call to:', url, 'with credentials:', JSON.stringify(credentials));
    
    try {
      const response = await lastValueFrom(
        this.http.post<AuthResponse>(url, credentials, { headers })
      );
      return response;
    } catch (error: any) {
      console.error('Authentication API call error:', {
        status: error.status,
        message: error.error?.message || error.message,
        error
      });
      throw error;
    }
  }

  private logAuthStatus() {
    const token = this.storage.getItem('travlr-token');
    console.log('Current token:', token ? 'Present' : 'Missing');
  }
}
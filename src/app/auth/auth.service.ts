import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, tap, catchError, throwError, map } from 'rxjs';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  userType: 'member' | 'manager';
}

export interface User {
  userId: number;
  email: string;
  name: string;
  isProjectManager: boolean;
  notifications: any[];
}

interface AuthResponse {
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `http://localhost:8080/auth`;

  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      console.log('Server error response:', error.error); // Debug log
      errorMessage = error.error || `Error Code: ${error.status}\nMessage: ${error.message}`;
      if (error.status === 404) {
        errorMessage = 'API endpoint not found. Please check if the backend server is running and the URL is correct.';
      } else if (error.status === 0) {
        errorMessage = 'Unable to connect to the server. Please check if the backend server is running.';
      }
    }
    
    console.error('API Error:', error);
    return throwError(() => new Error(errorMessage));
  }

  login(credentials: LoginRequest): Observable<User> {
    console.log('Sending login request:', credentials); // Debug log
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      map(response => response.user),
      tap(user => {
        console.log('Raw login response:', user); // Debug log

        if (!user) {
          throw new Error('Empty response from server');
        }

        // Store user data
        localStorage.setItem('user', JSON.stringify(user));
      }),
      catchError(this.handleError)
    );
  }

  signup(userData: SignupRequest): Observable<User> {
    console.log('Sending signup request:', userData); // Debug log
    return this.http.post<AuthResponse>(`${this.apiUrl}/signup`, userData).pipe(
      map(response => response.user),
      tap(user => {
        console.log('Raw signup response:', user); // Debug log

        if (!user) {
          throw new Error('Empty response from server');
        }

        // Store user data
        localStorage.setItem('user', JSON.stringify(user));
      }),
      catchError(this.handleError)
    );
  }

  logout(): void {
    localStorage.removeItem('user');
  }

  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  }

  getCurrentUser(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
} 
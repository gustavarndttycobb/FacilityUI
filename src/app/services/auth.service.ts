import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SignupRequest {
    email: string;
    password: string;
    fullName: string;
}

export interface SigninRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:5246/Auth';

    constructor(private http: HttpClient) { }

    signup(data: SignupRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/signup`, data);
    }

    signin(data: SigninRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/signin`, data);
    }
}

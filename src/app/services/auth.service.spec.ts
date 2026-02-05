import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('AuthService', () => {
    let service: AuthService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [AuthService]
        });
        service = TestBed.inject(AuthService);
        httpMock = TestBed.inject(HttpTestingController);

        // Clear local storage before each test
        localStorage.clear();
    });

    afterEach(() => {
        httpMock.verify();
        localStorage.clear();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should store token in localStorage', () => {
        const token = 'test-token';
        service.storeToken(token);
        expect(localStorage.getItem('auth_token')).toBe(token);
    });

    it('should retrieve token from localStorage', () => {
        const token = 'test-token';
        localStorage.setItem('auth_token', token);
        expect(service.getToken()).toBe(token);
    });

    it('should return null if no token', () => {
        expect(service.getToken()).toBeNull();
    });

    it('should remove token on logout', () => {
        localStorage.setItem('auth_token', 'test-token');
        service.logout();
        expect(localStorage.getItem('auth_token')).toBeNull();
    });

    it('should return true for isAuthenticated if token exists', () => {
        localStorage.setItem('auth_token', 'test-token');
        expect(service.isAuthenticated()).toBe(true);
    });

    it('should return false for isAuthenticated if no token', () => {
        expect(service.isAuthenticated()).toBe(false);
    });
});

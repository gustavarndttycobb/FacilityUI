import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Auth } from './auth';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('Auth', () => {
  let component: Auth;
  let fixture: ComponentFixture<Auth>;
  let authServiceMock: any;
  let routerMock: any;
  let toastServiceMock: any;

  beforeEach(async () => {
    authServiceMock = {
      signin: vi.fn().mockReturnValue(of({ token: 'fake-token' })),
      signup: vi.fn().mockReturnValue(of({ token: 'fake-token' }))
    };

    routerMock = {
      navigate: vi.fn()
    };

    toastServiceMock = {
      show: vi.fn(),
      remove: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [Auth, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ToastService, useValue: toastServiceMock }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(Auth);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle mode', () => {
    expect(component.isLoginMode).toBe(true);
    component.toggleMode();
    expect(component.isLoginMode).toBe(false);
    component.toggleMode();
    expect(component.isLoginMode).toBe(true);
  });

  it('should call signin when in login mode and form is valid', () => {
    component.isLoginMode = true;
    component.authForm.patchValue({
      email: 'test@example.com',
      password: 'password123'
    });

    component.onSubmit();

    expect(authServiceMock.signin).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123'
    });
  });

  it('should call signup when in signup mode and form is valid', () => {
    component.isLoginMode = false;
    component.authForm.patchValue({
      email: 'newuser@example.com',
      password: 'password123',
      fullName: 'New User'
    });
    // Need to trigger toggleMode logic to set validators properly if we manually switch mode property? 
    // Actually toggleMode() does setValidators. Let's call it.
    component.isLoginMode = true; // reset
    component.toggleMode(); // switch to signup

    component.authForm.patchValue({
      email: 'newuser@example.com',
      password: 'password123',
      fullName: 'New User'
    });

    component.onSubmit();

    expect(authServiceMock.signup).toHaveBeenCalledWith({
      email: 'newuser@example.com',
      password: 'password123',
      fullName: 'New User'
    });
  });
});

import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})
export class Auth {
  isLoginMode = true;
  authForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      fullName: [''],
    });
  }

  get email() {
    return this.authForm.get('email');
  }
  get password() {
    return this.authForm.get('password');
  }
  get fullName() {
    return this.authForm.get('fullName');
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    if (this.isLoginMode) {
      this.fullName?.clearValidators();
    } else {
      this.fullName?.setValidators([Validators.required]);
    }
    this.fullName?.updateValueAndValidity();
  }

  onSubmit() {
    if (this.authForm.invalid) {
      return;
    }

    this.isLoading = true;

    const { email, password, fullName } = this.authForm.value;

    if (this.isLoginMode) {
      this.authService.signin({ email, password }).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.router.navigate(['/']);
          this.toastService.show('Welcome back!', 'success');
        },
        error: (err) => {
          console.error("caiu aqui", err);
          this.isLoading = false;
          this.cdr.detectChanges();

          if (err.status === 0) {
            this.toastService.show('Network error. Check connection.', 'error');
          } else if (err.status === 401) {
            this.toastService.show('Invalid email or password.', 'error');
          } else {
            this.toastService.show('Login failed. Please try again.', 'error');
          }
        }
      });
    } else {
      this.authService.signup({ email, password, fullName }).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.isLoginMode = true;
          this.router.navigate(['/']);
          this.toastService.show('Account created! Please log in.', 'success');
        },
        error: (err) => {
          this.isLoading = false;
          console.error(err);
          this.toastService.show('Signup failed. Email might be in use.', 'error');
        },
      });
    }
  }
}

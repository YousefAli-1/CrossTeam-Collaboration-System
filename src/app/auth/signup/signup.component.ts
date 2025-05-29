import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterLink } from '@angular/router';
import { NavbarComponent } from '../../navbar/navbar.component';
import { AuthService } from '../auth.service';
import { ToastService } from '../../shared/toast/toast.service';

function passwordMatchValidator(control: AbstractControl) {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  if (password && confirmPassword && password !== confirmPassword) {
    control.get('confirmPassword')?.setErrors({ mismatch: true });
    return { mismatch: true };
  } else {
    control.get('confirmPassword')?.setErrors(null);
    return null;
  }
}

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    NavbarComponent,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  signupForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
      Validators.pattern(/^[a-zA-Z\s]*$/)
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/)
    ]),
    confirmPassword: new FormControl('', [
      Validators.required
    ]),
    userType: new FormControl<'member' | 'manager'>('member', Validators.required)
  }, { validators: passwordMatchValidator });

  hidePassword = true;
  hideConfirmPassword = true;
  userType: 'member' | 'manager' = 'member';
  isLoading = false;

  get name() { return this.signupForm.get('name'); }
  get email() { return this.signupForm.get('email'); }
  get password() { return this.signupForm.get('password'); }
  get confirmPassword() { return this.signupForm.get('confirmPassword'); }

  private router = inject(Router);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);

  onSubmit() {
    if (this.signupForm.valid) {
      this.isLoading = true;
      const userData = {
        name: this.signupForm.value.name!,
        email: this.signupForm.value.email!,
        password: this.signupForm.value.password!,
        userType: this.signupForm.value.userType!,
        isProjectManager: this.signupForm.value.userType === 'manager'
      };

      this.authService.signup(userData).subscribe({
        next: (response) => {
          this.toastService.success('Signup successful! Please login.');
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Signup failed:', error);
          this.toastService.error(error.message || 'Signup failed. Please try again.');
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }

  toggleUserType() {
    this.userType = this.userType === 'member' ? 'manager' : 'member';
    this.signupForm.patchValue({ userType: this.userType });
  }
}
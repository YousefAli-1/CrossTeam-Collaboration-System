import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterLink } from '@angular/router';
import { NavbarComponent } from "../../navbar/navbar.component";
import { MembersService } from '../../members/members.service';
import { ProjectManagerService } from '../../project-manager/project-manager.service';
import { AuthService } from '../auth.service';
import { ToastService } from '../../shared/toast/toast.service';

@Component({
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    NavbarComponent
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  hidePassword = true;
  isLoading = false;

  loginForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl('', [
      Validators.required
    ])
  });

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  private router = inject(Router);
  private memberService = inject(MembersService);
  private managerService = inject(ProjectManagerService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const credentials = {
        email: this.loginForm.value.email!,
        password: this.loginForm.value.password!
      };

      this.authService.login(credentials).subscribe({
        next: (user) => {
          console.log('Login response:', user);

          const mappedUser = {
            userID: user.userId,
            name: user.name,
            email: user.email,
            Projects: []
          };

          if (user.isProjectManager) {
            this.managerService.logIn(mappedUser);
            this.toastService.success('Welcome back, ' + user.name + '!');
            this.router.navigate(['/projectManager']);
          } else {
            this.memberService.logIn(mappedUser);
            this.toastService.success('Welcome back, ' + user.name + '!');
            this.router.navigate(['/teamMember']);
          }
        },
        error: (error) => {
          console.error('Login failed:', error);
          this.toastService.error(error.message || 'Login failed. Please check your credentials.');
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }
}
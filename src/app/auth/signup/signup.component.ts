import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl, FormBuilder } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { NavbarComponent } from '../../navbar/navbar.component';
import { dummyTeamMembers } from '../../members/dummy-members';
import { TeamMember } from '../../app.model';

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
    MatDatepickerModule,
    MatNativeDateModule,
    NavbarComponent,
    ReactiveFormsModule
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
    dob: new FormControl<Date | null>(null, [
      Validators.required
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
  minDate = new Date(1900, 0, 1);
  maxDate = new Date(new Date().setFullYear(new Date().getFullYear() - 16));
  userType: 'member' | 'manager' = 'member';
  get name() { return this.signupForm.get('name'); }
  get email() { return this.signupForm.get('email'); }
  get password() { return this.signupForm.get('password'); }
  get confirmPassword() { return this.signupForm.get('confirmPassword'); }
  get dob() { return this.signupForm.get('dob'); }
  private router=inject(Router);
  onSubmit() {
    if (this.signupForm.valid) {
      const formValue = this.signupForm.value;
      const email = formValue.email ?? '';
      const name = formValue.name ?? '';
  
      const newUser: TeamMember = {
        userID: Math.floor(Math.random() * 10000),
        name: name,
        email: email,
        Projects: [],
        canSubmitTask: false,
        canReviewTask: false,
        canAcceptOrRejectTask: false
      };
  
      if (this.userType === 'member') {
        dummyTeamMembers.push(newUser);
      }
      console.log('array:' ,dummyTeamMembers);
      console.log('New user created:', newUser);
      this.router.navigate(['/login']);
    }
  }
  toggleUserType() {
    this.userType = this.userType === 'member' ? 'manager' : 'member';
    this.signupForm.patchValue({ userType: this.userType });
  }

}
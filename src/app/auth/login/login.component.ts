import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { NavbarComponent } from "../../navbar/navbar.component";
import { dummyProjectManager, dummyTeamMembers } from '../../members/dummy-members';
import { MembersService } from '../../members/members.service';

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
    NavbarComponent
],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  hidePassword = true;

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
  private router=inject(Router);
  private memberservice=inject(MembersService);
  onSubmit() {
    console.log(dummyTeamMembers);
    if (this.loginForm.valid) {
      const email = this.loginForm.value.email;
      const password = this.loginForm.value.password;
      const user = dummyTeamMembers.find(member => 
        member.email === email
      );
      const manager = dummyProjectManager.find(member => 
        member.email === email
      );
      if (user) {
        console.log('Login successful:', user);
        this.memberservice.logIn(user);
        this.router.navigate(['/teamMember']);
      }else if(manager){
        console.log('Login successful:', manager);
        this.memberservice.logIn(manager);
        this.router.navigate(['/projectManager']);
      }
    }
  }
}
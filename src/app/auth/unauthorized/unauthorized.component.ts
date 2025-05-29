import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './unauthorized.component.html',
  styleUrl: './unauthorized.component.scss'
})
export class UnauthorizedComponent implements OnInit {
  currentUser: any;
  user: any;

  constructor(private router: Router) {}

  ngOnInit() {
    this.currentUser = localStorage.getItem('currentUser');
    if (this.currentUser) {
      this.user = JSON.parse(this.currentUser);
    }
  }

  goToDashboard() {
    if (this.user?.isProjectManager) {
      this.router.navigate(['/projectManager']);
    } else {
      this.router.navigate(['/teamMember']);
    }
  }
}

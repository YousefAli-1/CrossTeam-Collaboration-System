import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss'
})
export class NotFoundComponent implements OnInit {
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

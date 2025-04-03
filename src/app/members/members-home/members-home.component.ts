import { Component, OnInit } from '@angular/core';
import { MembersService } from '../members.service'; 
import { type TeamMember, type Task } from '../../app.model' 
import { CommonModule } from '@angular/common';
@Component({
    selector: 'app-members-home',
    imports: [CommonModule],
    templateUrl: './members-home.component.html', 
    styleUrls: ['./members-home.component.scss']
})
export class MembersHomeComponent implements OnInit {
  currentUser: TeamMember | null = null; 
  tasks: Task[] = []; 

  constructor(private membersService: MembersService) {}

  ngOnInit(): void {
    // Fetch the current user and their tasks
    this.membersService.getCurrentUser().subscribe((user:any) => {
      this.currentUser = user;
      if (user) {
        this.membersService.getTasksForUser(user.userID).subscribe((tasks:any) => {
          this.tasks = tasks;
        });
      }
    });
  }
}

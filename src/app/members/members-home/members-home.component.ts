import { Component, inject, computed , OnInit } from '@angular/core';
import { MembersService } from '../members.service'; 
import { type TeamMember } from '../../app.model' 
import { CommonModule } from '@angular/common';
import { TasksComponent } from './tasks/tasks.component';
import { toSignal } from '@angular/core/rxjs-interop';
@Component({
    selector: 'app-members-home',
    standalone: true,
    imports: [CommonModule, TasksComponent],
    templateUrl: './members-home.component.html', 
    styleUrls: ['./members-home.component.scss']
})
export class MembersHomeComponent implements OnInit {
  currentUser: TeamMember | null = null; 

  constructor() {}
  private membersService = inject(MembersService);

  ngOnInit(): void {
    // Fetch the current user and their tasks
    this.membersService.getCurrentUser().subscribe((user:any) => {
      this.currentUser = user;
    });
  }
  CurrentUser = toSignal(this.membersService.getCurrentUser());
  userTasks = computed(() => {
    const user = this.CurrentUser();
    if (!user) return [];
    return this.membersService.getTasksForUser(user.userID);
  });
  
}

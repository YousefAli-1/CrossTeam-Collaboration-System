import { Component, inject,Input } from '@angular/core';
import { MembersService } from '../../members.service';
import { Task } from '../../../app.model';
@Component({
  selector: 'app-members-approval-table',
  standalone: true,
  imports: [],
  templateUrl: './members-approval-table.component.html',
  styleUrl: './members-approval-table.component.scss'
})
export class MembersApprovalTableComponent {
   private allReviewTasks: Task[] = inject(MembersService).getReviewTasksForLoggedInUser();
 
   private _filterProjectName: String = '';
 
   @Input() 
   set filterProjectName(value: String) {
     this._filterProjectName = value;
     this.applyFilter();
   }
   get filterProjectName(): String {
     return this._filterProjectName;
   }
 
   reviewTasks: Task[] = this.allReviewTasks;
 
 
   private applyFilter(): void {
     if (this.filterProjectName) {
       this.reviewTasks = this.allReviewTasks.filter(task =>
         task.project.projectName === this.filterProjectName
       );
     } else {
       this.reviewTasks = this.allReviewTasks;
     }
   }
}

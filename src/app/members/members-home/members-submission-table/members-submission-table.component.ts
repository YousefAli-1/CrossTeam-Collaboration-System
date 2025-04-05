import { Component, inject,Input,OnChanges } from '@angular/core';
import { MembersService } from '../../members.service';
import { Task } from '../../../app.model';
@Component({
  selector: 'app-members-submission-table',
  standalone: true,
  imports: [],
  templateUrl: './members-submission-table.component.html',
  styleUrl: './members-submission-table.component.scss'
})


export class MembersSubmissionTableComponent {
  private allSubmissionTasks: Task[] = inject(MembersService).getSubmissionTasksForLoggedInUser();

  private _filterProjectName: String = '';

  @Input() 
  set filterProjectName(value: String) {
    this._filterProjectName = value;
    this.applyFilter();
  }
  get filterProjectName(): String {
    return this._filterProjectName;
  }

  submissionTasks: Task[] = this.allSubmissionTasks;


  private applyFilter(): void {
    if (this.filterProjectName) {
      this.submissionTasks = this.allSubmissionTasks.filter(task =>
        task.project.projectName === this.filterProjectName
      );
    } else {
      this.submissionTasks = this.allSubmissionTasks;
    }
  }
}

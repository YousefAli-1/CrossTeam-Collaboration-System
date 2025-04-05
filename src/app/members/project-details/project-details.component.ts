import { Component, inject, input, computed,signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { type User, type Project } from '../../app.model'
import { MembersSubmissionTableComponent } from '../members-home/members-submission-table/members-submission-table.component';
import { MembersApprovalTableComponent } from '../members-home/members-approval-table/members-approval-table.component';
import { MembersService } from '../members.service';
@Component({
  selector: 'app-project-details',
  imports: [MembersSubmissionTableComponent, MembersApprovalTableComponent],
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.scss'
})
export class ProjectDetailsComponent {
  private route = inject(ActivatedRoute);
  private membersService = inject(MembersService);

  currentProjectId = Number(this.route.snapshot.paramMap.get('projectId') || -1);
  project = signal<Project | null>(
    this.membersService.getProjectByProjectId(this.currentProjectId)
  );
  currentUser = signal<User | null>(this.membersService.loggedInUser()); 
}
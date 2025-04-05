import { Component, inject, input, computed,signal, Signal, OnInit } from '@angular/core';
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
export class ProjectDetailsComponent implements OnInit{
  private route = inject(ActivatedRoute);
  private membersService = inject(MembersService);

  currentProjectId= signal<number>(-1);

  ngOnInit(): void {
      this.route.url.subscribe({next: (currentRoute)=>{
        this.currentProjectId.set(Number(currentRoute[0]) || -1);
      }});
  }

  project = computed<Project | null>(()=>this.membersService.getProjectByProjectId(this.currentProjectId()));
  currentUser = signal<User | null>(this.membersService.loggedInUser()); 
}
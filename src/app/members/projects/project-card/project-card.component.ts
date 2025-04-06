import { Component, inject, input } from '@angular/core';
import { Project } from '../../../app.model';
import { RedirectCommand, Router } from '@angular/router';

@Component({
    selector: 'app-project-card',
    standalone: true,
    imports: [],
    host: {
      "(click)": "navigateToProjectPage()",
    },
    templateUrl: './project-card.component.html',
    styleUrl: './project-card.component.scss'
})
export class ProjectCardComponent {
  project = input.required<Project>();

  private router=inject(Router);
  navigateToProjectPage(){
    return this.router.navigateByUrl('/teamMember/projects/'+this.project().projectID);
  }
}
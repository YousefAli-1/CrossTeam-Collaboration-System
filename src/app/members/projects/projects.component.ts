import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectCardComponent } from './project-card/project-card.component';
import { MembersService } from '../members.service';
import { Project } from '../../app.model';

@Component({
    selector: 'app-projects',
    standalone: true,
    imports: [CommonModule, ProjectCardComponent],
    templateUrl: './projects.component.html',
    styleUrl: './projects.component.scss'
})
export class ProjectsComponent {
    private membersService = inject(MembersService);

    userProjects = computed<Project[]>(()=>this.membersService.projects());
}
import { Component, inject, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { ProjectCardComponent } from './project-card/project-card.component';
import { MembersService } from '../members.service';

@Component({
    selector: 'app-projects',
    standalone: true,
    imports: [CommonModule, ProjectCardComponent],
    templateUrl: './projects.component.html',
    styleUrl: './projects.component.scss'
})
export class ProjectsComponent {
    private membersService = inject(MembersService);

    currentUser = toSignal(this.membersService.getCurrentUser());

    userProjects = computed(() => {
        const user = this.currentUser();
        if (!user) return [];
        return this.membersService.getProjectsByUserId(user.userID);
    });
}
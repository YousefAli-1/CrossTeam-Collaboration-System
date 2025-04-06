import { Component, inject, computed } from '@angular/core';
import { ProjectManagerService } from '../project-manager.service';
import { type User } from '../../app.model' ;

@Component({
  selector: 'app-project-manager-home',
  imports: [],
  templateUrl: './project-manager-home.component.html',
  styleUrl: './project-manager-home.component.scss'
})
export class ProjectManagerHomeComponent {
  private projectManagerService = inject(ProjectManagerService);
  
  currentUser = computed<User | null>(()=>this.projectManagerService.loggedInUser()); 
}

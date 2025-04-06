import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-project-manager-tasks',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './project-manager-tasks.component.html',
  styleUrl: './project-manager-tasks.component.scss'
})
export class ProjectManagerTasksComponent {

}

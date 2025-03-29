import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [],
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.scss',
})
export class ProjectDetailsComponent {
  Project = signal<{ name: String; description: String }>({
    name: '',
    description: '',
  });

  private activatedRoute = inject(ActivatedRoute);
  ngOnInit() {
    this.activatedRoute.data.subscribe(({ Project }) => {
      this.Project.set(Project);
    });
  }
}

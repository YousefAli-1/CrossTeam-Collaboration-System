import { Component } from '@angular/core';
import { ProjectManagerService, Project } from '../project-manager.service';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { CreateProjectComponent } from './create-project/create-project.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-project-form',
  imports:[ReactiveFormsModule, NgFor, NgIf, CreateProjectComponent] ,
  templateUrl: './project-manager-projects.component.html',
  styleUrls: ['./project-manager-projects.component.scss'] 

})
export class ProjectManagerProjectsComponent {
  projects: Project[] = [];
  
  showCreateForm = false;

  constructor(private projectService: ProjectManagerService, private router: Router) {}


  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects() {
    this.projectService.getAll().subscribe({
      next: (data) => this.projects = data,
      error: (err) => console.error('Failed to load projects', err)
    });
  }

  openCreateForm() {
    // this.showCreateForm = true;
    this.router.navigate(['/projectManager/createProject']);


  }

  onProjectCreated(newProject: Project) {
    this.projects.push(newProject);
    this.showCreateForm = false;
  }
  cancelCreate() {
    this.showCreateForm = false;
  }
  deleteProject(id: number) {
    if (confirm('Are you sure you want to delete this project?')) {
      this.projectService.delete(id).subscribe({
        next: () => this.projects = this.projects.filter(p => p.projectId !== id),
        error: (err) => console.error('Delete failed', err)
      });
    }
  }

}

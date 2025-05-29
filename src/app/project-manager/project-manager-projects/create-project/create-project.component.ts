import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ProjectManagerService, Project } from '../../project-manager.service';
import { NgIf } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';



@Component({
  selector: 'app-create-project',
  imports:[NgIf, ReactiveFormsModule],
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss']
})
export class CreateProjectComponent {
  @Output() projectCreated = new EventEmitter<Project>();
  @Output() cancel = new EventEmitter<void>();

  
  projectForm = this.fb.group({
    projectName: ['', Validators.required],
    description: ['']
  });

  constructor(
    private fb: FormBuilder,
    private projectManagerService: ProjectManagerService  ,private router: Router){}
  onSubmit() {
  if (this.projectForm.valid) {
    const formValue = this.projectForm.value;

    
    const projectManagerId = 1;  
    const teamIds = [];      
    const memberIds = [];    
    const taskIds = [];      

const newProjectInput = {
  projectName: formValue.projectName ?? 'Test Project',
  description: formValue.description ?? '',
  projectManagerId: 1,
  teamIds: [] as number[],
  memberIds: [] as number[],
  taskIds: [] as number[]
};


    console.log('Sending project input:', newProjectInput);

    this.projectManagerService.create(newProjectInput).subscribe({
      next: (createdProject) => {this.projectCreated.emit(createdProject)
          this.router.navigate(['projectManager/projects'])
      },
      error: (error) => console.error('Project creation failed:', error)
    });
  }
}


  onCancel() {
    this.cancel.emit();
    this.router.navigate(['/projectManager/projects']);

  }
}

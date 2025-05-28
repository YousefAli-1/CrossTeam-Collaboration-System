import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-project-form',
  imports:[ReactiveFormsModule] ,
  templateUrl: './project-manager-projects.component.html',
  styleUrls: ['./project-manager-projects.component.scss'] 

})
export class ProjectManagerProjectsComponent {
  projectForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.projectForm = this.fb.group({
      projectName: ['', Validators.required],
      projectDescription: [''],
      createdBy: ['', Validators.required], 
      tasks: this.fb.array([]),
      members: this.fb.array([]),
      teams: this.fb.array([]),
      createdAt: [new Date()],
      updatedAt: [new Date()],
    });
  }

  get tasks() {
    return this.projectForm.get('tasks') as FormArray;
  }

  addTask() {
    this.tasks.push(this.fb.control(''));
  }

  get members() {
    return this.projectForm.get('members') as FormArray;
  }

  addMember() {
    this.members.push(this.fb.control(''));
  }

  get teams() {
    return this.projectForm.get('teams') as FormArray;
  }

  addTeam() {
    this.teams.push(this.fb.control(''));
  }

   onSubmit() {
    if (this.projectForm.valid) {
      const task = this.projectForm.value;
      console.log(task); 
  
      this.projectForm.reset();
    } else {
      console.error('Form is invalid');
    }
  }
}

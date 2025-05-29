import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectManagerService, Team, Project, Task } from '../../project-manager.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-create-task',
  imports:[ReactiveFormsModule, CommonModule],
  templateUrl: './create-tasks.component.html',
  styleUrls: ['./create-tasks.component.scss']
})
export class CreateTaskComponent implements OnInit {
  taskForm!: FormGroup;
  tasks: Task[] = [];
  projects: Project[] = [];
  teams: Team[] = [];

  @Output() taskCreated = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  constructor(private fb: FormBuilder, private pmService: ProjectManagerService, private router: Router,) {}

 ngOnInit() {
  this.taskForm = this.fb.group({
  taskName: ['', Validators.required],
  description: [''],
  deadline: [''],  
  teamId: ['', Validators.required],
  projectId: ['', Validators.required],
});

  this.pmService.getAll().subscribe({
    next: (projects) => {
      console.log('Loaded projects:', projects);  // ← Debug output
      this.projects = projects;
    },
    error: (err) => console.error('Error loading projects:', err)
  });

  this.pmService.getAllTeams().subscribe({
    next: (teams) => {
      console.log('Loaded teams:', teams);  // ← Debug output
      this.teams = teams;
    },
    error: (err) => console.error('Error loading teams:', err)
  });
}


  onSubmit() {
    if (this.taskForm.valid) {
      const formValue = this.taskForm.value;
      const taskPayload = {
      ...formValue,
      teamId: +formValue.teamId,
      projectId: +formValue.projectId,
    };

      this.pmService.createTask(taskPayload).subscribe({

        next: (task) =>{ this.taskCreated.emit(task)
          this.router.navigate(['projectManager/tasks'])
        },
        error: (err) => console.error('Task creation failed:', err),
      });
    }
  
  }

  onCancel() {
    this.cancel.emit();
    this.router.navigate(['/projectManager/tasks']); 

  }
}

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Task } from '../../app.model';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { CreateTasksComponent } from './create-tasks/create-tasks.component';



@Component({
  selector: 'app-task-creation',
  imports:[ReactiveFormsModule, NgFor, RouterLink, RouterLinkActive, NgIf, CommonModule, CreateTasksComponent],
  templateUrl: './project-manager-tasks.component.html',
  styleUrls: ['./project-manager-tasks.component.scss'],
  standalone: true,
})
export class ProjectManagerTasksComponent {

tasks: Task[] = []; // assume fetched from service/localStorage
constructor(private router: Router) {}

onCreateTask() {
this.router.navigate(['projectManager/createTasks'])
}
onTaskCreated(task: any){
  this.tasks.push(task);
}

onEditTask(task: Task) {
  // open edit form
}

onDeleteTask(taskID: number) {
this.tasks = this.tasks.filter(t => t.taskID !== taskID);
}

  
}

import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CreateTaskComponent } from './create-tasks/create-tasks.component';
import { ProjectManagerService, Team, Project, Task } from '../project-manager.service';




@Component({
  selector: 'app-task-creation',
  imports:[ReactiveFormsModule, NgFor, RouterLink, RouterLinkActive, NgIf, CommonModule, CreateTaskComponent],
  templateUrl: './project-manager-tasks.component.html',
  styleUrls: ['./project-manager-tasks.component.scss']
})
export class ProjectManagerTasksComponent {

tasks: Task[] = []; // assume fetched from service/localStorage
constructor(private router: Router, private pmService: ProjectManagerService) {}

onCreateTask() {
this.router.navigate(['projectManager/createTasks'])
}
onTaskCreated(task: any){
  this.tasks.push(task);
}

onEditTask(task: Task) {
  // open edit form
}
ngOnInit() {
  this.loadTasks();
}
loadTasks() {
  this.pmService.getAllTasks().subscribe(data => {
    this.tasks = data;
  });
}
deleteTask(taskId: number) {
  this.pmService.deleteTask(taskId).subscribe(() => {
    this.loadTasks(); // Refresh the list after deletion
  }, error => {
    console.error('Delete failed', error);
  });
}
onDeleteTask(taskID: number) {
this.tasks = this.tasks.filter(t => t.taskId !== taskID);
}
}

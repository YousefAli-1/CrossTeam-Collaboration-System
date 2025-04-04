import { Component, input } from '@angular/core';
import { Task } from '../../../app.model';
@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss'
})
export class TasksComponent {
task=input.required<Task>();
}

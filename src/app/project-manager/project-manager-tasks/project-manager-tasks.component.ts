import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-task-creation',
  imports:[ReactiveFormsModule],
  templateUrl: './project-manager-tasks.component.html',
  styleUrls: ['./project-manager-tasks.component.scss']
})
export class ProjectManagerTasksComponent {
  taskForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.taskForm = this.fb.group({
      taskName: ['', Validators.required],
      taskDescription: [''],
      deadline: ['', Validators.required],
      assigned: ['', Validators.required],
      isSubmitted: [false],
      submittedBy: [null],
      approvalWorkflow: this.fb.array([]),
      project: ['', Validators.required],
      createdAt: [new Date()],
      updatedAt: [new Date()],
    });
  }

  get approvalWorkflow() {
    return this.taskForm.get('approvalWorkflow') as FormArray;
  }

  addApprovalRequest() {
    this.approvalWorkflow.push(this.fb.control(''));
  }

  onSubmit() {
    if (this.taskForm.valid) {
      const task = this.taskForm.value;
      console.log(task); 
  
      this.taskForm.reset();
    } else {
      console.error('Form is invalid');
    }
  }
  
}

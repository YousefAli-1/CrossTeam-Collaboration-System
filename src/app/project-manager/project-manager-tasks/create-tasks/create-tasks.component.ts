import { Component, EventEmitter, Output, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';


@Component({
  selector: 'app-create-tasks',
  imports: [ReactiveFormsModule, NgFor],
  templateUrl: './create-tasks.component.html',
  styleUrl: './create-tasks.component.scss'
})

export class CreateTasksComponent {
taskForm: FormGroup;
@Output() taskCreated = new EventEmitter<any>();

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
      console.log('Task created',task);
      this.taskCreated.emit(task); 
  
      this.taskForm.reset();
      this.teams.clear();
      this.approvalWorkflow.clear();
    } else {
      console.error('Form is invalid');
    }
  }
  get teams() {
    return this.taskForm.get('teams') as FormArray;
  }
    addTeam() {
    this.teams.push(this.fb.control(''));
  }
}

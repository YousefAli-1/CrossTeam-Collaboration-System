import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-team-creation',
  imports:[ReactiveFormsModule],
  templateUrl: './project-manager-teams.component.html',
  styleUrls: ['./project-manager-teams.component.scss']
})
export class ProjectManagerTeamsComponent {
  teamForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.teamForm = this.fb.group({
      teamName: ['', Validators.required],
      teamDescription: [''],
      teamMembers: this.fb.array([], Validators.required)
    });
  }

  get teamMembers() {
    return this.teamForm.get('teamMembers') as FormArray;
  }

  addMember() {
    this.teamMembers.push(this.fb.group({
      memberID: [''],
      memberName: [''],
    }));
  }

  onSubmit() {
    if (this.teamForm.valid) {
      const team = this.teamForm.value; 
      console.log(team); 
      this.teamForm.reset();
    }
    else{
      console.error('Form is invalid');
    }
  }

 
}

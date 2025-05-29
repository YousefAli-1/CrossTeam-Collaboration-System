import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectManagerService, Project, Team, UserMember } from '../../project-manager.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-create-team',
  imports:[ReactiveFormsModule, CommonModule],
  templateUrl: './create-teams.component.html',
  styleUrls: ['./create-teams.component.scss'],
})
export class CreateTeamsComponent implements OnInit {
  teamForm: FormGroup;
  projects: Project[] = [];
  members: UserMember[] = [];
  

  constructor(
    private fb: FormBuilder,
    private pmService: ProjectManagerService,
    private router: Router
  ) {
    this.teamForm = this.fb.group({
      teamName: ['', Validators.required],
      description: [''],
      memberIds: [[]]  
    });
  }

ngOnInit() {
  this.loadProjects();
  this.loadMembers();
}
loadMembers() {
  this.pmService.getAllUsers().subscribe(data => {
    var memberusers= data.filter(user=>user.isProjectManager===false);
    console.log("not pm users",memberusers)
    this.members = memberusers
  });
}

loadProjects() {
  this.pmService.getAll().subscribe(data => {
    this.projects = data;
  });
}
  onSubmit() {
    if (this.teamForm.invalid) return;

    const newTeam = this.teamForm.value;
      const taskPayload = {
      ...newTeam,
      projectId: +newTeam.projectId,
    };


    this.pmService.createTeam(newTeam).subscribe({
      next: (team) => {
        alert(`Team "${team.teamName}" created successfully!`);
        this.router.navigate(['/projectManager/teams']); 
      },
      error: (err) => {
        console.error('Failed to create team', err);
        alert('Error creating team.');
      },
    });
  }

  onCancel() {
    this.router.navigate(['/projectManager/teams']);
  }
}

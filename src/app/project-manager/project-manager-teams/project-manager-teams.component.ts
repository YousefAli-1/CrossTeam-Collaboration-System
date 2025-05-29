      import { Component } from '@angular/core';
      import { FormBuilder, FormGroup, Validators, FormArray, FormsModule } from '@angular/forms';
      import { ReactiveFormsModule } from '@angular/forms';
      import { Project, ProjectDto, ProjectManagerService, Team } from '../project-manager.service';
      import { CommonModule, NgFor, NgIf } from '@angular/common';
  import { Router } from '@angular/router';


      @Component({
        selector: 'app-team-creation',
        imports:[ReactiveFormsModule,CommonModule,NgFor, FormsModule ],
        templateUrl: './project-manager-teams.component.html',
        styleUrls: ['./project-manager-teams.component.scss']
      })
      export class ProjectManagerTeamsComponent {
        teamForm: FormGroup;
        projects: Project[] = [];
        teams: Team[] = [];
        isEditMode = false;
        editingTeamId: number | null = null;
        constructor(private fb: FormBuilder, private pmService: ProjectManagerService, private router: Router) {
        this.teamForm = this.fb.group({
        teamName: ['', Validators.required],
        description: ['']
      });
    }
    selectedInviteTeamId: number | null = null;
    selectedProjectId: number | null = null;
    inviteSuccessMessage: string | null = null;

    toggleInviteDropdown(teamId: number): void {
    this.selectedInviteTeamId = this.selectedInviteTeamId === teamId ? null : teamId;
  }
  inviteToProject(teamId: number, projectId: string): void {
    if (!projectId) return;

    
    // this.pmService.assignProjectToTeam(+teamId, +projectId).subscribe(() => {
    //   this.loadTeams(); 
    //   this.selectedInviteTeamId = null; 
    // });
  }
  toggleInvite(teamId: number): void {
  this.selectedInviteTeamId = this.selectedInviteTeamId === teamId ? null : teamId;
  this.selectedProjectId = null; // reset selection
}

confirmInvite(teamId: number): void {
  if (this.selectedProjectId !== null) {
    const dto :ProjectDto ={
      team_id: teamId,
      project_id:this.selectedProjectId
    };
    this.pmService.createInvite(dto).subscribe(() => {
      this.loadTeams();
      this.inviteSuccessMessage = 'Project invitation sent successfully!';
      this.selectedInviteTeamId = null;
      this.selectedProjectId = null;
      setTimeout(() => {
        this.inviteSuccessMessage = null;
      }, 3000);
    });
  }
}

        ngOnInit() {
          this.loadTeams();
          this.loadProjects(); 
        }
        loadProjects() {
          this.pmService.getAll().subscribe(data => {
            this.projects = data;
          });
        }
        loadTeams() {
        this.pmService.getAllTeams().subscribe(data => this.teams = data);
    }

    getProjectName(projectId: number): string {
      const project = this.projects.find(p => p.projectId === projectId);
      return project ? project.projectName : 'N/A';
    }


    onCreateTeam() {
      this.isEditMode = false;
      this.editingTeamId = null;
      this.teamForm.reset();
      this.router.navigate(['/projectManager/createTeam']);

    }

    onEditTeam(teamId: number) {
      const team = this.teams.find(t => t.teamId === teamId);
      if (team) {
        this.isEditMode = true;
        this.editingTeamId = teamId;
        this.teamForm.patchValue({
          teamName: team.teamName,
          description: team.description
        });
      }
    }

    onSubmitTeam() {
      const teamData = this.teamForm.value;
      if (this.isEditMode && this.editingTeamId !== null) {
        this.pmService.updateTeam(this.editingTeamId, teamData).subscribe(() => this.loadTeams());
      } else {
        this.pmService.createTeam(teamData).subscribe(() => this.loadTeams());
      }
      this.teamForm.reset();
      this.isEditMode = false;
    }

    deleteTeam(teamId: number) {
      this.pmService.deleteTeam(teamId).subscribe(() => this.loadTeams());
    }
  }

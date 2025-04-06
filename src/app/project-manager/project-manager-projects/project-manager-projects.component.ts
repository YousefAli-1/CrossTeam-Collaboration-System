import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgModule } from '@angular/core';
import { Project } from '../../app.model';

@Component({
  selector: 'app-project-manager-projects',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './project-manager-projects.component.html',
  styleUrl: './project-manager-projects.component.scss'
})


export class ProjectManagerProjectsComponent {
  

}
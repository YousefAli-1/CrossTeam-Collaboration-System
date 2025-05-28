import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectManagerTeamsComponent } from './project-manager-teams.component';

describe('ProjectManagerTeamsComponent', () => {
  let component: ProjectManagerTeamsComponent;
  let fixture: ComponentFixture<ProjectManagerTeamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectManagerTeamsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectManagerTeamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

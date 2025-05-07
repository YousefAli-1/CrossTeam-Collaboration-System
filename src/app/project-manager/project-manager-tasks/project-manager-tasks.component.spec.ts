import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectManagerTasksComponent } from './project-manager-tasks.component';

describe('ProjectManagerTasksComponent', () => {
  let component: ProjectManagerTasksComponent;
  let fixture: ComponentFixture<ProjectManagerTasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectManagerTasksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectManagerTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

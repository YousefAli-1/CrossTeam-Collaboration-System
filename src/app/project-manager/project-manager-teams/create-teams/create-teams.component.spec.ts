import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTeamsComponent } from './create-teams.component';

describe('CreateTasksComponent', () => {
  let component: CreateTeamsComponent;
  let fixture: ComponentFixture<CreateTeamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateTeamsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateTeamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

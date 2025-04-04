import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembersSubmissionTableComponent } from './members-submission-table.component';

describe('MembersSubmissionTableComponent', () => {
  let component: MembersSubmissionTableComponent;
  let fixture: ComponentFixture<MembersSubmissionTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MembersSubmissionTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MembersSubmissionTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

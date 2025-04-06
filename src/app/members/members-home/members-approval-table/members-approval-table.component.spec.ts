import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembersApprovalTableComponent } from './members-approval-table.component';

describe('MembersApprovalTableComponent', () => {
  let component: MembersApprovalTableComponent;
  let fixture: ComponentFixture<MembersApprovalTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MembersApprovalTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MembersApprovalTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

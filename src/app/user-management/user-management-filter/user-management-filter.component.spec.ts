import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserManagementFilterComponent } from './user-management-filter.component';

describe('UserManagementFilterComponent', () => {
  let component: UserManagementFilterComponent;
  let fixture: ComponentFixture<UserManagementFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserManagementFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserManagementFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

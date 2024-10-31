import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserManagementAddEditComponent } from './user-management-add-edit.component';

describe('UserManagementAddEditComponent', () => {
  let component: UserManagementAddEditComponent;
  let fixture: ComponentFixture<UserManagementAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserManagementAddEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserManagementAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

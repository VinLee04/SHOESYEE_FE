import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ControlContainer, FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccessManagementService } from './access-management.service';
import { Permission, Role, RolePermissionRequest } from '../interface/Access';
import { AuthService } from '../common/service/auth.service';


@Component({
  selector: 'app-access-management',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './access-management.component.html',
  styleUrl: './access-management.component.scss',
})
export class AccessManagementComponent implements OnInit {
  roles: Role[] = [];
  permissions: Permission[] = [];
  selectedRole: Role | null = null;
  selectedPermissions: Permission[] = [];
  availablePermissions: Permission[] = [];

  showRoleModal = false;
  showPermissionModal = false;
  editingRole = false;
  editingPermission = false;

  roleForm: FormGroup;
  permissionForm: FormGroup;

  roleWithPermissions: RolePermissionRequest = {
    role: {
      id: '',
      description: '',
    },
    permissionRequestList: [],
  };

  constructor(
    private fb: FormBuilder,
    private accessService: AccessManagementService,
    private auth: AuthService
  ) {
    this.roleForm = this.fb.group({
      id: ['', Validators.required],
      description: ['', Validators.required],
      permissions: this.fb.array([]),
    });

    this.permissionForm = this.fb.group({
      id: ['', Validators.required],
      description: ['', Validators.required],
      roleId: [''],
    });
  }

  ngOnInit() {
    this.loadMockData();
  }

  updateAvailablePermissions() {
    this.availablePermissions = this.permissions.filter((p) => !p.roleId);
  }

  loadMockData() {
    this.accessService.getRoles().subscribe({
      next: (response) => {
        this.roles = response;
        this.updateAvailablePermissions();
      },
    });

    this.accessService.getPermissions().subscribe({
      next: (response) => {
        this.permissions = response;
        this.updateAvailablePermissions();
      },
    });
  }

  get permissionsFormArray() {
    return this.roleForm.get('permissions') as FormArray;
  }

  addPermissionToForm() {
    const permissionGroup = this.fb.group({
      id: ['', Validators.required],
      description: ['', Validators.required],
      roleId: [''],
    });
    this.permissionsFormArray.push(permissionGroup);
  }

  removePermissionFromForm(index: number) {
    this.permissionsFormArray.removeAt(index);
  }

  getPermissionCount(roleId: string): number {
    return this.permissions.filter((p) => p.roleId === roleId).length;
  }

  getPermissionsByRole(roleId: string): Permission[] {
    return this.permissions.filter((p) => p.roleId === roleId);
  }

  showAddRoleModal() {
    this.editingRole = false;
    this.roleForm.reset();
    this.selectedPermissions = [];
    while (this.permissionsFormArray.length) {
      this.permissionsFormArray.removeAt(0);
    }
    this.showRoleModal = true;
  }

  editRole(role: Role) {
    this.editingRole = true;
    while (this.permissionsFormArray.length) {
      this.permissionsFormArray.removeAt(0);
    }

    this.roleForm.patchValue({
      id: role.id,
      description: role.description,
    });

    const rolePermissions = this.getPermissionsByRole(role.id);
    this.selectedPermissions = [...rolePermissions];

    rolePermissions.forEach((permission) => {
      const permissionGroup = this.fb.group({
        id: [permission.id, Validators.required],
        description: [permission.description, Validators.required],
        roleId: [role.id],
      });
      this.permissionsFormArray.push(permissionGroup);
    });

    this.showRoleModal = true;
  }

  submitRole() {
    if (this.roleForm.valid) {
      const roleData: Role = {
        id: this.roleForm.get('id')?.value,
        description: this.roleForm.get('description')?.value
      }

      const permissionsList: Permission[] = this.permissionsFormArray.controls.map((control) => ({
        id: control.get('id')?.value,
        description: control.get('description')?.value,
        roleId: roleData.id
      }))

      const roleWithPermissions: RolePermissionRequest = {
        role: roleData,
        permissionRequestList: permissionsList
      }

      if (this.editingRole) {
        this.accessService
          .updateRoleWithPermissions(roleWithPermissions)
          .subscribe({
            next: (response) => {
              if(response.success){
                const index = this.roles.findIndex((r) => r.id === roleData.id);
                if (index !== -1) {
                  this.roles[index] = roleData;
                  this.permissions = this.permissions.filter(
                    (p) => p.roleId !== roleData.id
                  );
                  this.permissions = [...this.permissions, ...permissionsList];
                }
                this.closeRoleModal();
              }
            },
          });
      } else {
        this.accessService
          .createRoleWithPermissions(roleWithPermissions)
          .subscribe({
            next: (response) => {
              if(response.success){
                this.roles.push(roleData);
                this.permissions = [...this.permissions, ...permissionsList];
                this.closeRoleModal();
              }
            },
          });
      }
    }
  }

  showAddPermissionModal() {
    this.editingPermission = false;
    this.permissionForm.reset();
    this.permissionForm.patchValue({ roleId: this.selectedRole?.id });
    this.showPermissionModal = true;
  }

  editPermission(permission: Permission) {
    this.editingPermission = true;
    this.permissionForm.patchValue(permission);
    this.showPermissionModal = true;
  }

  deleteRole(role: Role) {
    if (confirm(`Are you sure you want to delete role ${role.id}?`)) {
      this.accessService.deleteRole(role.id).subscribe({
        next: (response) => {
          if (response.success) {
            this.roles = this.roles.filter((r) => r.id !== role.id);
            this.permissions = this.permissions.filter(
              (p) => p.roleId !== role.id
            );
            if (this.selectedRole?.id === role.id) {
              this.selectedRole = null;
            }
            this.updateAvailablePermissions();
          }
        },
      });
    }
  }

  deletePermission(permission: Permission) {
    if (
      confirm(`Are you sure you want to delete permission ${permission.id}?`)
    ) {
      this.permissions = this.permissions.filter((p) => p.id !== permission.id);
      this.accessService.deletePermission(permission.id).subscribe({
        next: () => {
          this.updateAvailablePermissions();
        },
      });
    }
  }

  showPermissions(role: Role) {
    this.selectedRole = role;
    setTimeout(() => {
      this.auth.scrollToBottom();
    }, 100);
  }

  closeRoleModal() {
    this.showRoleModal = false;
    this.roleForm.reset();
    this.selectedPermissions = [];
    this.selectedRole = null;
    this.updateAvailablePermissions();
  }

  submitPermission() {
    if (this.permissionForm.valid) {
      const permissionData = {
        ...this.permissionForm.value,
        roleId: this.selectedRole?.id,
      };
      if (this.editingPermission) {
        const index = this.permissions.findIndex(
          (p) => p.id === permissionData.id
        );
        if (index !== -1) {
          this.permissions[index] = permissionData;
        }
        this.accessService
          .updatePermission(this.permissionForm.value)
          .subscribe({
            next: () => {
              this.updateAvailablePermissions();
            },
          });
      } else {
        this.accessService
          .createPermission(this.permissionForm.value)
          .subscribe({
            next: (response) => {
              if (response.success) {
                this.permissions.push(permissionData);
                this.updateAvailablePermissions();
              }
            },
          });
      }
      this.closePermissionModal();
    }
  }

  closePermissionModal() {
    this.showPermissionModal = false;
    this.permissionForm.reset();
  }
}
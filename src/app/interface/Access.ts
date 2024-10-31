

export interface Role {
  id: string;
  description: string;
}

export interface Permission {
  id: string;
  description: string;
  roleId: string;
}

export interface RolePermissionRequest {
  role: Role;
  permissionRequestList: Permission[];
}
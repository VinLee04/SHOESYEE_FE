export interface User {
  id: number;
  name: string;
  email: string;
  address: string;
  password: string;
  phone: string;
  gender: boolean;
  img: string;
  active: boolean;
}

export interface UserInfo {
  id: string;
  username: string;
  email: string;
  role: { id: string; description: string };
  birthdate: any;
  phone: string;
  image: string;
  address?: string;
  gender?: string;
  totalOrder?: string;
  totalExpenditure?: string;
}


export interface StaffCreationRequest {
  username: string;
  email: string;
  phone: string;
  gender: boolean;
  birthdate: string;
  address: string;
  salary: number;
  password: string;
  confirmPassword: string;
  roleId: string;
  isActive: boolean;
}

export interface UserResponse {
  id: string;
  username: string;
  email: string;
  // Add other response fields as needed
}
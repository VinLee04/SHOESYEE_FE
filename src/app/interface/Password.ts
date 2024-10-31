export interface ResetPasswordRequest {
  email: string;
}

export interface ResetPasswordResponse {
  message?: string;
  counter?: number;
  remainingTime?: number;
}

export interface VerifyCodeRequest {
  email: string;
  code: string;
  newPassword: string;
}

export interface ResetPasswordForm extends VerifyCodeRequest {
  confirmPassword: string;
}
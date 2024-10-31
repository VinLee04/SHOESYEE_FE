import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export class CustomValidators {
  static password(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);

    const isValid = hasUpperCase && hasLowerCase && hasNumber;

    return isValid ? null : { invalidPassword: true };
  }

  static matchPasswords(
    passwordKey: string,
    confirmPasswordKey: string
  ): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get(passwordKey);
      const confirmPassword = control.get(confirmPasswordKey);

      if (!password || !confirmPassword) return null;

      return password.value === confirmPassword.value
        ? null
        : { passwordMismatch: true };
    };
  }
}

export class ChangePasswordDto {
  constructor(oldPassword, newPassword, confirmPassword) {
    this.oldPassword = oldPassword;
    this.newPassword = newPassword;
    this.confirmPassword = confirmPassword;
  }
}


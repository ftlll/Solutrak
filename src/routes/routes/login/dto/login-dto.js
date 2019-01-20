export class LoginDto {
  constructor(email, password, rememberMe) {
    this.email = email;
    this.password = password;
    this.rememberMe = rememberMe;
  }
}

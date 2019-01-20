export class UpdateProfileDto {
  constructor(firstName, lastName, phoneNumber, mobileNumber) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.phoneNumber = phoneNumber;
    this.mobileNumber = mobileNumber;
  }
}

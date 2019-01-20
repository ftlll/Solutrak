export class UserLoggedIn {
  constructor(user) {
    this.user = user;
  }
}

export class SectionLoaded {
  constructor(section) {
    this.section = section;
  }
}

export class ForgotPasswordWasSubmitted {
  constructor(response) {
    this.response = response;
  }
}

export class PasswordWasReset {
  constructor(response) {
    this.response = response;
  }
}

export class BuildingSelected {
  constructor(response) {
    this.response = response;
  }
}

export class DeviceInfoReceived {
  constructor(data) {
    this.data = data;
  }
}

export class DeviceEventReceived {
  constructor(data) {
    this.data = data;
  }
}

export class DeviceAcknowledgementReceived {
  constructor(data) {
    this.data = data;
  }
}

export class UserLoggedOut {
  constructor() { }
}

export class DeviceSelected {
  constructor(id) {
    this.id = id;
  }
}

export class DeviceMarkerSelected {
  constructor(id) {
    this.id = id;
  }
}

export class SignalRHubConnected {
  constructor(data) {
    this.data;
  }
}

export class IProfileDataUpdateResponse {
  constructor() {
    this.firstName;
    this.lastName;
    this.phoneNumber;
    this.mobileNumber;
  }
}

export class ProfileDataUpdated {
  constructor(payload) {
    this.payload = payload;
  }
}

export class ProfileImageUpdated {
  constructor(url) {
    this.url = url;
  }
}

export class AccountPasswordChanged {
  constructor(response) {
    this.response = response;
  }
}

export class NotificationArrived {
  constructor(data) {
    this.data = data;
  }
}

export class NotificationRead {
  constructor(data) {
    this.data = data;
  }
}

export class SettingsDateRangeChanged {
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }
}

export interface TenantForAdminMail {
  userEmail: string;
}

export interface UserWelcomeMail {
  userEmail: string;
  userName: string;
  tempPassword: string;
}

export interface PasswordChangedMail {
  userEmail: string;
  userName: string;
}

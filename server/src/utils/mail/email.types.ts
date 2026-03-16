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

export interface OtpMail {
  userEmail: string;
  userName: string;
  otp: number;
}

export interface PasswordResetMail {
  userEmail: string;
  userName: string;
  newPassword: string;
}

export interface TaskReminderJobPayload {
  userEmail: string;
  userFirstName: string;
  taskTitle: string;
  taskDescription?: string;
  dueDate?: string;
}

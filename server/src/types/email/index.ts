export interface TenantForAdminMail {
  userEmail: string;
}

export interface UserWelcomeMail {
  userEmail: string;
  userName: string;
  tempPassword: string;
}

export interface PlanChangeMail {
  userEmail: string;
  tenantName: string;
  oldPlan: string;
  newPlan: string;
}

export interface PasswordChangedMail {
  userEmail: string;
  userName: string;
}

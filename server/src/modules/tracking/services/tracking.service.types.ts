export interface IRecordEmailOpenInput {
  trackingId: string;
  ipAddress: string | string[] | undefined;
  userAgent: string | undefined;
}

export interface IRecordEmailClickInput {
  trackingId: string;
  url: string;
  ipAddress: string | string[] | undefined;
  userAgent: string | undefined;
}

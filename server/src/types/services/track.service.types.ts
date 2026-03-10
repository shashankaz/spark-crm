export interface RecordEmailOpenInput {
  trackingId: string;
  ipAddress: string | string[] | undefined;
  userAgent: string | undefined;
}

export interface RecordEmailClickInput {
  trackingId: string;
  url: string;
  ipAddress: string | string[] | undefined;
  userAgent: string | undefined;
}

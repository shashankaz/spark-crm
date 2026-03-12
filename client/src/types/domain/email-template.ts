export interface IEmailTemplate {
  _id: string;

  name: string;
  subject: string;
  bodyHtml: string;
  tags: string[];

  createdAt: string;
  updatedAt: string;
}

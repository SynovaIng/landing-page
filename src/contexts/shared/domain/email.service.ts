import type { ReactElement } from "react";

export interface SendEmailInput {
  from: string;
  to: string | string[];
  subject: string;
  react?: ReactElement;
  html?: string;
  text?: string;
  replyTo?: string | string[];
}

export abstract class EmailService {
  abstract send(input: SendEmailInput): Promise<void>;
}

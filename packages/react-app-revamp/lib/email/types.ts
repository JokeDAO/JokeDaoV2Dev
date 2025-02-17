// these are the template ids for the emails from Brevo
export enum EmailType {
  SignUpConfirmation = 20,
  VotingEmail = 11,
  EntryEmail = 18,
}

export interface VotingEmailParams {
  contest_link: string;
  contest_end_date: string;
}

export interface EntryEmailParams {
  contest_voting_open_date: string;
  contest_end_date: string;
}

// create a subset of EmailType that requires parameters
export type EmailTypeWithParams = EmailType.VotingEmail | EmailType.EntryEmail;

export type EmailTypeParams = {
  [K in EmailTypeWithParams]: K extends EmailType.VotingEmail ? VotingEmailParams : EntryEmailParams;
};

export interface EmailRecipient {
  email: string;
  name?: string;
}

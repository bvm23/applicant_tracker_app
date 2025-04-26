export interface Applicant {
  id: string;
  name: string;
  role: string;
  stage: string;
  email: string;
  hiringManager: string;
  attachments: string;
  website: string;
  skills: string[];
  location: string;
  employment: 'looking' | 'freelance' | 'employed';
  source: string;
  added: string;
}

export type InputApplicantData = Omit<
  Applicant,
  'id' | 'attachments' | 'website' | 'employment' | 'source' | 'added'
>;

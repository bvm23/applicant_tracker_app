import { type Applicant } from '../../features/summary/applicant.model';
import { icons } from './icons.constants';

export const SwitchActionButtonData: {
  icon: string;
  name: string;
  view: string;
}[] = [
  {
    icon: icons['GROUP'],
    name: 'by stage',
    view: 'STAGE',
  },
  {
    icon: icons['TABLE'],
    name: 'all applicants',
    view: 'ALL',
  },
  {
    icon: icons['TABLE'],
    name: 'engineering',
    view: 'ENGINEERING',
  },
];

export const ModifierActionButtonData: {
  icon: string;
  name: string;
  view: string;
}[] = [
  {
    icon: icons['SORT'],
    name: 'sort',
    view: 'SORT',
  },
  {
    icon: icons['SEARCH'],
    name: 'search',
    view: 'SEARCH',
  },
];

export const Stages = [
  { name: 'Lead', value: 'lead' },
  { name: 'Screen', value: 'screen' },
  { name: 'Interview', value: 'interview' },
  { name: 'Offer', value: 'offer' },
  { name: 'Hired', value: 'hired' },
];

export const Keys = [
  'name',
  'role',
  'stage',
  'email',
  'hiringManager',
  'attachments',
  'website',
  'skills',
  'location',
  'employment',
  'source',
  'added',
];

export const ApplicantPlaceholder: Applicant = {
  id: '',
  name: '',
  role: '',
  stage: '',
  email: '',
  hiringManager: '',
  attachments: '',
  website: '',
  skills: [],
  location: '',
  employment: 'looking',
  source: '',
  added: '',
};

export const SampleData: Partial<Applicant>[] = [
  {
    attachments: '',
    email: 'carriesandoval@notion.so',
    employment: 'employed',
    hiringManager: 'harrison medoff',
    location: 'san francisco',
    name: 'carrie sandoval',
    role: 'vp of marketing',
    skills: ['back end', 'writing'],
    source: 'cold inbound',
    stage: 'lead',
    website: 'github.com',
  },
  {
    attachments: '',
    email: 'michaelkim@notion.so',
    employment: 'looking',
    hiringManager: 'karunya',
    location: 'new york',
    name: 'michael kim',
    role: 'engineering - front end',
    skills: ['front end', 'jquery'],
    source: 'referral',
    stage: 'hired',
    website: 'linkedin.com',
  },
  {
    attachments: '',
    email: 'kim.sanders@notion.so',
    employment: 'employed',
    hiringManager: 'harrison medoff',
    location: 'new york',
    name: 'kim sanders',
    role: 'engineering - back end',
    skills: ['front end', 'back end'],
    source: 'angellist',
    stage: 'screen',
    website: 'linkedin.com',
  },
  {
    attachments: '',
    email: 'tim@notion.so',
    employment: 'employed',
    hiringManager: 'david choi',
    location: 'tokyo',
    name: 'tim badoshi',
    role: 'support lead',
    skills: ['writing', 'social', 'excel'],
    source: 'referral',
    stage: 'interview',
    website: 'timbakshi.com',
  },
  {
    attachments: 'resume.pdf',
    email: 'hertzfeld@notion.so',
    employment: 'looking',
    hiringManager: 'shawn sanchez',
    location: 'san francisco',
    name: 'andy hertzfeld',
    role: 'design',
    skills: ['ux', 'ui', 'front end'],
    source: 'referral',
    stage: 'lead',
    website: 'dribbble.com',
  },
  {
    attachments: '',
    email: 'jim@notion.so',
    employment: 'looking',
    hiringManager: 'shawn sanchez',
    location: 'tokyo',
    name: 'jim kramer',
    role: 'support lead',
    skills: ['growth', 'java'],
    source: 'cold inbound',
    stage: 'screen',
    website: 'linkedin.com',
  },
];

export const StageColors = {
  green: '#13814a',
  blue: '#22648d',
  red: '#792223',
  orange: '#965218',
  yellow: '#8a6d0d',
  grey: '#353535',
};

export const Colors = {
  ultraDarkGreen: '#1F3A2B',
  darkTealBlue: '#1F323C',
  darkBloodRed: '#4C0C0C',
  blackCherry: '#3E0A1F',
  deepRoyalPurple: '#3A1F44',
  midnightMoss: '#1C2F29',
  darkCobaltBlue: '#2C3E5B',
  bloodOrange: '#4E1D06',
  walnutBrown: '#4B2A1B',
  darkerTeal1: '#0F4E4A',
  deepBurgundy: '#5C0A1F',
  darkSlateBlue: '#2E3B5D',
  deepOlive: '#3C4A3D',
  deepChocolate: '#3E2A47',
  deepIndigo: '#2A1F44',
  deepCoral: '#7F3A3A',
  deepCyan: '#006F6F',
  charcoalGrey: '#333333',
  deepPlum: '#3B1C2F',
  deepTealGreen: '#0A4A44',
};

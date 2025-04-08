import { icons } from './icons.constants';

export const Data = [
  {
    id: '0.11259289307257725',
    name: 'kim sanders',
    role: 'engineering - front end',
    stage: 'screen',
    email: 'kim.sanders@notion.so',
    hiringManager: 'harrison medoff',
    attachments: '',
    website: 'linkedin.com',
    skills: ['front end', 'back end'],
    location: 'new york',
    employment: 'employed',
    source: 'angellist',
    added: '2025-04-08T06:35:58.000Z',
  },
  {
    id: '0.11259289307257735',
    name: 'jim kramer',
    role: 'vp of marketing',
    stage: 'hired',
    email: 'jim@notion.so',
    hiringManager: 'shawn sanchez',
    attachments: '',
    website: 'linkedin.com',
    skills: ['growth', 'social'],
    location: 'san francisco',
    employment: 'looking',
    source: 'cold inbound',
    added: '2025-04-08T10:22:15.000Z',
  },
  {
    id: '0.11259289307057725',
    name: 'andy hertzfeld',
    role: 'design',
    stage: 'lead',
    email: 'hertzfeld@notion.so',
    hiringManager: 'karunya',
    attachments: 'resume.pdf',
    website: 'dribbble.com',
    skills: ['ux', 'ui', 'front end'],
    location: 'san francisco',
    employment: 'looking',
    source: 'referral',
    added: '2025-04-09T14:30:42.123Z',
  },
  {
    id: '0.1125928931257725',
    name: 'tim bakshi',
    role: 'support lead',
    stage: 'screen',
    email: 'tim@notion.so',
    hiringManager: 'jenne nguyen',
    attachments: '',
    website: 'timbakshi.com',
    skills: ['writing', 'social'],
    location: 'tokyo',
    employment: 'employed',
    source: 'referral',
    added: '2025-04-10T03:00:00.000Z',
  },
  {
    id: '0.11259289307457725',
    name: 'carrie sandoval',
    role: 'engineering - ops',
    stage: 'interview',
    email: 'carriesandoval@notion.so',
    hiringManager: 'camille ricketts',
    attachments: '',
    website: 'github.com',
    skills: ['back end', 'platform'],
    location: 'new york',
    employment: 'freelance',
    source: 'cold inbound',
    added: '2025-04-12T21:59:59.999Z',
  },
  {
    id: '0.11259289307227725',
    name: 'michael kim',
    role: 'engineering - front end',
    stage: 'lead',
    email: 'michaelkim@notion.so',
    hiringManager: 'david choi',
    attachments: '',
    website: 'linkedin.com',
    skills: ['front end'],
    location: 'new york',
    employment: 'looking',
    source: 'referral',
    added: '2025-05-01T12:00:00.000Z',
  },
];

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
    icon: icons['FILTER'],
    name: 'filter',
    view: 'FILTER',
  },
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

export const Keys = Object.keys(Data[1]).filter((valKey) => valKey !== 'id');

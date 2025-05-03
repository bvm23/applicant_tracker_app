import { Routes } from '@angular/router';
import {
  ApplicantInfoComponent,
  appplicantFound,
} from './features/summary/applicant-info/applicant-info.component';

export const routes: Routes = [
  {
    path: 'info/:uid',
    component: ApplicantInfoComponent,
    pathMatch: 'full',
    resolve: {
      applicant: appplicantFound,
    },
  },
];

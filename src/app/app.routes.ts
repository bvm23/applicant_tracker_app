import { Routes } from '@angular/router';
import { ApplicantInfoComponent } from './features/summary/applicant-info/applicant-info.component';

export const routes: Routes = [
  { path: 'info/:uid', component: ApplicantInfoComponent },
];

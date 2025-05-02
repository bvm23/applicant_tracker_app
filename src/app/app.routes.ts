import { Routes } from '@angular/router';
import { ApplicantInfoComponent } from './features/summary/applicant-info/applicant-info.component';
import { AppComponent } from './app.component';

export const routes: Routes = [
  {
    path: 'info/:uid',
    component: ApplicantInfoComponent,
    pathMatch: 'full',
  },
];

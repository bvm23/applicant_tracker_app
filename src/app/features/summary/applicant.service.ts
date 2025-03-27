import { Injectable, signal } from '@angular/core';
import { Applicant } from './applicant.model';
import { Data } from '../../core/constants/data.constants';

@Injectable({
  providedIn: 'root',
})
export class ApplicantService {
  private applicants = signal<Applicant[]>([]);

  constructor() {
    this.applicants.set(Data);
  }

  allApplicants = this.applicants.asReadonly();
}

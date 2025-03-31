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

  addApplicant(user: Applicant, isDuplicate: boolean = false) {
    let duplicateUser: Applicant;
    if (isDuplicate) {
      duplicateUser = { ...user };
      let newUserId = Math.random().toString();
      duplicateUser.id = newUserId;
    }
    this.applicants.update((existing) => [
      ...existing,
      isDuplicate ? duplicateUser : user,
    ]);
  }

  deletApplicant(userId: string) {
    this.applicants.set(this.applicants().filter((appl) => appl.id !== userId));
  }
}

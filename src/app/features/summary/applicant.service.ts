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
    let newUser = isDuplicate
      ? { ...user, id: Math.random().toString() }
      : user;
    this.applicants.update((existing) => [...existing, newUser]);
  }

  updateApplicant(userId: string, newData: Record<string, string>) {
    const applicantsList = this.applicants();
    const user = applicantsList.find((usr) => usr.id === userId);

    if (user) {
      Object.assign(user, newData);
      this.applicants.set([...applicantsList]);
    }
  }

  deletApplicant(userId: string) {
    this.applicants.set(this.applicants().filter((appl) => appl.id !== userId));
  }
}

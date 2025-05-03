import { Injectable, signal } from '@angular/core';
import { Applicant } from './applicant.model';
import { Data, Stages } from '../../core/constants/data.constants';
import { BehaviorSubject } from 'rxjs';
import { type InputApplicantData } from './applicant.model';

@Injectable({
  providedIn: 'root',
})
export class ApplicantService {
  private applicants = signal<Applicant[]>([]);
  selectedApplicantId$ = new BehaviorSubject<string | undefined>(undefined);

  constructor() {
    this.applicants.set(Data as Applicant[]);
  }

  stages = Stages;
  allApplicants = this.applicants.asReadonly();

  getApplicantsByStage(applicants: Applicant[]) {
    return this.stages.map((stage) => {
      let stageData: {
        name: string;
        value: string;
        people: Applicant[];
        peopleCount: number;
      } = {
        name: stage.name,
        value: stage.value,
        people: [],
        peopleCount: 0,
      };
      let filteredApplicants = applicants.filter(
        (ap) => ap.stage === stage.value
      );
      stageData.people = filteredApplicants;
      stageData.peopleCount = filteredApplicants.length;
      return stageData;
    });
  }

  getApplicantById(userId: string) {
    return this.applicants().find((ap) => ap.id === userId);
  }

  addApplicant(inputData: InputApplicantData) {
    const newApplicant: Applicant = {
      ...inputData,
      attachments: '',
      source: '',
      website: '',
      employment: 'looking',
      id: Math.random().toString(),
      added: new Date().toISOString(),
    };
    this.applicants.update((existing) => [...existing, newApplicant]);
    return;
  }

  duplicateApplicant(id: string) {
    const user = this.applicants().find((ap) => ap.id === id);
    if (!user) return;
    let duplicateUser = {
      ...user,
      id: Math.random().toString(),
      added: new Date().toISOString(),
    };
    this.applicants.update((existing) => [...existing, duplicateUser]);
  }

  selectApplicant(userId: string) {
    this.selectedApplicantId$.next(userId);
  }

  updateApplicant(userId: string, newData: Record<string, string | string[]>) {
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

  removeSelectedApplicant() {
    this.selectedApplicantId$.next(undefined);
  }
}

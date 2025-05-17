import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { type Applicant } from './applicant.model';
import { Stages } from '../../core/constants/data.constants';
import { BehaviorSubject } from 'rxjs';
import { DbService } from '../../shared/services/db.service';
import { type Comment } from './comment.model';

@Injectable({
  providedIn: 'root',
})
export class ApplicantService {
  private destroyRef = inject(DestroyRef);
  private dbService = inject(DbService);
  private applicants = signal<Applicant[]>([]);
  private comments = signal<Comment[]>([]);
  selectedApplicantId$ = new BehaviorSubject<string | undefined>(undefined);

  constructor() {
    const fetchDataSubscription = this.dbService.getAllData().subscribe({
      next: (data) => {
        this.applicants.set(data || []);
      },
    });

    const commentsSubscription = this.dbService.comments$.subscribe({
      next: (fetchedComments) => {
        this.comments.set(fetchedComments || []);
      },
    });

    this.destroyRef.onDestroy(() => {
      fetchDataSubscription.unsubscribe();
      commentsSubscription.unsubscribe();
    });
  }

  private stages = Stages;
  allApplicants = this.applicants.asReadonly();
  allComments = this.comments.asReadonly();

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

  addApplicant(inputData: Applicant) {
    this.applicants.update((current) => [...current, inputData]);
    return this;
  }

  duplicateApplicant(id: string) {
    const user = this.applicants()?.find((ap) => ap.id === id);
    if (!user) return;
    let duplicateUser = {
      ...user,
      id: Math.random().toString(),
      added: new Date().toISOString(),
    };
    this.applicants.update((existing) => [...(existing || []), duplicateUser]);
  }

  selectApplicant(userId: string) {
    this.selectedApplicantId$.next(userId);
  }

  updateApplicant(userId: string, newData: Record<string, string | string[]>) {
    const applicantsList = [...this.applicants()];
    const user = applicantsList?.find((usr) => usr.id === userId);
    if (user) {
      Object.assign(user, newData);
      this.applicants.set(applicantsList);
    }
  }

  deleteApplicant(userId: string) {
    this.applicants.set(this.applicants().filter((appl) => appl.id !== userId));
  }

  removeSelectedApplicant() {
    this.selectedApplicantId$.next(undefined);
  }
}

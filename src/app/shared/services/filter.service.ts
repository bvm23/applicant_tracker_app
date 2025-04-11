import { computed, inject, Injectable, signal } from '@angular/core';
import { Applicant } from '../../features/summary/applicant.model';
import { ApplicantService } from '../../features/summary/applicant.service';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  private mainFilterCriteria = signal<{
    option: keyof Applicant | string;
    value: string;
  }>({
    option: '',
    value: '',
  });

  private mainSortCriteria = signal<{
    key: string | undefined;
    order: 'asc' | 'desc';
  }>({ key: 'added', order: 'desc' });

  filterCriteria = this.mainFilterCriteria.asReadonly();
  sortCriteria = this.mainSortCriteria.asReadonly();

  addCriteria(givenOption: string, givenValue: string) {
    this.mainFilterCriteria.set({ option: givenOption, value: givenValue });
  }

  addSortCriteria(sortData: { key: string; order: 'asc' | 'desc' }) {
    this.mainSortCriteria.set(sortData);
  }

  sort(applicants: Applicant[]) {
    return [...applicants].sort((a, b) => {
      if (this.mainSortCriteria().order === 'asc') {
        return new Date(a.added).getTime() - new Date(b.added).getTime();
      } else {
        return new Date(b.added).getTime() - new Date(a.added).getTime();
      }
    });
  }

  filterBySearch(applicantList: Applicant[]) {
    return applicantList.filter((appl: Applicant) => {
      let add = Object.keys(appl).filter((keyVal) => {
        let kval = keyVal as keyof Applicant;
        let value = appl[kval];
        if (typeof value === 'object') {
          return (
            value.find((val) =>
              val.includes(this.mainFilterCriteria().value.toLowerCase())
            ) && true
          );
        }
        return (
          value.includes(this.mainFilterCriteria().value.toLowerCase()) && true
        );
      });
      return add.length > 0 && appl;
    });
  }

  removeSortCriteria() {
    this.mainSortCriteria.update((current) => ({
      ...current,
      key: undefined,
    }));
  }
}

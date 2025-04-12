import { Injectable, signal } from '@angular/core';
import { Applicant } from '../../features/summary/applicant.model';

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
    const sortKey = this.mainSortCriteria().key as keyof Applicant;
    const sortOrder = this.mainSortCriteria().order;

    return [...applicants].sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];

      // no sort case
      if (!sortKey) {
        return 0;
      }
      // sort list using added time
      if (sortKey === 'added') {
        return sortOrder === 'asc'
          ? new Date(a.added).getTime() - new Date(b.added).getTime()
          : new Date(b.added).getTime() - new Date(a.added).getTime();
      }

      // sort list using the number of skills
      if (sortKey === 'skills') {
        return sortOrder === 'asc'
          ? a.skills.length - b.skills.length
          : b.skills.length - a.skills.length;
      }

      // common sort case
      return sortOrder === 'asc'
        ? valA > valB
          ? 1
          : -1
        : valB > valA
        ? 1
        : -1;
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

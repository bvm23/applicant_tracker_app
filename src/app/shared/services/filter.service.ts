import { computed, inject, Injectable, signal } from '@angular/core';
import { Applicant } from '../../features/summary/applicant.model';
import { ApplicantService } from '../../features/summary/applicant.service';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  private apService = inject(ApplicantService);

  private mainCriteria = signal<{
    option: keyof Applicant | string;
    value: string;
  }>({
    option: '',
    value: '',
  });

  private _sortCriteria = signal<{
    key: string | undefined;
    order: 'asc' | 'desc';
  }>({ key: 'added', order: 'desc' });

  criteria = this.mainCriteria.asReadonly();
  sortCriteria = this._sortCriteria.asReadonly();

  addCriteria(givenOption: string, givenValue: string) {
    this.mainCriteria.set({ option: givenOption, value: givenValue });
  }

  addSortCriteria(sortData: {
    key: string | undefined;
    order: 'asc' | 'desc';
  }) {
    this._sortCriteria.set(sortData);

    console.log(this._sortCriteria());
  }

  filteredBySearch() {
    return this.apService.allApplicants().filter((appl: Applicant) => {
      let add = Object.keys(appl).filter((keyVal) => {
        let kval = keyVal as keyof Applicant;
        let value = appl[kval];
        if (typeof value === 'object') {
          return (
            value.find((val) =>
              val.includes(this.mainCriteria().value.toLowerCase())
            ) && true
          );
        }
        return value.includes(this.mainCriteria().value.toLowerCase()) && true;
      });
      return add.length > 0 && appl;
    });
  }
}

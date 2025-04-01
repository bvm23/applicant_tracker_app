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

  criteria = this.mainCriteria.asReadonly();

  addCriteria(givenOption: string, givenValue: string) {
    this.mainCriteria.set({ option: givenOption, value: givenValue });
  }

  filteredBySearch = computed(() =>
    this.apService.allApplicants().filter((appl: Applicant) => {
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
    })
  );
}

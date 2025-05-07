import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ApplicantService } from '../summary/applicant.service';

@Component({
  selector: 'at-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private router = inject(Router);
  private apService = inject(ApplicantService);

  goHome() {
    this.router.navigate(['']);
    this.apService.removeSelectedApplicant();
  }
}

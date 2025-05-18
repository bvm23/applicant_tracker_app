import { FormControl } from '@angular/forms';

export interface FormControls {
  name: FormControl<string | null>;
  email: FormControl<string | null>;
  location: FormControl<string | null>;
  role: FormControl<string | null>;
  hiringManager: FormControl<string | null>;
  skills: FormControl<string | null>;
}

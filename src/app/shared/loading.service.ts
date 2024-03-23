// loading.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  spinnerSource = new BehaviorSubject(false);
  spinnerStatus = this.spinnerSource.asObservable();

  setLoading(state: boolean) {
    setTimeout(() => {
      if (state && !this.spinnerSource.value) {
        this.spinnerSource.next(true);
      } else if (!state && this.spinnerSource.value) {
        this.spinnerSource.next(false);
      }
    }, 1);
  }
}

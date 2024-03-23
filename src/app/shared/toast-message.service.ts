import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastMessageService {

  constructor(
    private toastr: ToastrService
    ) { }

  showErrorToast(message: string) {
    this.toastr.error(message);
  }
  showWarningToast(message: string) {
    this.toastr.warning(message);
  }
  showSuccessToast(message: string) {
    this.toastr.success(message);
  }
}

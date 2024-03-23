import {
  Component,
  OnInit
} from '@angular/core';
import { LoadingService } from 'src/app/shared/loading.service';
import { AuthAPIService } from '../auth.api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  currentEncCode: string = '';
  newEncCode: string = '';
  cNewEncCode: string = '';
  emailAddress: any
  constructor( 
    private loadingService: LoadingService,
    private AuthAPIService: AuthAPIService,
    private router: Router,
    private toastr: ToastrService,
    private activateRouted: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.activateRouted.paramMap.subscribe((params) => {
      this.emailAddress = params.get('emailId');
      if (!this.emailAddress) {
        this.router.navigate(['/login']);
        this.toastr.error('Something went wrong !');
      }
    })
  }

  submit() {
    if (this.newEncCode  !== this.cNewEncCode) {
       this.toastr.warning("Passwords do not match!");
       return;
    } else if (this.newEncCode.length < 6 || this.cNewEncCode.length < 6) {
       this.toastr.warning("Please enter a valid password with at least 6 characters.");
       return;
    }
    const data = {
      email: this.emailAddress,
      currentEncCode : this.currentEncCode,
      newPasswordEncCode: this.newEncCode
    }
    this.loadingService.setLoading(true);
    this.AuthAPIService.resetPasswordUpdate(data).subscribe((res) => {
      this.loadingService.setLoading(false);
      if (res.status === "Success") {
        this.router.navigate(['/login']);
        this.toastr.success(res.message);
      } else {
        this.toastr.error(res.message);
      }
    }, (error) => {
      this.loadingService.setLoading(false);
      this.toastr.error(error.message);
    });
  }

}
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticateService } from 'src/app/auth/authenticate.service';
import { UtilsService } from 'src/app/shared/utility';
import { AuthAPIService } from '../auth.api.service';
import { ToastMessageService } from 'src/app/shared/toast-message.service';
import { LoadingService } from 'src/app/shared/loading.service';

@Component({
  selector: 'app-selectlogin',
  templateUrl: './selectlogin.component.html',
  styleUrls: ['./selectlogin.component.scss'],
})
export class SelectloginComponent implements OnInit {
  userName = '';
  password: any;
  isForgetPassword = false;
  constructor(
    private AuthAPIService: AuthAPIService,
    private authenticateService: AuthenticateService,
    private router: Router,
    private util: UtilsService,
    private toastService: ToastMessageService,
    private loadingService: LoadingService
  ) { 
  }

  ngOnInit(): void {
  }

  login() {
    const data = {
      email: this.userName.toLowerCase(),
      password: this.password
    }
    this.loadingService.setLoading(true);
      this.AuthAPIService.logIn(data).subscribe((res) => {
        this.loadingService.setLoading(false);
        if (res.status === "success") {
          this.util.setItemToLocalStorage('authToken', res.token);
          this.util.setItemToLocalStorage('userType', res.userType);
          this.authenticateService.token.next(res.token);  
          this.authenticateService.routeComeFromLogin = true;  
          this.authenticateService.isAuthenticate.next(true);  
          this.authenticateService.userLogId.next(res.userId);  
          if (res.userType === 'user' && this.util.getItemToLocalStorage('encChe')) {
              this.router.navigate(['/doctor/checkout']);
            } else if (res && res.userType === 'chemist') {
              this.router.navigate(['/chemist/dashboard']);
            } else if (res && res.userType === 'user') {
              this.router.navigate(['/doctor/chemist']);
            }
        } else {
          this.toastService.showErrorToast( res.message);
          if (res.isVerified && res.isVerified === 'false') {
            const obj = {
              emailForVerifiedAgain: this.userName,
              userType: res.userType
            }
            this.router.navigate(['/signUp'], {
              queryParams: {
                emailForVerifiedAgain: this.userName,
                userType: res.userType
              }
            });
            
          }
        }
      },(error) => {
        this.loadingService.setLoading(false);
        this.toastService.showErrorToast( error.message);
      });
    }

    forgetPassword() {
      this.isForgetPassword = true;
    }

    forgetPasswordSent() {
        const data = {
          email: this.userName.toLowerCase(),
        }
        this.loadingService.setLoading(true);
          this.AuthAPIService.resetPassword(data).subscribe((res) => {
            this.loadingService.setLoading(false);
            if (res.status === "Success") {
              this.router.navigate(['/resetPassword', this.userName]);
            } else {
              this.toastService.showErrorToast( res.message);
            }
          },(error) => {
            this.loadingService.setLoading(false);
            this.toastService.showErrorToast( error.message);
          });
  }

}
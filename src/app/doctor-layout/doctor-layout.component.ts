import {
  Component,
  OnInit
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import {
  MessageService
} from 'primeng/api';
import { filter } from 'rxjs';
import { AuthAPIService } from '../auth/auth.api.service';
import {
  AuthenticateService
} from '../auth/authenticate.service';
import { UtilsService } from '../shared/utility';

@Component({
  selector: 'app-doctor-layout',
  templateUrl: './doctor-layout.component.html',
  styleUrls: ['./doctor-layout.component.scss'],
  providers: [MessageService]
})
export class DoctorLayoutComponent implements OnInit {
  receivedData: any;
  LoggedUser: any;

  constructor(
    private authenticateService: AuthenticateService,
    private messageService: MessageService,
    private util: UtilsService,
    private AuthAPIService: AuthAPIService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.authenticateService.getIsAuthenticate().subscribe((auth: any) => {
        this.LoggedUser = auth;
    });
       const isLoginRoute = this.authenticateService.routeComeFromLogin;
       if (!isLoginRoute) {
         const existToken = this.util.getItemToLocalStorage('authToken');
         if (existToken) {
           this.AuthAPIService.checkLoginExist().subscribe((res) => {
             if (res.status === "success") {
               this.authenticateService.token.next(existToken);  
               this.authenticateService.isAuthenticate.next(true);  
               this.authenticateService.userLogId.next(res.user.userId);  
               this.util.setItemToLocalStorage('authToken', existToken);
             } else {
               this.authenticateService.token.next(null);  
               this.authenticateService.isAuthenticate.next(false);  
               this.authenticateService.userLogId.next(null);  
               this.clearLocalStorageStuffForNotLogin();
               this.router.navigate(['/doctor/chemist']);
               this.messageService.add({ key: 'bc', severity: 'error', summary: 'Error', detail: res.message });
             }
           },(error) => {
            this.authenticateService.token.next(null);  
             this.authenticateService.isAuthenticate.next(false);  
             this.authenticateService.userLogId.next(null);  
             this.clearLocalStorageStuffForNotLogin();
             this.router.navigate(['/doctor/chemist']);
             this.messageService.add({ key: 'bc', severity: 'error', summary: 'Error', detail: error.message });
           });
         }
       }
  }

  ngOnInit(): void {
  }

  logOut() {
    this.authenticateService.token.next(null);
    this.authenticateService.isAuthenticate.next(false);
    this.clearLocalStorageStuffForNotLogin();
    this.router.navigate(['/doctor/chemist']);
  }

  clearLocalStorageStuffForNotLogin() {
    this.util.removeItemToLocalStorage('authToken');
    this.util.removeItemToLocalStorage('encChe');
    this.util.removeItemToLocalStorage('encOrder');
    this.util.removeItemToLocalStorage('city');
    this.util.removeItemToLocalStorage('area');
  }

}

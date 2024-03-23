import {
  Component,
  OnInit
} from '@angular/core';
import {
  AuthenticateService
} from '../auth/authenticate.service';
import {
  UtilsService
} from '../shared/utility';
import {
  AuthAPIService
} from '../auth/auth.api.service';
import {
  ActivatedRoute,
  Router
} from '@angular/router';
import {
  ToastMessageService
} from '../shared/toast-message.service';
import {
  WebsocketOrderPlacedService
} from '../shared/websocket-order-placed.service';
import { ChemistModuleService } from './service/chemist-module.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
@Component({
  selector: 'app-chemist-layout',
  templateUrl: './chemist-layout.component.html',
  styleUrls: ['./chemist-layout.component.scss'],
  animations: [
    trigger('slideInOut', [
      state('in', style({
        'margin-left': '0',
      })),
      state('out', style({
        'margin-left': '-255px', // Adjust the width based on your sidebar width
      })),
      transition('in => out', animate('300ms ease-in-out')),
      transition('out => in', animate('300ms ease-in-out'))
    ]),
  ],
})
export class ChemistLayoutComponent implements OnInit {
  chemistId: any;
  topNotification: any;
  isAuthVar: boolean = false;
  newOrderIndicator : boolean = false;
  isVisible = true; // or false
  animationState = 'in'; // 'in' for showing, 'out' for hiding
  constructor(
    private authenticateService: AuthenticateService,
    private toasterService: ToastMessageService,
    private util: UtilsService,
    private AuthAPIService: AuthAPIService,
    private route: ActivatedRoute,
    private router: Router,
    private wsService: WebsocketOrderPlacedService,
    private chemistService: ChemistModuleService
  ) {
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
            this.util.clearToLocalStorage();
            this.router.navigate(['/login']);
            this.toasterService.showErrorToast(res.message);
          }
        }, (error) => {
          this.authenticateService.token.next(null);
          this.authenticateService.isAuthenticate.next(false);
          this.authenticateService.userLogId.next(null);
          this.util.clearToLocalStorage();
          this.router.navigate(['/login']);
          this.toasterService.showErrorToast(error.message);
        });
      }
    }
  }

  ngOnInit(): void {
    this.authenticateService.userLogId.subscribe((res: any) => {
      if (res) {
        this.chemistId = res;
      }
    });
    this.authenticateService.isAuthenticate.subscribe((isAuth: boolean) => {
        this.isAuthVar = isAuth;
    });

    this.wsService.getNewOrder().subscribe((data) => {
      console.log(data)
      if (data && this.isAuthVar && data.chemistId === this.chemistId) {
        this.newOrderIndicator = true;
        this.getRecentPlacedOrderData();
      }
    });
  }

  getRecentPlacedOrderData() {
    this.chemistService.getRecentPlacedOrderData(this.chemistId).subscribe((res: any) => {
      if (res.status === 'Success') {
        const respData = res.data;
        this.topNotification = respData;
      } else {
        this.topNotification = [];
      }
    }, (error: { message: any; }) => {
      this.topNotification = [];
      // this.toasterService.showErrorToast(error.message);
    });
  }

  logOut() {
    this.authenticateService.token.next(null);
    this.authenticateService.isAuthenticate.next(false);
    this.util.clearToLocalStorage();
    this.router.navigate(['/login']);
  }

  notificationDropDownClick() {
    this.newOrderIndicator = false;
    this.getRecentPlacedOrderData();
  }

  toggleSidebar() {
    this.isVisible = !this.isVisible;
    this.animationState = this.isVisible ? 'in' : 'out';
  }

}
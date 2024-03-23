import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { UtilsService } from '../shared/utility';

@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {
  token = new BehaviorSubject<any>('');
  userLogId = new BehaviorSubject<any>('');
  isAuthenticate = new BehaviorSubject<boolean>(false);
  isAuthInvalid = new Subject<any>();
  routeComeFromLogin = false;
  constructor(
    private util: UtilsService
  ) { }

  // get know user is logged in or not
  getIsAuthenticate() {
    return this.isAuthenticate.asObservable();
  }

  clearLocalStorageStuffForNotLogin() {
    this.util.removeItemToLocalStorage('authToken');
    this.util.removeItemToLocalStorage('encChe');
    this.util.removeItemToLocalStorage('encOrder');
    this.util.removeItemToLocalStorage('city');
    this.util.removeItemToLocalStorage('area');
  }

}

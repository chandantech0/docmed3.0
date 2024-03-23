import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../doctor-layout/services/directives/service/apiService';

@Injectable({
  providedIn: 'root'
})
export class AuthAPIService {

  constructor(private apiService: ApiService) { }

  signUp(data: any): Observable<any> {
     return this.apiService.post('/api/user/signup', data);
  }

  signUpForChemist(data: any): Observable<any> {
    return this.apiService.post('/api/chemist/signup', data);
 }

  signUpOtp(email: String): Observable<any> {
    return this.apiService.post('/api/user/signup-otp-email', {email});
 }

 signUpOtpChemist(email: String): Observable<any> {
  return this.apiService.post('/api/chemist/signup-otp-email', {email});
}

  logIn(data: any): Observable<any> {
    return this.apiService.post('/api/user/login', data);
 }

 signUpOtpSubmit(data: any): Observable<any> {
  return this.apiService.post('/api/user/signUpOtpSubmit', data);
}

signUpOtpSubmitChemist(data: any): Observable<any> {
  return this.apiService.post('/api/chemist/signUpOtpSubmit', data);
}

checkLoginExist(): Observable<any> {
  return this.apiService.get('/api/user/isLoginExist');
}

resetPassword(data: any): Observable<any> {
  return this.apiService.post('/api/resetPassword', data);
}

resetPasswordUpdate(data: any): Observable<any> {
  return this.apiService.post('/api/resetPassword/update', data);
}
}

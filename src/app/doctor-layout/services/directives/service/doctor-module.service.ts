import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './apiService';

@Injectable({
  providedIn: 'root'
})
export class DoctorModuleService {

  constructor(
    private apiService: ApiService
  ) { }

  getAllChemistList(city: string, position: any, area: string): Observable<any> {
    const obj = {
      city: city.toLowerCase(),
      area: area ? area.toLowerCase() : '',
      coordinate: position,
    }
    return this.apiService.post('/api/user/getMedicalLists', obj);
  }

  getFindChemistList(city: String, searchKey:String, position: any): Observable<any> {
    const obj = {
      city: city,
      searchKey: searchKey,
      coordinate: position
    }
    return this.apiService.post('/api/user/getMedicalListsSearch', obj);
  }

  getAllMedicinesByChemistID(chemist_sign_id: any, medicalId: any): Observable<any> {
    return this.apiService.get('/api/user/getMedicinesLists/' + chemist_sign_id + '/' + medicalId);
  }

  getFindChemistListBySearch(chemist_id: any, searchKey: String): Observable<any> {
    const obj = {
      chemist_id: chemist_id,
      searchKey: searchKey
    }
    return this.apiService.post('/api/user/getMedicinesListsBySearch', obj);
  }

  orders(ordersData: any): Observable<any> {
    return this.apiService.post('/api/user/orderPlaced', ordersData);
  }

  ordersOnline(ordersData: any): Observable<any> {
    return this.apiService.post('/api/user/ordersOnline', ordersData);
  }

  handlePaymentCallback(ordersData: any): Observable<any> {
    return this.apiService.post('/api/user/payment-callback', ordersData);
  }

  getAllUserOrderHistory(userId: any) {
    return this.apiService.get('/api/user/getAllUserOrderHistory/' + userId);
  } 

  medicalDataByChemistSignUpID(data: any): Observable<any> {
    return this.apiService.post('/api/user/getMedicalListsByChemistId', data);
  }

  validateUserForOrder(data: any): Observable<any> {
    return this.apiService.post('/api/user/validateUserForOrder', data);
  }

  getMedicinesListsByChemistId(data: any): Observable<any> {
    return this.apiService.post('/api/user/getMedicinesListsByChemistId', data);
  }

  
}

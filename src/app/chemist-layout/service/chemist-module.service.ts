import { Injectable } from '@angular/core';
import { ApiService } from './apiService';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChemistModuleService {

  constructor(
    private apiService: ApiService
  ) { }

  addMedicine(medicineData: any): Observable<any> {
    return this.apiService.post('/api/chemist/addMedicine', medicineData);
  }

  updateActiveStatusOfShop(data: any): Observable<any> {
    return this.apiService.post('/api/chemist/updateActiveStatusOfShop', data);
  }

  getStatusOfShop(chemistId: any): Observable<any> {
    return this.apiService.get('/api/chemist/getStatusOfShop/' + chemistId);
  }

  getChemistAllMedicines(chemistId: any): Observable<any> {
    return this.apiService.get('/api/chemist/getChemistAllMedicines/' + chemistId);
  }

  getRecentPlacedOrderData(chemistId: any): Observable<any> {
    return this.apiService.get('/api/chemist/getRecentPlacedOrderData/' + chemistId);
  }

  getAllPlacedOrderData(chemistId: any): Observable<any> {
    return this.apiService.get('/api/chemist/getAllPlacedOrderData/' + chemistId);
  }

  getOnePlacedOrderData(orderId: any): Observable<any> {
    return this.apiService.get('/api/chemist/getOnePlacedOrderData/' + orderId);
  }

  getOnePlacedOrderStatusUpdateForAccept(data: any, chemistId: string): Observable<any> {
    return this.apiService.post('/api/chemist/getOnePlacedOrderStatusUpdateForAccept/' + chemistId, data);
  }

  getOnePlacedOrderStatusUpdateForReject(data: any, chemistId: string): Observable<any> {
    return this.apiService.post('/api/chemist/getOnePlacedOrderStatusUpdateForReject/' + chemistId, data);
  }

  updateMedicine(data: any): Observable<any> {
    return this.apiService.post('/api/chemist/updateMedicine', data);
  }

  deleteMedicine(data: any): Observable<any> {
    return this.apiService.post('/api/chemist/deleteMedicine', data);
  }

  updateChemist(data: any): Observable<any> {
    return this.apiService.post('/api/chemist/updateProfile', data);
  }

  getProfile(data: any): Observable<any> {
    return this.apiService.post('/api/chemist/getProfile', data);
  }
}

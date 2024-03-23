import { Component, OnInit } from '@angular/core';
import { AuthenticateService } from 'src/app/auth/authenticate.service';
import { DoctorModuleService } from '../services/directives/service/doctor-module.service';
import { MessageService } from 'primeng/api';
import { RouterEvent, Router } from '@angular/router';
import { UtilsService } from 'src/app/shared/utility';
import { LoadingService } from 'src/app/shared/loading.service';

@Component({
  selector: 'app-user-order-history',
  templateUrl: './user-order-history.component.html',
  styleUrls: ['./user-order-history.component.scss'],
  providers: [MessageService]
})
export class UserOrderHistoryComponent implements OnInit {
  // orders = [
  //   { id: 1, date: new Date('2024-01-15'), medicines: ['Medicine A', 'Medicine B'], total: 50.00 },
  //   { id: 2, date: new Date('2024-01-16'), medicines: ['Medicine C', 'Medicine D'], total: 75.00 },
  // ];
  orders: any;
  userId: any;
  city: any;
  constructor(
    private auth: AuthenticateService,
    private doctorService: DoctorModuleService,
    private messageService: MessageService,
    private router: Router,
    private util: UtilsService,
    private loadingService: LoadingService
  ) { 
    this.auth.userLogId.subscribe((res: any) => {
      if (res) {
        this.userId = res;
      }
    });
  }

  ngOnInit(): void {
    this.loadingService.setLoading(true);
    setTimeout(() => {
      this.getOrderHistory();
      }, 500);
  }

  getOrderHistory() {
    this.doctorService.getAllUserOrderHistory(this.userId).subscribe((res: any) => {
      this.loadingService.setLoading(false);
      if (res.status === 'success') {
          const respData = res.data;
          this.orders = respData;
      }
    }, (error) => {
      this.loadingService.setLoading(false);
      this.messageService.add({ key: 'bc', severity: 'error', summary: 'Error', detail: error.message });
    });
  }

  reOrder(orderData: any) {
    const data = {
      chemistSignUpId: orderData.chemistId
    }
    this.loadingService.setLoading(true);
    this.doctorService.medicalDataByChemistSignUpID(data).subscribe((res: any) => {
      this.loadingService.setLoading(false);
      if (res.status === 'success') {
          const medicalId = res.medicalLists[0]._id;
          const customData = {
            route : 'order-history',
            data: orderData,
            medical_id: medicalId 
          }
          this.util.removeItemToLocalStorage('encOrder');
          this.router.navigate(['/doctor/checkout/'], { state: customData });
      }
    }, (error) => {
      this.loadingService.setLoading(false);
      this.messageService.add({ key: 'bc', severity: 'error', summary: 'Error', detail: error.message });
    });
  }

  refreshOrderHistory() {
    this.getOrderHistory();
  }

}

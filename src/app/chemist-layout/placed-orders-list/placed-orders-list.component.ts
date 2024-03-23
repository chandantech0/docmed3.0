import { Component, OnInit } from '@angular/core';
import { ChemistModuleService } from '../service/chemist-module.service';
import { AuthenticateService } from 'src/app/auth/authenticate.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-placed-orders-list',
  templateUrl: './placed-orders-list.component.html',
  styleUrls: ['./placed-orders-list.component.scss'],
  providers: [MessageService]
})
export class PlacedOrdersListComponent implements OnInit {
  chemistId: any;
  allOrdersData: any;
  loading: boolean = false;
  columnCodes: any;
  orderDetailsExpand: boolean = false;
  orderedData: any;
  UserAddress: any;
  selectedOrder: any;
  constructor(
    private chemistService: ChemistModuleService,
    private authenticateService: AuthenticateService,
    private messageService: MessageService
  ) { 
    this.authenticateService.userLogId.subscribe((res: any) => {
      if (res) {
        this.chemistId = res;
      }
    });
  }

  ngOnInit(): void {
    this.loading = true;
    setTimeout(() => {
      this.getRecentPlacedOrderData();
    }, 500);
  }

  getRecentPlacedOrderData() {
    this.loading = true;
    this.chemistService.getAllPlacedOrderData(this.chemistId).subscribe((res: any) => {
      if (res.status === 'Success') {
        const respData = res.data;
        this.allOrdersData = respData;
        this.allOrdersData.tableData.forEach((allOrdersData: { placedDate: string | number | Date; }) => allOrdersData.placedDate = new Date(allOrdersData.placedDate));
        this.columnCodes = this.allOrdersData.columnHeaders.map((column: { columnCode: any; }) => column.columnCode);
        this.loading = false;
      } 
    }, (error: { message: any; }) => {
      this.loading = false;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
    });
  }

  expandOrderDetailsPopup(orderId: any) {
   this.selectedOrder = orderId;
    this.chemistService.getOnePlacedOrderData(orderId).subscribe((res: any) => {
      if (res.status === 'Success') {
        const respData = (res.data || {}).data[0];
        this.orderedData = respData;
        this.UserAddress = respData.address;
        this.orderDetailsExpand = true;
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res.message });
      }
    }, (error: { message: any; }) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
    });
  }

  refresh() {
    this.getRecentPlacedOrderData();
  }

  orderAccept() {
    const obj = {
      orderId: this.selectedOrder,
      orderStatus: 'Accepted',
      medicinesListToBeUpdated: this.orderedData
    }
    this.chemistService.getOnePlacedOrderStatusUpdateForAccept(obj, this.chemistId).subscribe((res: any) => {
      if (res.status === 'Success') {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: res.message });
        this.orderDetailsExpand = false;
        this.getRecentPlacedOrderData();
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res.message });
      }
    }, (error: { message: any; }) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
    });
  }

  orderRejected() {
    const obj = {
      orderId: this.selectedOrder,
      orderStatus: 'Rejected',
      medicinesListToBeUpdated: this.orderedData
    }
    this.chemistService.getOnePlacedOrderStatusUpdateForReject(obj, this.chemistId).subscribe((res: any) => {
      if (res.status === 'Success') {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: res.message });
        this.orderDetailsExpand = false;
        this.getRecentPlacedOrderData();
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: res.message });
      }
    }, (error: { message: any; }) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
    });
  }
  

}

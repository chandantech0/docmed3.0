import {
  Component,
  OnInit
} from '@angular/core';
import { ChemistModuleService } from '../service/chemist-module.service';
import { AuthenticateService } from 'src/app/auth/authenticate.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-chemist-dashboard',
  templateUrl: './chemist-dashboard.component.html',
  styleUrls: ['./chemist-dashboard.component.scss'],
  providers: [MessageService]
})
export class ChemistDashboardComponent implements OnInit {
  products: {
    id: number;name: string;quantity: number;price: number;
  } [] = [];
  cardBackground: string = '#f5f5f5'; // Default background color
  toggleSwitch: boolean = false;
  cardBackgroundText: string = '';
  StoreStatusText = 'Offline';
  chemistId: any;
  chemistName: any;
  constructor(
    private chemistService: ChemistModuleService,
    private auth: AuthenticateService,
    private messageService: MessageService
  ) {
    this.auth.userLogId.subscribe((res: any) => {
      if (res) {
        this.chemistId = res;
      }
    });
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.getStatusOfShop();
    }, 500);
  }

  getStatusOfShop() {
    this.chemistService.getStatusOfShop(this.chemistId).subscribe((res: any) => {
      if (res.status === 'Success') {
        const respData = res.data;
        this.chemistName = respData[0].chemistName || '';
        this.toggleSwitch = respData[0].isActive
        this.cardBackground = this.toggleSwitch ? '#2ecc71' : '#f5f5f5'; // Light Green when enabled
        this.cardBackgroundText = this.toggleSwitch ? '#fff' : ''; // Light Green when enabled
        this.StoreStatusText = this.toggleSwitch ? 'Online' : 'Offline'; // Light Green when enabled
      } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong' });
      }
    }, (error: { message: any; }) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
    });
  }


  toggleCardColor() {
    const obj = {
      chemistId: this.chemistId,
      isActiveStatus: this.toggleSwitch ? true : false
    }
    this.chemistService.updateActiveStatusOfShop(obj).subscribe((res: any) => {
      if (res.status === 'Success') {
        this.cardBackground = this.toggleSwitch ? '#2ecc71' : '#f5f5f5'; // Light Green when enabled
        this.cardBackgroundText = this.toggleSwitch ? '#fff' : ''; // Light Green when enabled
        this.StoreStatusText = this.toggleSwitch ? 'Online' : 'Offline'; // Light Green when enabled
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong' });
      }
    }, (error: { message: any; }) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
    });

  }
}
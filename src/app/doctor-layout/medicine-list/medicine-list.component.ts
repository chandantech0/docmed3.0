import {
  Component,
  OnInit
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { UtilsService } from 'src/app/shared/utility';
import { DoctorModuleService } from '../services/directives/service/doctor-module.service';
import { ToastMessageService } from 'src/app/shared/toast-message.service';
import { LoadingService } from 'src/app/shared/loading.service';
import * as Tesseract from 'tesseract.js';
@Component({
  selector: 'app-medicine-list',
  templateUrl: './medicine-list.component.html',
  styleUrls: ['./medicine-list.component.scss'],
  providers: [MessageService]
})
export class MedicineListComponent implements OnInit {
  search = false;
  orderBox = false;
  medicines: any;
  chemistId: any
  selectedItem: any = [];
  totalPrice: any;
  chemistData: any;
  private searchTermsForMedicine = new Subject<string>();
  searchValue = '';
  searchLoader = false;
  MedicalId: any;
  selectedImage: any;
  extractedText: string = '';
  constructor(
    private activeRoute: ActivatedRoute,
    private messageService: MessageService,
    private doctorService: DoctorModuleService,
    private util: UtilsService,
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private toastService: ToastMessageService,
    private loadingService: LoadingService
  ) {
    this.searchTermsForMedicine.pipe(debounceTime(1200),distinctUntilChanged()).subscribe((res: any) => {
      const searchKey = res;
      if (searchKey && searchKey.length) {
        this.searchLoader = true;
        this.doctorService.getFindChemistListBySearch(this.chemistId, searchKey).subscribe((res: any) => {
          if (res.status === 'success') {
            this.searchLoader = false;
            const respData = (res.medicinesLists || []);
            this.medicines = respData[0]?.medicines_items;
            this.isHaveAlreadyOrdersSelected();
          } else {

          }
        }, (error) => {
          this.messageService.add({ key: 'bc', severity: 'error', summary: 'Error', detail: error.message });
        });
      }  else {
        this.getMedicinesData();
      }
    });
  }

  ngOnInit(): void {
    this.getMedicinesData();
  }

  onFileSelected(event: any): void {
    this.selectedImage = event.target.files[0];
  }

  
  uploadImage(): void {
    if (this.selectedImage) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const imageData = e.target.result.toString();
        this.extractTextFromImage(imageData)
          .then((text) => {
            this.extractedText = text;
            console.log('Extracted Text:', text);
          })
          .catch((error) => {
            console.error('Error extracting text:', error);
          });
      };

      reader.readAsDataURL(this.selectedImage);
    }
  }

  extractTextFromImage(imageData: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      Tesseract.recognize(
        imageData,
        'eng',
        { logger: (info) => console.log(info) }
      ).then(
        (result: any) => {
          const extractedText = result.text;
          resolve(extractedText);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  getMedicinesData() {
    this.activeRoute.paramMap.subscribe((params) => {
      this.chemistId = params.get('id');
      this.MedicalId = params.get('medicalID');
      this.loadingService.setLoading(true);
      this.doctorService.getAllMedicinesByChemistID(this.chemistId, this.MedicalId).subscribe((res: any) => {
        this.loadingService.setLoading(false);
        if (res.status === 'success') {
          const encChemistId = this.util.encrypt(this.chemistId);
          this.util.setItemToLocalStorage('encChe', encChemistId);
          this.selectedItem = [];
          this.medicines = res.data[0].medicines_items;
          this.chemistData = res.chemistData;
          this.isHaveAlreadyOrdersSelected();
        } else {
            this.messageService.add({ key: 'bc', severity: 'success', summary: 'Success', detail: 'No Medicine Found' });
        }
      }, (error) => {
        this.loadingService.setLoading(false);
        this.router.navigate(['/not-found']);
        this.messageService.add({ key: 'bc', severity: 'error', summary: 'Error', detail: error.message });
      })
    });
  }

  isHaveAlreadyOrdersSelected() {
    if (this.util.getItemToLocalStorage('encOrder')) {
      const decryptSelectedOrderAlready = this.util.getItemToLocalStorage('encOrder');
      const decryptOrderData = this.util.decrypt(decryptSelectedOrderAlready);
      if (decryptOrderData.MedicalId && decryptOrderData.MedicalId == this.MedicalId) {
          decryptOrderData.selectedOrders.forEach((med: any) => {
            this.medicines.map((order: any) => {
              if (order._id === med._id) {
                order.quantity = med.quantity;
                order.selected = med.selected;
              }
            });
          });
          this.selectedItem = [...decryptOrderData.selectedOrders];
          this.calculateTotalPrice();
          this.populateOrderDrawer();
      }
    }
  }

  isSearch(): void {
    this.search = true;
    this.searchValue = '';
  }

  searchClose(): void {
    this.search = false;
    this.getMedicinesData();
  }

  searchHappen(value: any) {
    this.applyFilter(this.searchValue);
   }


   applyFilter(filterValue: string) {
    this.searchTermsForMedicine.next(filterValue);
   }

  add(item: any) {
    item.selected = true;
    this.selectedItem.push({...item});
    this.calculateTotalPrice();
    this.populateOrderDrawer();
    this.saveOrderInLocalStorage();
  }

  incrementQuantity(item: any): void {
    item.quantity += 1;
    if (item.quantity > item.stripQuantity) {
      this.toastService.showWarningToast('Stock limit exceeded');
      item.quantity -= 1;
      return;
    }
    this.selectedItem.forEach((obj: any) => {
       if (obj._id === item._id) {
         obj.quantity = item.quantity;
       }
    });
    this.calculateTotalPrice();
    this.saveOrderInLocalStorage();
  }

  decrementQuantity(item: any): void {
    if (item.quantity > 1) {
      item.quantity -= 1;
      this.selectedItem.forEach((obj: any) => {
        if (obj._id === item._id) {
          obj.quantity = item.quantity;
        }
     });
    } else {
      item.selected = false;
      this.selectedItem = this.selectedItem.filter((obj: any) => obj._id !== item._id);
      this.populateOrderDrawer();
    }
    this.calculateTotalPrice();
    this.saveOrderInLocalStorage();
  }

  populateOrderDrawer() {
    setTimeout(() => {
      const noneAnySelectedMedicine = this.medicines.every((obj: any) => !obj.selected);
      if (noneAnySelectedMedicine) {
        this.orderBox = false;
      } else {
        this.orderBox = true;
      }
    }, 100);
  }

  calculateTotalPrice() {
    this.totalPrice = null;
      this.totalPrice = this.selectedItem.reduce((acc: any, item: any) => {
        return acc + item.price * item.quantity;
      }, 0);
  }

  saveOrderInLocalStorage() {
    const obj = {
      MedicalId: this.MedicalId,
      selectedOrders: this.selectedItem
    }
    const encOrder = this.util.encrypt(obj);
    this.util.setItemToLocalStorage('encOrder', encOrder);
  }

  gotToCheckout() {
    // const encOrder = this.util.encrypt(this.selectedItem);
    // this.util.setItemToLocalStorage('encOrder', encOrder);
    this.router.navigate(['/doctor/checkout'], { state: { chemistId: this.chemistId } });
  }

}

import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { filter } from 'rxjs';
import { UtilsService } from 'src/app/shared/utility';
import { DoctorModuleService } from '../services/directives/service/doctor-module.service';
import { AuthenticateService } from 'src/app/auth/authenticate.service';
import { WebsocketOrderPlacedService } from 'src/app/shared/websocket-order-placed.service';
import { ToastMessageService } from 'src/app/shared/toast-message.service';
import { LoadingService } from 'src/app/shared/loading.service';
import { AuthAPIService } from 'src/app/auth/auth.api.service';
import { ToastrService } from 'ngx-toastr';
declare var Razorpay: any; // Razorpay types are not available, declare the variable

@Component({
  selector: 'app-medicine-checkout',
  templateUrl: './medicine-checkout.component.html',
  styleUrls: ['./medicine-checkout.component.scss'],
  providers: [MessageService]
})
export class MedicineCheckoutComponent implements OnInit {
  DeliveryForm: FormGroup;
  selectedOrder: any[] = [];
  chemistId: any;
  totalPrice: any;
  userId: any;
  payUI: boolean  = false;
  MedicalId: any;
  validationError: string | null = null;
  userNotLogged: boolean = false;
  medicines: any;
  haveOutOfStockItems: boolean = false;
  constructor(
    private fb: FormBuilder,
    private util: UtilsService,
    private router: Router,
    private doctorService: DoctorModuleService,
    private messageService: MessageService,
    private authenticateService: AuthenticateService,
    private websocketService: WebsocketOrderPlacedService,
    private toaster: ToastMessageService,
    private loadingService: LoadingService,
    private AuthAPIService: AuthAPIService,
    private ngZone: NgZone,
    private toastr: ToastrService
  ) { 
    this.DeliveryForm = this.fb.group({
      DeliveryArea: ['', Validators.required],
      address: ['', Validators.required],
      name: ['', Validators.required],
      phone: ['', Validators.required],
    });
    // this.router.events
    // .pipe(filter((event) => event instanceof NavigationEnd))
    // .subscribe(() => {
    //   const state = this.router.getCurrentNavigation()?.extras.state;
    //   // this.chemistId = state?.['chemistId'];
    //     const encChemistId = this.util.encrypt(state?.['chemistId']);
    //     this.util.setItemToLocalStorage('encChe', encChemistId);
    // });
}

  ngOnInit(): void {
    if (this.util.getItemToLocalStorage('authToken')) {
      this.AuthAPIService.checkLoginExist().subscribe((res) => {
        if (res.status === "success") { 
          this.authenticateService.isAuthenticate.next(true);  
          this.authenticateService.userLogId.next(res.user.userId);  
          this.userId = res.user.userId;
          this.userNotLogged = false;
        } else {
          this.authenticateService.token.next(null);  
          this.authenticateService.isAuthenticate.next(false);  
          this.authenticateService.userLogId.next(null);  
          this.authenticateService.clearLocalStorageStuffForNotLogin();
          this.userId = '';
          this.userNotLogged = true;
        }
      },(error) => {
       this.authenticateService.token.next(null);  
        this.authenticateService.isAuthenticate.next(false);  
        this.authenticateService.userLogId.next(null);  
        this.authenticateService.clearLocalStorageStuffForNotLogin();
        this.userId = '';
        this.userNotLogged = true;
      });
    } else {
      this.userNotLogged = true;
    }

    // this.authenticateService.userLogId.subscribe((res: any) => {
    //   if (res) {
    //     this.userId = res;
    //     this.userNotLogged = false;
    //   } else {
    //     this.userNotLogged = true;
    //   }
    // });

    this.checkRouterComeFromOrderHistory();

    // Added CDN of RazorPay 
    this.loadRazorpayScript().then(() => {
      // console.log('Razorpay script loaded successfully.');
    }).catch((error) => {
      // console.error('Error loading Razorpay script:', error);
    });
  }

  loadRazorpayScript(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';

      // Adjusted the event handlers to match the expected signatures
      script.onload = () => resolve();
      script.onerror = (event: Event | string, source?: string, lineno?: number, colno?: number, error?: Error) => {
        console.error('Error loading Razorpay script:', event);
        reject(error || 'Unknown error');
      };

      document.head.appendChild(script);
    });
  }


  checkRouterComeFromOrderHistory() {
    const routeCame = history.state;
    if (routeCame && routeCame.route && routeCame.route === 'order-history') {
        const orderHistoryArray = routeCame.data.OrderItems;
        console.log(routeCame)
        const chemist_id = routeCame.data.chemistId;
        this.loadingService.setLoading(true);
        const obj= {
          chemistId: chemist_id
        }
        this.doctorService.getMedicinesListsByChemistId(obj).subscribe((res: any) => {
         this.loadingService.setLoading(false);
         if (res.status === 'Success') {
          this.MedicalId = routeCame.medical_id;
          this.chemistId = chemist_id;
          const encChemistId = this.util.encrypt(this.chemistId);
          this.util.setItemToLocalStorage('encChe', encChemistId);
          this.selectedOrder = [];
          this.medicines = res.data[0].medicines_items;
          this.medicines.forEach((med: any) => {
              const matchingMedicine = orderHistoryArray.find((order: any) => order._id === med._id);
              if (matchingMedicine) {
                if (matchingMedicine.quantity >= med.stripQuantity) {
                  matchingMedicine.quantity = 0;
                }
                this.selectedOrder.push({...matchingMedicine});
                this.saveSelectedOrderEnc();

                // check order history contain out of stock
                this.checkOrderContainOutOfStock();
              }
          });
         } else {
          this.toastr.error('Medicines not found');
          this.router.navigate(['/doctor/chemist']);
         }
       }, (error: { message: any; }) => {
         this.loadingService.setLoading(false);
         this.toastr.error('Medicines not found');
         this.router.navigate(['/doctor/chemist']);
       });
      } else {
        const encOrderData = this.util.getItemToLocalStorage('encOrder');
        if (encOrderData) {
          const decryptOrderData = this.util.decrypt(encOrderData);
          this.MedicalId = decryptOrderData.MedicalId;
          this.selectedOrder = decryptOrderData.selectedOrders;
          this.checkOrderContainOutOfStock();
        } else {
          this.router.navigate(['/doctor/chemist']);
        }
      }
  }

  checkOrderContainOutOfStock() {
    const isOutOfStockItems = this.selectedOrder.some((item: any) => item.quantity === 0);
    if (isOutOfStockItems) {
      this.haveOutOfStockItems = true;
    } else {
      this.haveOutOfStockItems = false;
      this.calculateTotalPrice();
      this.saveSelectedOrderEnc();
    }
  }

  removeOutOfStock() {
    this.selectedOrder = this.selectedOrder.filter((item: any) => item.quantity !== 0);
    console.log(this.selectedOrder)
    this.haveOutOfStockItems = false;
    this.calculateTotalPrice();
    this.saveSelectedOrderEnc();
    this.checkOrderAvailable();
  }

  incrementQuantity(item: any): void {
    item.quantity += 1;
    if (item.quantity > item.stripQuantity) {
      this.toaster.showWarningToast('Stock limit exceeded');
      item.quantity -= 1;
      return;
    }
    this.selectedOrder.forEach((obj: any) => {
       if (obj._id === item._id) {
         obj.quantity = item.quantity;
       }
    });
    this.calculateTotalPrice();
    this.saveSelectedOrderEnc();
  }

  decrementQuantity(item: any): void {
    if (item.quantity > 1) {
      item.quantity -= 1;
      this.selectedOrder.forEach((obj: any) => {
        if (obj._id === item._id) {
          obj.quantity = item.quantity;
        }
     });
    } else {
      item.selected = false;
      this.selectedOrder = this.selectedOrder.filter((obj: any) => obj._id !== item._id);
    }
    this.calculateTotalPrice();
    this.saveSelectedOrderEnc();
    this.checkOrderAvailable();
  }

  saveSelectedOrderEnc() {
    const obj = {
      MedicalId: this.MedicalId,
      selectedOrders: this.selectedOrder
    }
    const encOrder = this.util.encrypt(obj);
    this.util.setItemToLocalStorage('encOrder', encOrder);
  }

  checkOrderAvailable() {
    if (this.selectedOrder && this.selectedOrder.length === 0) {
      this.router.navigate(['/doctor/chemist']);
    }
  }


  calculateTotalPrice() {
    this.totalPrice = null;
      this.totalPrice = this.selectedOrder.reduce((acc: any, item: any) => {
        return acc + item.price * item.quantity;
      }, 0);
  }

  validateUserToPay() {
    this.loadingService.setLoading(true);
    const obj= {
      userId: this.userId
    }
    this.doctorService.validateUserForOrder(obj).subscribe((res: any) => {
     this.loadingService.setLoading(false);
     if (res.status === 'Success') {
      this.reCheckOrderAvailability();
     } else {
      this.toastr.error('User is not valid. Please try again.');
      this.util.clearToLocalStorage();
      this.authenticateService.isAuthenticate.next(false);  
      this.authenticateService.userLogId.next(null); 
      this.router.navigate(['/doctor/chemist']);
     }
   }, (error: { message: any; }) => {
     this.loadingService.setLoading(false);
     this.toastr.error('User is not valid. Please try again.');
     this.authenticateService.isAuthenticate.next(false);  
     this.authenticateService.userLogId.next(null); 
     this.util.clearToLocalStorage();
     this.router.navigate(['/doctor/chemist']);
   })
    
  }


  reCheckOrderAvailability() {
  const chemistIdJSON = this.util.getItemToLocalStorage('encChe');
  if (!chemistIdJSON) {
    this.toaster.showErrorToast('Something went wrong. Please try again.')
    this.router.navigate(['/doctor/chemist']);
    return;
  }
  this.chemistId = this.util.decrypt(chemistIdJSON);
  const encOrderData = this.util.getItemToLocalStorage('encOrder');
  const decryptOrderData = this.util.decrypt(encOrderData);
  this.loadingService.setLoading(true);
  const obj= {
    chemistId: this.chemistId
  }
  this.doctorService.getMedicinesListsByChemistId(obj).subscribe((res: any) => {
   if (res.status === 'Success') {
    this.selectedOrder = [];
    this.medicines = res.data[0].medicines_items;
    this.medicines.forEach((med: any) => {
        const matchingMedicine = decryptOrderData.selectedOrders.find((order: any) => order._id === med._id);
        if (matchingMedicine) {
          if (matchingMedicine.quantity > med.stripQuantity) {
            matchingMedicine.quantity = 0;
          }
          this.selectedOrder.push({...matchingMedicine});
          this.saveSelectedOrderEnc();

          // check order history contain out of stock
          setTimeout(() => {
            const isOutOfStockItems = this.selectedOrder.some((item: any) => item.quantity === 0);
            if (isOutOfStockItems) {
              this.haveOutOfStockItems = true;
              this.loadingService.setLoading(false);
            } else {
              this.haveOutOfStockItems = false;
              this.calculateTotalPrice();
              this.payUI = true;
              this.loadingService.setLoading(false);
            }
          }, 500);
        }
    });
  }
  });

}

  placeOrderCOD() {
    const chemistIdJSON = this.util.getItemToLocalStorage('encChe');
    if (!chemistIdJSON) {
      this.toaster.showErrorToast('Something went wrong. Please try again.')
      this.router.navigate(['/doctor/chemist']);
      return;
    }
    this.chemistId = this.util.decrypt(chemistIdJSON);
   const orderSummery = {
     chemistId: this.chemistId,
     address: this.DeliveryForm.value,
     OrderItems: this.selectedOrder,
     totalPrice: this.totalPrice,
     userId: this.userId,
     paymentMode: 'COD'
   }
   this.loadingService.setLoading(true);
   this.doctorService.orders(orderSummery).subscribe((res: any) => {
    this.loadingService.setLoading(false);
    if (res.status === 'success') {
       this.router.navigate(['/doctor/placed'], { state: { orderId: res.data.orderId, date: res.data.orderPlacedDate} });
       this.websocketService.placeOrder(orderSummery);
       this.util.removeItemToLocalStorage('encOrder');
    } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong' });
    }
  }, (error: { message: any; }) => {
    this.loadingService.setLoading(false);
    this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
  })
  }

  // Payment-Online
  placeOrderOnline() {
    const chemistIdJSON = this.util.getItemToLocalStorage('encChe');
    if (!chemistIdJSON) {
      this.toaster.showErrorToast('Something went wrong. Please try again.')
      this.router.navigate(['/doctor/chemist']);
      return;
    }
    this.chemistId = this.util.decrypt(chemistIdJSON);
   const orderSummery = {
     chemistId: this.chemistId,
     address: this.DeliveryForm.value,
     OrderItems: this.selectedOrder,
     totalPrice: this.totalPrice,
     userId: this.userId,
     paymentMode: 'Online',
     razorpay_payment_id: '',
     razorpay_order_id: '',
     razorpay_signature: ''
   }
   this.loadingService.setLoading(true);
   this.doctorService.ordersOnline(orderSummery).subscribe((order: any) => {
    this.loadingService.setLoading(false);
    if (order.status === 'success') {
      const options = {
        key: 'rzp_test_VA0XZjX8LqFRpj',
        amount: order.amount,
        currency: 'INR',
        order_id: order.orderId,
        name: 'docmed.com',
        description: 'Payment for products/services',
        image: "https://s3.amazonaws.com/rzp-mobile/images/rzp.jpg",
        prefill:
        {
          "email": "gaurav.kumar@example.com",
          "contact": +919900000000,
        },
        config: {
          display: {
            blocks: {
              banks: {
                name: 'All payment methods',
                instruments: [
                  {
                    method: 'upi'
                  },
                  {
                    method: 'card'
                  },
                  {
                      method: 'wallet'
                  },
                  {
                      method: 'netbanking'
                  }
                ],
              },
            },
            sequence: ['block.banks'],
            preferences: {
              show_default_blocks: true,
            },
          },
        },
        handler: (response: any) => {
          this.doctorService.handlePaymentCallback(response).subscribe(
            (callbackResponse: any) => {
              // console.log('Payment Successful:', callbackResponse);
              // Handle successful payment
              this.loadingService.setLoading(true);
              orderSummery['razorpay_payment_id'] = callbackResponse.razorpay_payment_id;
              orderSummery['razorpay_order_id'] = callbackResponse.razorpay_order_id;
              orderSummery['razorpay_signature'] = callbackResponse.razorpay_signature;
              this.doctorService.orders(orderSummery).subscribe((res: any) => {
                this.loadingService.setLoading(false);
                this.ngZone.run(() => {
                  this.router.navigate(['/doctor/placed'], { state: { orderId: res.data.orderId, date: res.data.orderPlacedDate} });
                });
                this.websocketService.placeOrder(orderSummery);
                this.util.removeItemToLocalStorage('encOrder');
              });
            },
            (error: any) => {
              console.error('Payment Callback Error:', error);
              this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
            }
          );
        },
      };
      const rzp = new Razorpay(options);
      rzp.open();

      // window.location.href = res.data;
    } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong' });
    }
  }, (error: any) => {
    this.loadingService.setLoading(false);
    this.messageService.add({ severity: 'error', summary: 'Error', detail: error });
  })
  }

  // mobile number validate
  onMobileNumberInput(event: Event): void {
    this.validationError = null; // Reset error on every input

    // Validate the mobile number on keypress
    const inputValue = (event.target as HTMLInputElement).value;
    const isValid = this.util.validateMobileNumber(inputValue);

    if (!isValid) {
      this.validationError = 'Invalid mobile number format';
    }
  }

  gotToLogin() {
    this.router.navigate(['/login']);
  }

}

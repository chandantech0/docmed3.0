import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticateService } from 'src/app/auth/authenticate.service';
import { ChemistModuleService } from '../service/chemist-module.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-inventory-management',
  templateUrl: './inventory-management.component.html',
  styleUrls: ['./inventory-management.component.scss'],
  providers: [MessageService]
})
export class InventoryManagementComponent implements OnInit {
  loading: boolean = false;
  medicineData: any;
  selectStock: string = ''; // Assuming it's a string
  selectPrescribe: string = ''; // Assuming it's a string
toggleSwitchForPrescribe = [
  { label: 'No', value: 'No' },
  { label: 'Yes', value: 'Yes' },
];
addMedicinePopupVisible: boolean = false;
medicineForm: FormGroup;
columnCodes: any;
stockOptions = [
  { label: 'In Stock', value: 'In Stock' },
  { label: 'Out Of Stock', value: 'Out Of Stock' },
  // Add more options as needed
];
  chemistId: any;
  isEdit: boolean = false;
  constructor(private fb: FormBuilder, 
    private auth: AuthenticateService,
    private chemistService: ChemistModuleService,
    private messageService: MessageService) {
    this.medicineForm = this.fb.group({
      name: ['', Validators.required],
      manufacturer: ['', Validators.required],
      stripQuantity: [null, [Validators.required, Validators.min(0)]],
      perStripTabletQty: ['', [Validators.required, Validators.min(0)]],
      price: ['', Validators.required],
      isPrescribeRequired: ['', Validators.required]
    });

    this.auth.userLogId.subscribe((res: any) => {
      if (res) {
        this.chemistId = res;
        this.getChemistAllMedicines();
      }
    });
   
   }

  ngOnInit(): void {
  }

  getChemistAllMedicines() {
    this.loading = true;
    this.chemistService.getChemistAllMedicines(this.chemistId).subscribe((res: any) => {
      if (res.status === 'success') {
        const respData = (res || {}).data;
        this.medicineData = respData;
        this.columnCodes = this.medicineData.columnHeaders.map((column: { columnCode: any; }) => column.columnCode);
        this.loading = false;
      } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong' });
          this.loading = false;
      }
    }, (error: { message: any; }) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
      this.loading = false;
    });
  }

  editMedicines(medicine:any) {
    this.medicineForm.patchValue({
      name: medicine.name,
      manufacturer: medicine.manufacturer,
      stripQuantity: medicine.stripQuantity,
      price: medicine.price,
      perStripTabletQty: medicine.perStripTabletQty,
      isPrescribeRequired: medicine.prescribeRequired
    });
    this.isEdit = true;
    this.addMedicinePopupVisible = true;
  }

  deleteMedicines(medicineId: any) {
    const obj = {
      chemistId: this.chemistId,
      medicineId: medicineId
    }
    this.chemistService.deleteMedicine(obj).subscribe((res: any) => {
      if (res.status === 'Success') {
        this.getChemistAllMedicines();
        this.messageService.add({ severity: 'success', summary: 'Success', detail: res.message });
      } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong' });
      }
    }, (error: { message: any; }) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
    });
  }

  showDialogForAddMedicine() {
    this.isEdit = false;
    this.addMedicinePopupVisible = true;
    this.medicineForm.reset();
}

onSubmit(): void {
  if (this.medicineForm.valid) {
    const obj = {
      chemistId: this.chemistId,
      medicineData: this.medicineForm.value
    }
    this.chemistService.addMedicine(obj).subscribe((res: any) => {
      if (res.status === 'Success') {
        this.addMedicinePopupVisible = false;
        this.getChemistAllMedicines();
      } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong' });
      }
    }, (error: { message: any; }) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
    });
  } 
}

isPrescribeRequired() {
}

updateMedicine() {
  if (this.medicineForm.valid) {
    const obj = {
      chemistId: this.chemistId,
      medicineData: this.medicineForm.value
    }
    this.chemistService.updateMedicine(obj).subscribe((res: any) => {
      if (res.status === 'Success') {
        this.addMedicinePopupVisible = false;
        this.getChemistAllMedicines();
      } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong' });
      }
    }, (error: { message: any; }) => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: error.message });
    });
  } 
}

onCancelMedicineDailog() {
  this.addMedicinePopupVisible = false;
  this.medicineForm.reset();
}
}

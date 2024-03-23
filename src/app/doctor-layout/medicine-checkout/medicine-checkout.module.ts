import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedicineCheckoutComponent } from './medicine-checkout.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared';

const routes: Routes = [
  {
    path: '',
    component: MedicineCheckoutComponent
  }
];

@NgModule({
  declarations: [
    MedicineCheckoutComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class MedicineCheckoutModule { }

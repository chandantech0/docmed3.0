import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryManagementComponent } from './inventory-management.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared';

const routes: Routes = [
  {
    path: '',
    component: InventoryManagementComponent
  }
];

@NgModule({
  declarations: [
    InventoryManagementComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class InventoryManagementModule { }

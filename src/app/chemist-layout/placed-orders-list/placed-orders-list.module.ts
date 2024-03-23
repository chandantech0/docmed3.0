import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlacedOrdersListComponent } from './placed-orders-list.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared';

const routes: Routes = [
  {
    path: '',
    component: PlacedOrdersListComponent
  }
];

@NgModule({
  declarations: [
    PlacedOrdersListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class PlacedOrdersListModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedicineListComponent } from './medicine-list.component';
import { SharedModule } from 'src/app/shared';
import { RouterModule, Routes } from '@angular/router';
import { FocusDirective } from '../services/directives/focus.directive';

const routes: Routes = [
  {
    path: '',
    component: MedicineListComponent
  },
  {
    path: ':id/:medicalID',
    component: MedicineListComponent
  }
];


@NgModule({
  declarations: [
    MedicineListComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class MedicineListModule { }

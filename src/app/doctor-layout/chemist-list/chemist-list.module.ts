import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ChemistListComponent } from './chemist-list.component';
import { SharedModule } from 'src/app/shared';


const routes: Routes = [
  {
    path: '',
    component: ChemistListComponent
  }
];

@NgModule({
  declarations: [ChemistListComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class ChemistListModule { }

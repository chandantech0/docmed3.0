import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorLayoutComponent } from './doctor-layout.component';
import { RouterModule, Routes } from '@angular/router';
import { DoctorLayoutRouteRoutingModule } from './doctor-layout-route-routing.module';
import { SharedModule } from '../shared';
import { OrderPlacedComponent } from './order-placed/order-placed.component';
import { DoctorModuleService } from './services/directives/service/doctor-module.service';

@NgModule({
  declarations: [
    DoctorLayoutComponent,
    OrderPlacedComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    DoctorLayoutRouteRoutingModule
  ],
  providers: [DoctorModuleService]
})
export class DoctorLayoutModule { }

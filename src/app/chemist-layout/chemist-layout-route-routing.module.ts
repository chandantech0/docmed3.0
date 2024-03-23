import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChemistLayoutComponent } from './chemist-layout.component';

const routes: Routes = [
  {
    path: '',
    component: ChemistLayoutComponent,
    children: [
        {
            path: 'dashboard',
            loadChildren: () => import('./chemist-dashboard/chemist-dashboard.module').then(m => m.ChemistDashboardModule)
        },
        {
          path: 'inventory-Management',
          loadChildren: () => import('./inventory-management/inventory-management.module').then(m => m.InventoryManagementModule)
        },
        {
          path: 'order-placed-list',
          loadChildren: () => import('./placed-orders-list/placed-orders-list.module').then(m => m.PlacedOrdersListModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('./chemist-profile/chemist-profile.module').then(m => m.ChemistProfileModule)
    }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChemistLayoutRouteRoutingModule { }


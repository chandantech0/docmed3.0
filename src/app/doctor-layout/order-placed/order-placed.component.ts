import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { UtilsService } from 'src/app/shared/utility';

@Component({
  selector: 'app-order-placed',
  templateUrl: './order-placed.component.html',
  styleUrls: ['./order-placed.component.scss']
})
export class OrderPlacedComponent implements OnInit {
  orderId: any;
  dateTime: any;

  constructor(
    private router: Router,
    private util: UtilsService
  ) { 
    this.router.events
    .pipe(filter((event) => event instanceof NavigationEnd))
    .subscribe(() => {
      const state = this.router.getCurrentNavigation()?.extras.state;
      this.orderId = state?.['orderId'];
      this.dateTime = state?.['date'];
    });
  }

  ngOnInit(): void {
  }

  clickMoreOrder() {
    this.router.navigate(['/doctor/chemist']);
  }

}

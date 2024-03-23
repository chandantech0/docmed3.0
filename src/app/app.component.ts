import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { LoadingService } from './shared/loading.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'docMed';
  loading: boolean = false;
  constructor(private primengConfig: PrimeNGConfig, private loaderService: LoadingService) {}

  ngOnInit() {
    this.primengConfig.ripple = true;
    this.updateSpinnertState();
}

updateSpinnertState() {
  this.loaderService.spinnerStatus.subscribe((res: any) => {
    this.loading = res;
  })
}
}

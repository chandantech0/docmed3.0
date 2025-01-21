import {
  AfterViewInit,
  Component,
  OnInit,
} from '@angular/core';
import {
  MessageService
} from 'primeng/api';
import {
  distinctUntilChanged,
  Subject,
  timeout
} from 'rxjs';
import {
  debounceTime
} from 'rxjs';
import {
  UtilsService
} from 'src/app/shared/utility';
import {
  DoctorModuleService
} from '../services/directives/service/doctor-module.service';
import * as Constants from '../../shared/constant';
import { LoadingService } from 'src/app/shared/loading.service';
@Component({
  selector: 'app-chemist-list',
  templateUrl: './chemist-list.component.html',
  styleUrls: ['./chemist-list.component.scss'],
  providers: [MessageService]
})
export class ChemistListComponent implements OnInit, AfterViewInit {
  search = false;
  chemistFind = false;
  searchValue = '';
  searchLoader = false;
  city: any;
  private searchTerms = new Subject < string > ();
  medicalLists: any;
  currentAddress: any;
  area: any;
  errorMessage: any;
  errorMessageEnable: boolean = false;
  position: any = {};
  constructor(
    private messageService: MessageService,
    private doctorService: DoctorModuleService,
    private util: UtilsService,
    private loadingService: LoadingService
  ) {
    this.searchTerms.pipe(debounceTime(1200), distinctUntilChanged()).subscribe((res: any) => {
      const searchKey = res;
      if (searchKey && searchKey.length) {
        this.searchLoader = true;
        this.doctorService.getFindChemistList(this.city, searchKey, this.position).subscribe((res: any) => {
          this.chemistFind = true;
          this.searchLoader = false;
          this.medicalLists = res.medicalLists;
        }, (error) => {
          this.messageService.add({
            key: 'bc',
            severity: 'error',
            summary: 'Error',
            detail: error.message
          });
        });
      } else {
        this.getAllChemistList(this.city, this.position, this.area);
      }
    });
  }

  ngAfterViewInit(): void {
    if (!this.medicalLists) {
      this.chemistFind = false;
      this.getGeoLocation();
    }
  }
  
  ngOnInit(): void {}

  getGeoLocation() {
    const apiKey = Constants.mapplsAppKey;

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.position['lat'] = position.coords.latitude;
        this.position['lng'] = position.coords.longitude;

        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${this.position.lat}&lon=${this.position.lng}&format=json`)
          .then(response => response.json())
          .then(data => {
            this.area = data.address?.town || data.address?.county || data.address?.village || data.address?.suburb;
            this.city = data.address?.city_district || data.address?.state_district || data.address?.region;
            this.errorMessageEnable = false;
            this.getAllChemistList(this.city, this.position, this.area);
            this.errorMessage = null;
          })
          .catch(error => {
            this.errorMessage = 'Please enable location services and then click the button to request location.';
            this.errorMessageEnable = true;
            this.requestLocation(); // Prompt user to request location
          });
      }, (err) => {
        this.errorMessage = 'Please enable location services.';
        this.errorMessageEnable = true;
        this.requestLocation(); // Prompt user to request location
      });
    } else {
      alert("Geolocation is not supported in this browser.");
    }
  }

  requestLocation() {
    this.loadingService.setLoading(true);
    navigator.geolocation.getCurrentPosition((position) => {
        this.position['lat'] = position.coords.latitude;
        this.position['lng'] = position.coords.longitude;

        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${this.position.lat}&lon=${this.position.lng}&format=json`)
        .then(response => response.json())
        .then(data => {
          this.errorMessageEnable = false;
          this.area = data.address?.town || data.address?.county || data.address?.village || data.address?.suburb;
          this.city = data.address?.city_district || data.address?.state_district || data.address?.region;
          this.getAllChemistList(this.city, this.position, this.area);
          this.errorMessage = null;
          this.errorMessageEnable = false;
          this.loadingService.setLoading(false);
        }).catch(error => {
          this.loadingService.setLoading(false);
          this.errorMessage = 'An error occurred while getting location. Please try again.';
        });
    }, (error) => {
      this.loadingService.setLoading(false);
      this.errorMessage = 'User denied the request for Geolocation. Please enable location services and then click the button to request location.';
    });
  }

  getAllChemistList(city: string, position: any, area?: any): void {
    this.doctorService.getAllChemistList(city, position, area).subscribe((res: any) => {
      this.medicalLists = res.medicalLists;
      this.chemistFind = true;
    }, (error) => {
      this.messageService.add({
        key: 'bc',
        severity: 'error',
        summary: 'Error',
        detail: error.message
      });
    });
  }

  isSearch(): void {
    this.search = true;
    this.searchValue = '';
  }

  searchClose(): void {
    this.search = false;
    this.searchLoader = false;
    this.getAllChemistList(this.city, this.position, this.area);
  }

  searchHappen(value: any) {
    this.applyFilter(this.searchValue);
  }

  applyFilter(filterValue: string) {
    this.searchTerms.next(filterValue);
  }
}

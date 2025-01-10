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
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    if (!this.medicalLists) {
      // if (this.util.getItemToLocalStorage('city') && this.util.getItemToLocalStorage('area')) {
      //   this.city = this.util.getItemToLocalStorage('city').toLowerCase();
      //   this.area = this.util.getItemToLocalStorage('area').toLowerCase();
      //   this.getAllChemistList(this.city, this.area);
      // } else {
      //   this.chemistFind = false;
      //   this.getGeoLocation();
      // }
      this.chemistFind = false;
      this.getGeoLocation();
    }

  }
  ngOnInit(): void {}

  getGeoLocation() {

    const apiKey = Constants.mapplsAppKey;

    // Check if the browser supports Geolocation
    if ("geolocation" in navigator) {
      // Get the user's current position
      navigator.geolocation.getCurrentPosition((position) => {
        // const latitude = position.coords.latitude;
        // const longitude = position.coords.longitude;
        this.position['lat'] = position.coords.latitude;
        this.position['lng'] = position.coords.longitude;
        // for delhi use 
        // this.position['lat'] = '28.623999';
        // this.position['lng'] = '77.03520';

        // Use Nominatim API for reverse geocoding
        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${this.position.lat}&lon=${this.position.lng}&format=json`)
          .then(response => response.json())
          .then(data => {
            console.log(data);
            this.area = data.address?.town || data.address?.county || data.address?.village || data.address?.suburb;
            this.city = data.address?.city_district || data.address?.state_district || data.address?.region;
            // const displayNameArray = data.display_name.split(',');
            console.log(this.area)
            console.log(this.city)
            // Get the second last value (city) from the array
            // this.city = displayNameArray[displayNameArray.length - 2].trim();
            // this.area = displayNameArray[0].trim().toLowerCase();
            // this.city = displayNameArray[1].trim().toLowerCase();
            // this.util.setItemToLocalStorage('city', this.city);
            // this.util.setItemToLocalStorage('area', this.area);
            this.errorMessageEnable = false;
            this.getAllChemistList(this.city, this.position, this.area);
            this.errorMessage = null;
          })
          .catch(error => {
            console.error('Error fetching address:', error);
            this.errorMessage = 'Please enable location services and then click Ok button.';
            this.errorMessageEnable = true;
          });
      }, (err) => {
        console.log(err)
        this.errorMessage = 'Please enable location services.';
        this.errorMessageEnable = true;
      });
    } else {
      alert("Geolocation is not supported in this browser.");
    }
    // Google Map Configuration
    // navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
  }

  requestLocation() {
    this.loadingService.setLoading(true);
    navigator.geolocation.getCurrentPosition((position) => {
        this.position['lat'] = position.coords.latitude;
        this.position['lng'] = position.coords.longitude;

        // Use Nominatim API for reverse geocoding
        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${this.position.lat}&lon=${this.position.lng}&format=json`)
        .then(response => response.json())
        .then(data => {
          this.errorMessageEnable = false;
          console.log(data);
          this.area = data.address?.town || data.address?.county || data.address?.village || data.address?.suburb;
          this.city = data.address?.city_district || data.address?.state_district || data.address?.region;
          this.getAllChemistList(this.city, this.position, this.area);
          this.errorMessage = null;
          this.errorMessageEnable = false;
          this.loadingService.setLoading(false);
        }).catch(error => {
          console.error('Error getting location:', error);
          this.loadingService.setLoading(false);
          switch (error.code) {
            case error.PERMISSION_DENIED:
              this.errorMessage = 'User denied the request for Geolocation. Please enable location services and then click Ok button.';
              break;
            case error.POSITION_UNAVAILABLE:
              this.errorMessage = 'Location information is unavailable.';
              break;
            case error.TIMEOUT:
              this.errorMessage = 'The request to get user location timed out.';
              break;
            case error.UNKNOWN_ERROR:
              this.errorMessage = 'An unknown error occurred.';
              break;
          }
            });
    }, (error) => {
      this.loadingService.setLoading(false);
      switch (error.code) {
        case error.PERMISSION_DENIED:
          this.errorMessage = 'User denied the request for Geolocation. Please enable location services and then click Ok button.';
          break;
        case error.POSITION_UNAVAILABLE:
          this.errorMessage = 'Location information is unavailable.';
          break;
        case error.TIMEOUT:
          this.errorMessage = 'The request to get user location timed out.';
          break;
          default: 
          this.errorMessage = 'Please enable location services.';
          break;
      }
    });
  }

  //    reverseGeocode(latitude: any, longitude: any, apiKey: any): void{
  //     // Construct the API endpoint
  //     const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;
  //     console.log(apiUrl)
  //     // Make a GET request to the Google Maps Geocoding API
  //     fetch(apiUrl)
  //         .then(response => response.json())
  //         .then(data => {
  //             if (data.status === "OK" && data.results[0]) {
  //                 // Extract the formatted address from the API response
  //                 const formattedAddress = data.results[0].formatted_address;
  //                 console.log("Address:", formattedAddress);
  //             } else {
  //                 console.error("Error: Unable to retrieve address");
  //             }
  //         })
  //         .catch(error => {
  //             console.error("Error:", error.message);
  //         });
  // }

  getAllChemistList(city: string, position: any, area?: any): void {
    this.doctorService.getAllChemistList(city, position, area).subscribe((res: any) => {
      this.medicalLists = res.medicalLists;
      this.chemistFind = true;
      // this.messageService.add({ key: 'bc', severity: 'success', summary: 'Error', detail: 'Something went wrong' });
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
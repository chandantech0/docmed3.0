import { Component, ElementRef, OnInit, ViewChild, Renderer2, ViewChildren, QueryList} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { UtilsService } from 'src/app/shared/utility';
import { AuthAPIService } from '../auth.api.service';
import * as constant from '../../shared/constant';
import { ToastMessageService } from 'src/app/shared/toast-message.service';
import { LoadingService } from 'src/app/shared/loading.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  providers: [MessageService]
})
export class SignupComponent implements OnInit {
  userName = '';
  password: any;
  signUpForm: FormGroup;
  signUpOtpWindow = false;
  otp: string = '';
  city: any;
  area: any;
  emailForVerifiedAgain: any;
  userType: any;
  validationError: string | null = null;
  validationErrorForEmail: string |  null = null;
  errorMessage: string = '';
  errorMessageEnable: boolean = false;
  constructor(
    private AuthAPIService: AuthAPIService,
    private messageService: MessageService,
    private fb: FormBuilder,
    private router: Router,
    private utilService: UtilsService,
    private toaster: ToastMessageService,
    private route: ActivatedRoute,
    private loadingService: LoadingService
    ) { 
      this.signUpForm = this.fb.group({
        userType: ['user', Validators.required],
        userTypeSub: ['simple_user'],
        name: ['', Validators.required],
        email: ['', Validators.required],
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
        phone: ['', Validators.required],
        Address: [''],
        LicenseNumber: [''],
        pinCode: [''],
        RegistrationDate: [''],
        city: [''],
        chemistName: [''],
        area: [''],
        lat: [''],
        lng: [''],
        // medicalLicense: [{ value: '', disabled: true }, Validators.required], // Optional field for doctors
      });
 
    }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.emailForVerifiedAgain = params['emailForVerifiedAgain'] || null;
      this.userType = params['userType'] || null;
      if (this.emailForVerifiedAgain && this.userType) {
        this.signUpForm.controls['email'].patchValue(this.emailForVerifiedAgain.toLowerCase());
        this.signUpForm.controls['userType'].patchValue(this.userType);
        this.signUpOtp();
        this.signUpOtpWindow = true;
      }
    });
  }


  signUpOtp() {
    if (this.signUpForm.controls['userType'].value === 'user') {
      this.loadingService.setLoading(true);
    this.AuthAPIService.signUpOtp(this.signUpForm.controls['email'].value.toLowerCase()).subscribe((res) => {
      this.loadingService.setLoading(false);
      if (res.status === "Success") {
        this.messageService.add({ key: 'bc', severity: 'success', summary: 'success', detail: res.message });
        this.signUpOtpWindow = true;
      } else {
        this.messageService.add({ key: 'bc', severity: 'success', summary: 'success', detail: res.message });
      }
    },(error) => {
      this.loadingService.setLoading(false);
      this.messageService.add({ key: 'bc', severity: 'error', summary: 'Error', detail: error.message });
    });
  }
  else {
    this.loadingService.setLoading(true);
    this.AuthAPIService.signUpOtpChemist(this.signUpForm.controls['email'].value.toLowerCase()).subscribe((res) => {
      this.loadingService.setLoading(false);
      if (res.status === "Success") {
        this.messageService.add({ key: 'bc', severity: 'success', summary: 'success', detail: res.message });
        this.signUpOtpWindow = true;
      } else {
        this.messageService.add({ key: 'bc', severity: 'success', summary: 'success', detail: res.message });
      }
    },(error) => {
      this.loadingService.setLoading(false);
      this.messageService.add({ key: 'bc', severity: 'error', summary: 'Error', detail: error.message });
    });
  }
  }
  
  signUp() {
    const isPasswordMatch = this.utilService.arePasswordsMatching(this.signUpForm.controls['password'].value,
     this.signUpForm.controls['confirmPassword'].value);
     if (!isPasswordMatch) {
      this.messageService.add({ key: 'bc', severity: 'error', summary: 'Error', detail: 'Password does not match' });
      return;
     }
     this.signUpForm.controls['email'].setValue(this.signUpForm.controls['email'].value.toLowerCase());
     this.signUpForm.controls['city'].setValue(this.signUpForm.controls['city'].value.toLowerCase());
     this.signUpForm.controls['area'].setValue(this.signUpForm.controls['area'].value.toLowerCase());
     if (this.signUpForm.controls['userType'].value === 'user') {
      this.loadingService.setLoading(true);
       this.AuthAPIService.signUp(this.signUpForm.value).subscribe((res) => {
        this.loadingService.setLoading(false);
         if (res.status === "Success") {
          setTimeout(() => {
            this.signUpOtp();
          }, 500);
         } else {
           this.messageService.add({ key: 'bc', severity: 'error', summary: 'Error', detail: res.message });
         }
       },(error) => {
        this.loadingService.setLoading(false);
         this.messageService.add({ key: 'bc', severity: 'error', summary: 'Error', detail: 'Something went wrong! If user exist try login.' });
       });
     } else {
      this.loadingService.setLoading(true);
      this.AuthAPIService.signUpForChemist(this.signUpForm.value).subscribe((res) => {
        this.loadingService.setLoading(false);
        if (res.status === "Success") {
         setTimeout(() => {
           this.signUpOtp();
         }, 500);
        } else {
          this.messageService.add({ key: 'bc', severity: 'error', summary: 'Error', detail: res.message });
        }
      },(error) => {
        this.loadingService.setLoading(false);
        this.messageService.add({ key: 'bc', severity: 'error', summary: 'Error', detail: 'Something went wrong! If user exist try login.' });
      });
     }
  }

  submitOtp() {
    const obj = {
      email: this.signUpForm.controls['email'].value.toLowerCase(),
      enteredOtp: this.otp
    }
    if (this.signUpForm.controls['userType'].value === 'user') {
    this.loadingService.setLoading(true);
    this.AuthAPIService.signUpOtpSubmit(obj).subscribe((res) => {
      this.loadingService.setLoading(false);
      if (res.status === "Success") {
       this.toaster.showSuccessToast(res.message)
        this.router.navigate(['/login']);
      } else {
         this.toaster.showErrorToast(res.message)
      }
    },(error) => {
      this.loadingService.setLoading(false);
       this.toaster.showErrorToast(error.message)
    });
  } else {
    this.loadingService.setLoading(true);
    this.AuthAPIService.signUpOtpSubmitChemist(obj).subscribe((res) => {
      this.loadingService.setLoading(false);
      if (res.status === "Success") {
       this.toaster.showSuccessToast(res.message)
        this.router.navigate(['/login']);
      } else {
         this.toaster.showErrorToast(res.message)
      }
    },(error) => {
      this.loadingService.setLoading(false);
       this.toaster.showErrorToast(error.message)
    });
  }
  }


  userTypeData(userType: string) {
    if (userType === 'chemist') {
      this.signUpForm.get('pinCode')?.setValidators(Validators.required);
      this.signUpForm.get('LicenseNumber')?.setValidators(Validators.required);
      this.signUpForm.get('RegistrationDate')?.setValidators(Validators.required);
      this.signUpForm.get('city')?.setValidators(Validators.required);
      this.signUpForm.get('Address')?.setValidators(Validators.required);
      this.signUpForm.get('chemistName')?.setValidators(Validators.required);
      this.signUpForm.get('area')?.setValidators(Validators.required);
      this.signUpForm.get('lat')?.setValidators(Validators.required);
      this.signUpForm.get('lng')?.setValidators(Validators.required);

      this.signUpForm.get('pinCode')?.updateValueAndValidity();
      this.signUpForm.get('LicenseNumber')?.updateValueAndValidity();
      this.signUpForm.get('RegistrationDate')?.updateValueAndValidity();
      this.signUpForm.get('city')?.updateValueAndValidity();
      this.signUpForm.get('Address')?.updateValueAndValidity();
      this.signUpForm.get('chemistName')?.updateValueAndValidity();
      this.signUpForm.get('area')?.updateValueAndValidity();
      this.signUpForm.get('lat')?.updateValueAndValidity();
      this.signUpForm.get('lng')?.updateValueAndValidity();

      this.signUpForm.controls['userTypeSub'].patchValue('');
    } else {
      this.signUpForm.get('pinCode')?.removeValidators(Validators.required);
      this.signUpForm.get('LicenseNumber')?.removeValidators(Validators.required);
      this.signUpForm.get('RegistrationDate')?.removeValidators(Validators.required);
      this.signUpForm.get('city')?.removeValidators(Validators.required);
      this.signUpForm.get('Address')?.removeValidators(Validators.required);
      this.signUpForm.get('chemistName')?.removeValidators(Validators.required);
      this.signUpForm.get('area')?.removeValidators(Validators.required);
      this.signUpForm.get('lat')?.removeValidators(Validators.required);
      this.signUpForm.get('lng')?.removeValidators(Validators.required);

      this.signUpForm.get('pinCode')?.updateValueAndValidity();
      this.signUpForm.get('LicenseNumber')?.updateValueAndValidity();
      this.signUpForm.get('RegistrationDate')?.updateValueAndValidity();
      this.signUpForm.get('city')?.updateValueAndValidity();
      this.signUpForm.get('Address')?.updateValueAndValidity();
      this.signUpForm.get('chemistName')?.updateValueAndValidity();
      this.signUpForm.get('area')?.updateValueAndValidity();
      this.signUpForm.get('lat')?.updateValueAndValidity();
      this.signUpForm.get('lng')?.updateValueAndValidity();
     
    }
  }

  checkPinCode() {
    const pinCodeInput = document.getElementById('pinCodeInput') as HTMLInputElement;
    const zipCode = pinCodeInput.value;
    if (zipCode.length === 6) {
      this.loadingService.setLoading(true);
      // Make an API request (replace with the actual mappls API endpoint)
      const apiKey = constant.mapplsAppKey;
      // Use a reverse geocoding API endpoint that supports zip codes
      fetch(`https://nominatim.openstreetmap.org/search?postalcode=${zipCode}&format=json`)
        .then(response => response.json())
        .then(data => {
          this.loadingService.setLoading(false);
          const firstLetterOfArea = data[0] ? this.extractArea(data[0].display_name) : null;
          this.area = firstLetterOfArea;
          console.log(this.area);
          if(this.area) {
            this.signUpForm.controls['area'].patchValue(this.area);
          }
          const displayNameArray = data[0].display_name.split(',');
          // Get the second last value (city) from the array
          const city = displayNameArray[displayNameArray.length - 2].trim();
          this.city = city;
          if(this.city) {
            this.signUpForm.controls['city'].patchValue(this.city);
          }
          console.log(this.city);
        })
        .catch(error => {
          console.error('Error fetching address:', error);
        });
    }
  }

   extractArea(displayName: string) {
    // Use a regular expression to find the first sequence of alphabetic characters
    const match = displayName.match(/[A-Za-z]+/);
    
    // If a match is found, return it; otherwise, return a default value or null
    return match ? match[0] : null;
}

  onMobileNumberInput(event: Event): void {
    this.validationError = null; // Reset error on every input

    // Validate the mobile number on keypress
    const inputValue = (event.target as HTMLInputElement).value;
    const isValid = this.utilService.validateMobileNumber(inputValue);

    if (!isValid) {
      this.validationError = 'Invalid mobile number format';
    }
  }

  validateEmail(event: Event): void {
    this.validationErrorForEmail = null; // Reset error on every input

    // Validate the mobile number on keypress
    const inputValue = (event.target as HTMLInputElement).value;
    const isValid = this.utilService.validateEmail(inputValue);

    if (!isValid) {
      this.validationErrorForEmail = 'Invalid Email Address format';
    }
  }

  getGeoLocation() {
    // Check if the browser supports Geolocation
    if ("geolocation" in navigator) {
      // Get the user's current position
      this.loadingService.setLoading(true);
      navigator.geolocation.getCurrentPosition((position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        this.signUpForm.patchValue({
          lat: latitude,
          lng: longitude
        })
        this.errorMessageEnable = false;
        this.errorMessage = '';
        this.loadingService.setLoading(false);
      }, (error) => {
        this.errorMessageEnable = true;
        this.loadingService.setLoading(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            this.errorMessage = 'User denied the request for Geolocation. Please enable location services and then click Ok button';
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
    } else {
      alert("Geolocation is not supported in this browser.");
    }
    // Google Map Configuration
    // navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
  }
}

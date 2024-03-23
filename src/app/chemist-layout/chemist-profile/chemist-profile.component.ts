import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChemistModuleService } from '../service/chemist-module.service';
import { ToastrService } from 'ngx-toastr';
import { LoadingService } from 'src/app/shared/loading.service';
import { AuthenticateService } from 'src/app/auth/authenticate.service';
import { UtilsService } from 'src/app/shared/utility';
@Component({
  selector: 'app-chemist-profile',
  templateUrl: './chemist-profile.component.html',
  styleUrls: ['./chemist-profile.component.scss']
})
export class ChemistProfileComponent implements OnInit {
  editMode = false;
  profileForm!: FormGroup;
  imagePreview: string = '';
  chemistId: any;
  profileData: any;
  validationError: any;
  constructor(
    private fb: FormBuilder,
    private chemistService: ChemistModuleService,
    private toastService: ToastrService,
    private loadingService: LoadingService,
    private auth: AuthenticateService,
    private util: UtilsService
  ) {
    this.auth.userLogId.subscribe((res: any) => {
      if (res) {
        this.chemistId = res;
      }
    });
   }

  ngOnInit(): void {
    this.loadingService.setLoading(true);
    setTimeout(() => {
      this.getProfileData();
    }, 500);
  }

  getProfileData() {
    const obj = {
      chemistId: this.chemistId
    }
    this.chemistService.getProfile(obj).subscribe((res: any) => {
      this.loadingService.setLoading(false);;
      if (res.status === 'Success') {
        this.profileData = (res || {}).data;
      } else {
        this.toastService.error( res.message);
      }
    }, (error: { message: any; }) => {
      this.loadingService.setLoading(false);
      this.toastService.error( error.message);
    });
  }

  imageFileTypeValidator(allowedExtensions: string[]) {
    return (control: any): { [key: string]: any } | null => {
      const file = control.value as File;

      if (!file) {
        return null; // Return null for non-File values
      }

      const fileName = file.name || '';
      const fileExtension = fileName.toLowerCase().split('.').pop();

      if (fileExtension && allowedExtensions.includes(fileExtension)) {
        return null; // No error if it's a valid image type
      } else {
        return { invalidImageType: true };
      }
    };
  }

  toggleEditForm(): void {
    this.editMode = !this.editMode;
    if (this.editMode) {
      this.profileForm = this.fb.group({
        // chemistName: [this.profileData?.chemist_name, Validators.required],
        // userEmailId: ['', [Validators.required, Validators.email]],
        phoneNumber: [this.profileData?.phone, Validators.required],
        photo: [null, [Validators.required, this.imageFileTypeValidator(['jpg', 'jpeg', 'png', 'gif'])]],
      });
      if (this.profileData.chemist_profile_image !== '' && this.profileData.chemist_profile_image !== null) {
        const ev: any = {
          target : {
            files: [this.profileData.chemist_profile_image]
          }
        }
        this.onImagePicked(ev);
      }
    }
  }

  saveChanges(): void {
    if (this.validationError) { return };
    if (!this.profileForm.valid) {
      return
    } 
      this.loadingService.setLoading(true);
      const formData = new FormData();
      formData.append("chemistId", this.chemistId);
      // formData.append("chemistName", this.profileForm.get('chemistName')?.value);
      // formData.append("userEmailId", this.profileForm.get('userEmailId')?.value);
      formData.append("phoneNumber", this.profileForm.get('phoneNumber')?.value);
      formData.append("image", this.profileForm.get('photo')?.value);

      this.chemistService.updateChemist(formData).subscribe((res: any) => {
        this.loadingService.setLoading(false);;
        if (res.status === 'Success') {
          this.toastService.success( res.message);
          this.getProfileData();
          setTimeout(() => {
            this.toggleEditForm(); // Close the form after saving changes
          }, 500);
        } else {
          this.toastService.error( res.message);
        }
      }, (error: { message: any; }) => {
        this.loadingService.setLoading(false);
        this.toastService.error( error.message);
      });
  }


  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files;
    if (!file || file.length === 0) {
      return;
    }
  
    const selectedFile = file[0];
  
    // Check if the file size is greater than 2MB
    if (selectedFile.size > 2 * 1024 * 1024) {
      this.toastService.error('File size exceeds 2MB limit');
      return;
    }
  
    this.profileForm.patchValue({ photo: selectedFile });
  
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(selectedFile);
  }
  

  resetToBack() {
    this.toggleEditForm();
    this.profileForm.reset();
  }

    // mobile number validate
    onMobileNumberInput(event: Event): void {
      this.validationError = null; // Reset error on every input
  
      // Validate the mobile number on keypress
      const inputValue = (event.target as HTMLInputElement).value;
      const isValid = this.util.validateMobileNumber(inputValue);
  
      if (!isValid) {
        this.validationError = 'Invalid mobile number format';
      }
    }
}

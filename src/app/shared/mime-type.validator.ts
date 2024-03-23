import { AbstractControl, ValidatorFn, ValidationErrors } from "@angular/forms";

export function imageFileTypeValidator(allowedExtensions: string[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value || !(control.value instanceof File)) {
      return null; // Return null for non-File values
    }
    console.log('fire first')
    const file = control.value as File;
    const fileName = file.name.toLowerCase();
    const fileExtension = fileName.split('.').pop();
    console.log('fire')
    if (fileExtension && allowedExtensions.includes(fileExtension)) {
      console.log(fileExtension)
      return null; // No error if it's a valid image type
    } else {
      return { invalidImageType: true };
    }
  };
}

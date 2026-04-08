import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';


export function PhoneNumberValidator(control:AbstractControl): ValidationErrors|null {
  const value = control.value;
  const regEx = /01[0125]\d{8}/
  if (value && !regEx.test(value)) return {PhoneNumber:{message:"Invalid Phone"}}
  return null;  
}

export function PasswordConfirmValidator(form: AbstractControl): ValidationErrors|null{
  form = form as FormGroup
  const password1: string = form.get('credentials.password1')?.value
  const password2: string = form.get('credentials.password2')?.value
  if (password1 !== password2){return {"unconfirmed":true}}
  return null
}
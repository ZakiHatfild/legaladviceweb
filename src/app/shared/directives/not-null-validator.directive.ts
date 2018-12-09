import {ValidatorFn, AbstractControl} from '@angular/forms';

export function NotNullValidator(): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
  	console.log(control.value);
    return control.value && !control.disabled && control.status == 'VALID' ? null : {'nullValue': {value: control.value}};
  };
}
import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidatorsService {

  constructor() { }

  notZero(control: FormControl) {
    var val = control.value
    let isValid = false;
    if(val === 0 || val < 0){
      isValid = false;
    } else {
      isValid = true;
    }
    return isValid ? null : { 'notzero': true };
  }
}

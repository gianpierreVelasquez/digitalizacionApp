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

  notHundred(control: FormControl) {
    var val = control.value
    let isValid = false;
    if(val > 100){
      isValid = false;
    } else {
      isValid = true;
    }
    return isValid ? null : { 'nothundred': true };
  }

  notNull(control: FormControl) {
    var val = control.value
    let isValid = false;
    
    if(val === null){
      isValid = false;
    } else {
      isValid = true;
    }
    return isValid ? null : { 'notNull': true };
  }

  noWhitespaceValidatorForString(control: FormControl) {
    const isWhitespace = (control.value || "").trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

  noWhitespaceValidatorForNumber(control: FormControl) {
    var val = control.value
    const isWhitespace = (val.toString() || "").trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }
}

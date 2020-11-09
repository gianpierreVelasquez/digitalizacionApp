import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor() { }

  getSession(key: string): any {
    const stringified = sessionStorage.getItem(key);
    if (stringified) {
      const json = JSON.parse(stringified);
      return json.data;
    }
    return stringified;
  }

  setSession(key: string, value: any): any {
    return sessionStorage.setItem(key, JSON.stringify({ data: value }));
  }

  getAuthorizationToken() {
    const token = sessionStorage.getItem(environment.KEYS.TOKEN);
    return token;
  }

  removeSession(key: string): any {
    sessionStorage.removeItem(key);
  }
}

import { Injectable } from '@angular/core';
import * as forge from 'node-forge'
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  //private pubKey = env.default.pubk;
  private privatekey = environment.RPRK;

  constructor() { }

  public decrypt1(text: string) {
    var pki = forge.pki;
    var privateKey = pki.privateKeyFromPem(this.privatekey);
    var str = forge.util.decode64(text);
    var decrypted = privateKey.decrypt(str);
    return decrypted;
  }

}

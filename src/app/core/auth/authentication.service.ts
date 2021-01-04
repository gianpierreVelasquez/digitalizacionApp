import { Injectable } from '@angular/core';
//import * as env from './psconfig.json';
import * as forge from 'node-forge'

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  //private pubKey = env.default.pubk;

  constructor() { }

  prueba(){
    //console.log(this.pubKey);
  }

  // public Decrypt(text: string) {
  //   var pki = forge.pki;

  //   var privateKey = pki.privateKeyFromPem(this.privatekey);

  //   var str = forge.util.decode64(text);

  //   var decrypted = privateKey.decrypt(str, 'RSA-OAEP', {
  //     md: forge.md.sha1.create(),
  //     mgf1: {
  //       md: forge.md.sha1.create()
  //     }
  //   });

  //   return decrypted;
  // }

  // public DecryptLabelChart(text: string) {

  //   var arr: any = [];

  //   var pki = forge.pki;

  //   var privateKey = pki.privateKeyFromPem(this.privatekey);

  //   var arrText = text.split(' - ');

  //   arrText.forEach(e => {
  //     var str = forge.util.decode64(e);

  //     var decrypted = privateKey.decrypt(str, 'RSA-OAEP', {
  //       md: forge.md.sha1.create(),
  //       mgf1: {
  //         md: forge.md.sha1.create()
  //       }
  //     });
  //     return arr.push(decrypted)
  //   })

  //   return arr[0] + ' - ' + arr[1];
  // }
}

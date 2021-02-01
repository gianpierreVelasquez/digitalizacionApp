import { Injectable } from '@angular/core';
import * as forge from 'node-forge'
import { environment } from 'src/environments/environment';
import { SessionService } from '../services/session.service';
import { UtilService } from '../services/util.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  //private pubKey = env.default.pubk;
  private privatekey = '';

  constructor(private session: SessionService, private util: UtilService) { }

  public decrypt1(text: string) {
    var pki = forge.pki;
    var privateKey = pki.privateKeyFromPem(this.privatekey);
    var str = forge.util.decode64(text);
    var decrypted = privateKey.decrypt(str);
    return decrypted;
  }

    //Token Authentication
    checkTokenValidation() {
      var resp: boolean;
      const nowDate = new Date()
      var tokenObj = this.session.getSession(environment.KEYS.TOKEN);
      if (tokenObj.token.length > 0) {
        var timestamp = tokenObj.exp;
        const date = new Date(timestamp * 1000)
        // var formatDate = date.toLocaleString() //2019-12-9 10:30:15
        if (nowDate >= date) {
          Swal.fire({
            icon: 'warning',
            title: 'Sesion Expirada',
            text: 'Refrescar sesión',
            showCancelButton: false,
            confirmButtonColor: '#28a745',
            confirmButtonText: 'Refrescar',
            allowOutsideClick: false
          }).then((result) => {
            if (result.value) {
              this.util.tokenNeedsUpdate.next(true)
            }
          })
        } else {
          this.util.tokenNeedsUpdate.next(false)
        }
      }
      return resp;
    }

}

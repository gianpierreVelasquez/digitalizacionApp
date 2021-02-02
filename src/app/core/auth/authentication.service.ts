import { Injectable } from '@angular/core';
import * as forge from 'node-forge'
import { environment } from 'src/environments/environment';
import { SessionService } from '../services/session.service';
import { UtilService } from '../services/util.service';
import Swal from 'sweetalert2';
import * as Djson from '../../../assets/digitalizacionAppConfig.json';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private configVar: any = (Djson as any).default;

  constructor(private session: SessionService, private util: UtilService) { }

  public encrypt(text: string) {

    var data; var codApp; var pk; var decrypted;
    var appsJson: any[] = this.configVar;
    // URLParams codApp
    codApp = this.session.getSession(environment.KEYS.CODE_APP);
    if (codApp != null) {
      data = appsJson.find(x => x.id == codApp);
      
      if (data) {
        pk = data.privateKey;
        
        var pki = forge.pki;

        var privateKey = pki.privateKeyFromPem(pk);

        var publicKey = pki.setRsaPublicKey(privateKey.n, privateKey.e);

        var encrypted = publicKey.encrypt(text, 'RSA-OAEP', {
          md: forge.md.sha1.create(),
          mgf1: {
            md: forge.md.sha1.create()
          }
        });
        
        var encoded = forge.util.encode64(encrypted);

        return encoded;
      }
    }
  }

  public decrypt(text: string) {
    var data; var codApp; var pk; var decrypted;
    var appsJson: any[] = this.configVar;
    // URLParams codApp
    codApp = this.session.getSession(environment.KEYS.CODE_APP);
    if (codApp != null) {
      data = appsJson.find(x => x.id == codApp);

      if (data) {
        pk = data.privateKey;

        var pki = forge.pki;
        var privateKey = pki.privateKeyFromPem(pk);
        var str = forge.util.decode64(text);

        decrypted = privateKey.decrypt(str, 'RSA-OAEP', {
          md: forge.md.sha1.create(),
          mgf1: {
            md: forge.md.sha1.create()
          }
        });

        return decrypted;
      }
    }
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

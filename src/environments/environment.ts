// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // BASE_API_URL: 'https://api.pre.mapfre.com.pe/app/api/core/v1.0',
  // Pruebas
  BASE_API_URL: 'https://api.pre.mapfreperu.com/internal',
  KEYS: {
    TOKEN: 'token',
    PARAMS: 'params',
    ENTITY: 'entity',
    PRODUCT: 'product',
    REQUEST: 'request',
    URL_PARAM: 'url_param',
    CODE_APP: 'code_app',
    INSURED: 'insureds'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './AuthInterceptor.service';

export const httpInterceptorProvider = [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
];
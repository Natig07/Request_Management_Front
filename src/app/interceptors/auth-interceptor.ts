// src/app/interceptors/auth.interceptor.ts
import { inject } from '@angular/core';
import { HttpRequest, 
         HttpInterceptorFn, 
         HttpHandlerFn, 
         HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth';

export const AuthInterceptor : HttpInterceptorFn=( 
  req: HttpRequest<unknown>, 
  next: HttpHandlerFn) : Observable<HttpEvent<unknown>>=>{
   const authserv = inject(AuthService);

   const token= authserv.getToken();

   if(token){
    const cloned = req.clone({
      setHeaders:{
        Authorization:`Bearer ${token}`,
      },
    });
    return next(cloned);
   }
  return next(req); 
} 

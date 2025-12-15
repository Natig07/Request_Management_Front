import { TestBed } from '@angular/core/testing';
import { HttpInterceptorFn, HttpHandler } from '@angular/common/http';

import { AuthInterceptor } from './auth-interceptor';
import { Observable } from 'rxjs';

describe('AuthInterceptor', () => {
  const interceptor: HttpInterceptorFn = (req, next) => 
    TestBed.runInInjectionContext(() => TestBed.inject(AuthInterceptor).intercept(req, { handle: next } as HttpHandler));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthInterceptor],
    });
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });
});

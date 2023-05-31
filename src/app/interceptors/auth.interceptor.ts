import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Injectable, Injector} from "@angular/core";
import {Observable, of, switchMap} from "rxjs";
import {AuthService} from "../services/auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private injector: Injector) {
  }

  protected get authService(): AuthService {
    return this.injector.get(AuthService);
  }

  intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return of(this.authService.token)
      .pipe(switchMap((token: string) => {
        if (token) {
          const bearer = `Bearer ${token}`;
          httpRequest = httpRequest.clone({
            setHeaders: {
              Authorization: bearer
            }
          });
        }
        return next.handle(httpRequest);
      }));
  }
}

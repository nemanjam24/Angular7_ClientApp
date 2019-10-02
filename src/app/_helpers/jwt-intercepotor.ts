import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountService } from '../services/account.service';
import { take, switchMap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class JwtInterceptor implements HttpInterceptor{
    constructor(private accService : AccountService){}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let token = localStorage.getItem('jwt');

        return this.accService.isLoggedIn.pipe(
            take(1),
            switchMap(
                (loginStatus : boolean) => {
                    if(loginStatus && token !== undefined){
                        const cloneRequest = req.clone({
                            setHeaders: {
                                Authorization: 'Bearer ' + token
                            }
                        });

                        return next.handle(cloneRequest);
                    }
                    else{
                        return next.handle(req);
                    }
                }
            )
        )
    }

}
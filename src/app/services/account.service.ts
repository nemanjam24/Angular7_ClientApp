import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators'
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private baseUrlLogin: string = 'http://localhost:50112/api/account/login';
  private baseUrlRegister: string = 'http://localhost:50112/api/account/register';

  private loginStatus = new BehaviorSubject<boolean>(this.checkLoginStatus());
  private userName = new BehaviorSubject<string>(localStorage.getItem('username'));
  private userRole = new BehaviorSubject<string>(localStorage.getItem('userRole'));

  constructor(private http: HttpClient, private router: Router) { }

  register(username: string, password: string, email: string){
    return this.http.post<any>(this.baseUrlRegister, { username, password, email })
    .pipe(
      map(response => {
        return response;
      }, 
      error => {
        return error;
      })
    );
  }

  login(userName: string, password: string){
    return this.http.post<any>(this.baseUrlLogin, { userName, password })
      .pipe(
        map(response => {
          if(response && response.token){
            this.loginStatus.next(true);
            localStorage.setItem('loginStatus', '1');
            localStorage.setItem('jwt', response.token);
            localStorage.setItem('username', response.username);
            localStorage.setItem('userRole', response.role);
            localStorage.setItem('expiration', response.expiration);
            this.userName.next(localStorage.getItem("username"));
            this.userRole.next(localStorage.getItem("userRole"));
          }

          return response;
        })
      );
  }

  logout(){
    this.loginStatus.next(false);
    localStorage.removeItem('loginStatus');
    localStorage.removeItem('jwt');
    localStorage.removeItem('username');
    localStorage.removeItem('userRole');
    localStorage.removeItem('expiration');

    this.router.navigate(['/login']);
    console.log('Logged out successfully');
  }

  get isLoggedIn(){
    return this.loginStatus.asObservable();
  }

  get currentUserName(){
    return this.userName.asObservable();
  }

  get currentUserRole(){
    return this.userRole.asObservable();
  }

  private checkLoginStatus(): boolean{
    let loginCookie = localStorage.getItem('loginStatus');
    if(loginCookie == "1")
    {
      return true;
    }

    return false;
  }
}

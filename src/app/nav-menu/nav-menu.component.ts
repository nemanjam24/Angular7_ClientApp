import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountService } from '../services/account.service';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit {
  loginStatus$ : Observable<boolean>;
  UserName$ : Observable<string>;
  
  constructor(private accService: AccountService, private productService: ProductService) { }

  ngOnInit() {
    this.loginStatus$ = this.accService.isLoggedIn;
    this.UserName$ = this.accService.currentUserName;
  }

  onLogout(){
    this.productService.clearCache();
    this.accService.logout();
  }

}

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AccountService } from '../services/account.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  insertForm: FormGroup;
  Username: FormControl;
  Password: FormControl;
  returnUrl: string;
  ErrorMessage: string;
  invalidLogin: boolean;

  constructor(private accService: AccountService, 
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.Username = new FormControl('', [Validators.required]);
    this.Password = new FormControl('', [Validators.required]);

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    this.insertForm = this.fb.group({
      'Username': this.Username,
      'Password': this.Password
    })
  }

  onSubmit(){
    let userLogin = this.insertForm.value;
    
    this.accService.login(userLogin.Username, userLogin.Password).subscribe(
      response => {
        let token = (<any>response).token;
        console.log(token);
        console.log(response.role);
        console.log("User Logged In Successfully");
        this.invalidLogin = false;
        console.log(this.returnUrl);
        this.router.navigateByUrl(this.returnUrl);
      },
      error => {
        this.invalidLogin = true;
        this.ErrorMessage = "Invalid details supplied - Could not Log in";
        console.log(this.ErrorMessage);
      }
    );
  }

}

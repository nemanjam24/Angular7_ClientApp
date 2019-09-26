import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { AccountService } from '../services/account.service';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  insertForm: FormGroup;
  username: FormControl;
  password: FormControl;
  cpassword: FormControl;
  email: FormControl;
  errorList: string[];
  modalMessage: string;

  modalRef: BsModalRef;
  @ViewChild('template', { static: false }) modal: TemplateRef<any>;

  constructor(private fb: FormBuilder,
    private accService: AccountService,
    private router: Router, 
    private modalService: BsModalService) { }

  ngOnInit() {
    this.username = new FormControl('', [Validators.required, Validators.maxLength(10), Validators.minLength(5)]);
    this.password = new FormControl('', [Validators.required, Validators.maxLength(10), Validators.minLength(5)]);
    this.cpassword = new FormControl('', [Validators.required, this.MustMatch(this.password)]);
    this.email = new FormControl('', [Validators.required, Validators.email]);
    this.errorList = [];

    this.insertForm = this.fb.group({
      'username': this.username,
      'password': this.password,
      'cpassword': this.cpassword,
      'email': this.email
    });
  }

  onSubmit(){
    let userDetails = this.insertForm.value;
    this.accService.register(userDetails.username, userDetails.password, userDetails.email).subscribe(
      response => {
        this.router.navigate(['/login']);
      },
      error => {
        console.log(error);

        this.errorList = [];
        for(let i = 0; i < error.error.value.length; i++){
          this.errorList.push(error.error.value[i]);
          console.log(error.error.value[i]);
        }
        
        this.modalMessage = "Your registration was unsuccessful";
        this.modalRef = this.modalService.show(this.modal);
      }
    );
  }

  // Custom validator
  MustMatch(passwordControl: AbstractControl): ValidatorFn{
    return (cpasswordControl: AbstractControl): { [key: string]: boolean } | null => {
      if(!passwordControl && !cpasswordControl){
        return null;
      }
      if(!passwordControl.hasError && cpasswordControl.hasError){
        return null;
      }
      if(passwordControl.value !== cpasswordControl.value){
        return { 'mustMatch': true }
      }
      else{
        return null;
      }
    }      
  }
}

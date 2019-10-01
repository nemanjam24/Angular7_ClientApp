import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-access-denied',
  templateUrl: './access-denied.component.html',
  styleUrls: ['./access-denied.component.css']
})
export class AccessDeniedComponent implements OnInit {
  h1Message : string;
  h2Message : string;

  constructor() { }

  ngOnInit() {
    this.h1Message = "403";
    this.h2Message = "Access Denied";
  }

}

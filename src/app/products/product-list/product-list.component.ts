import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable, Subject } from 'rxjs';
import { Product } from 'src/app/interfaces/product';
import { DataTableDirective } from 'angular-datatables';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  // addForm properties
  insertForm : FormGroup;
  name : FormControl;
  description : FormControl;
  outOfStock : FormControl;
  price : FormControl;
  imageUrl : FormControl;

  // updateForm properties
  update : FormGroup;
  _name : FormControl;
  _description : FormControl;
  _outOfStock : FormControl;
  _price : FormControl;
  _imageUrl : FormControl;

  // addModal properties
  @ViewChild('template', { static: false }) modal : TemplateRef<any>;

  // updateModal properties
  @ViewChild('editTemplate', { static: false }) udpateModal : TemplateRef<any>;

  // Modal properties
  modalMessage : string;
  modalRef : BsModalRef;
  selectedProduct : Product;
  products$ : Observable<Product[]>;
  products : Product[];
  UserStatus : string;

  // Datatables properties
  dtOptions : DataTables.Settings = {};
  dtTrigger : Subject<any> = new Subject<any>();
  @ViewChild(DataTableDirective, { static:false }) dtElement : DataTableDirective;

  constructor(private modalService : BsModalService, private productService : ProductService) { }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      autoWidth: true,
      order: [[0, 'desc']]
    };

    this.products$ = this.productService.getProducts();
    this.products$.subscribe(
      response => {
        this.products = response;
        
        this.dtTrigger.next()
      }
    );
  }

}

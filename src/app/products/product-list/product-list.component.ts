import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable, Subject } from 'rxjs';
import { Product } from 'src/app/interfaces/product';
import { DataTableDirective } from 'angular-datatables';
import { ProductService } from 'src/app/services/product.service';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {
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

  constructor(private modalService : BsModalService, 
    private productService : ProductService, 
    private fb : FormBuilder, 
    private chRef : ChangeDetectorRef) { }

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
        
        // Listen for changes
        this.chRef.detectChanges();
        
        this.dtTrigger.next()
      }
    );

    // Modal message
    this.modalMessage = "All Fields Are Required";
    
    // Initialize Add Product properties
    let validateImageUrl = '^(https?:\/\/.*\.(?:png|jpg))$';

    this.name = new FormControl("", [Validators.required, Validators.maxLength(50)]);
    this.description = new FormControl("", [Validators.required, Validators.maxLength(150)]);
    this.price = new FormControl("", [Validators.required, Validators.min(0), Validators.max(10000)]);
    this.imageUrl = new FormControl("", Validators.pattern(validateImageUrl));

    this.insertForm = this.fb.group({
      'name': this.name,
      'description': this.description,
      'price': this.price,
      'imageUrl': this.imageUrl,
      'outOfStock': true,
    });
  }

  ngOnDestroy(){
    this.dtTrigger.unsubscribe();
  }

  onAddProduct(){
    this.modalRef = this.modalService.show(this.modal);
  }

  onSubmit(){
    const newProduct = this.insertForm.value;

    this.productService.insertProduct(newProduct).subscribe(
      response => {
        this.productService.clearCache();

        this.products$ = this.productService.getProducts();
        this.products$.subscribe(
          newList => {
            this.products = newList;
            this.modalRef.hide();
            this.insertForm.reset();
            this.rerender();
          }
        );
        console.log("New product added");
      },
      erorr => {
        console.log("Could not add product");
      }
    );
  }

  rerender(){
    this.dtElement.dtInstance.then(
      (dtInstance : DataTables.Api) => {
        // Destroy the DataTable
        dtInstance.destroy();
        
        // Call dtTrigger to render DataTable again
        this.dtTrigger.next();
      }
    );
  }

}

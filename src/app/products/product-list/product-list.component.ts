import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable, Subject } from 'rxjs';
import { Product } from 'src/app/interfaces/product';
import { DataTableDirective } from 'angular-datatables';
import { ProductService } from 'src/app/services/product.service';
import { DialogService } from 'src/app/services/dialog.service';

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
  updateForm : FormGroup;
  _name : FormControl;
  _description : FormControl;
  _outOfStock : FormControl;
  _price : FormControl;
  _imageUrl : FormControl;
  _id : FormControl;

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
    private chRef : ChangeDetectorRef, 
    private dialogService : DialogService) { }

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
      'outOfStock': true
    });

    // Initialize Update Product properties
    this._name = new FormControl("", [Validators.required, Validators.maxLength(50)]);
    this._description = new FormControl("", [Validators.required, Validators.maxLength(150)]);
    this._price = new FormControl("", [Validators.required, Validators.min(0), Validators.max(10000)]);
    this._imageUrl = new FormControl("", Validators.pattern(validateImageUrl));
    this._id = new FormControl();

    this.updateForm = this.fb.group({
      'name': this._name,
      'description': this._description,
      'price': this._price,
      'imageUrl': this._imageUrl,
      'outOfStock': true,
      'id': this._id
    });
  }

  ngOnDestroy(){
    this.dtTrigger.unsubscribe();
  }

  // Open Add Product Modal
  onAddProduct(){
    this.modalRef = this.modalService.show(this.modal);
  }
  
  // Method to Add new product
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

  // Open Update Product Modal
  onUpdateProduct(editedProduct : Product){
    this._id.setValue(editedProduct.productId);
    this._name.setValue(editedProduct.name);
    this._description.setValue(editedProduct.description);
    this._price.setValue(editedProduct.price);
    this._imageUrl.setValue(editedProduct.imageUrl);

    this.updateForm.setValue({
      'id': this._id.value,
      'name': this._name.value,
      'description': this._description.value,
      'price': this._price.value,
      'imageUrl': this._imageUrl.value,
      'outOfStock': true
    });

    this.modalRef = this.modalService.show(this.udpateModal);
  }

  // Method to Update the product
  onUpdate(){
    const updatedProduct = this.updateForm.value;

    this.productService.updateProduct(updatedProduct.id, updatedProduct).subscribe(
      response => {
        this.productService.clearCache();

        this.products$ = this.productService.getProducts();
        this.products$.subscribe(
          updatedList => {
            this.products = updatedList;
            this.modalRef.hide();
            this.rerender();
          }
        );
        
        console.log("Product updated");
      },
      error => {
        console.log("Could not update Product");
      }
    );
  }

  // Open Delete Product Modal
  onDeleteProduct(product : Product){
    this.dialogService.openConfirmationDialog('Are you sure you want to delete this product?')
      .afterClosed()
      .subscribe(
        response => {
          if(response){
            this.onDelete(product);
          }
        }
      );
  }

  // Method to Delete the product
  onDelete(product : Product){
    this.productService.deleteProduct(product.productId).subscribe(
      response => {
        this.productService.clearCache();

        this.products$ = this.productService.getProducts();
        this.products$.subscribe(
          newList => {
            this.products = newList;
            this.rerender();
          }
        );

        console.log("Product is deleted");
      },
      error => {
        console.log("Could not delete the product");
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

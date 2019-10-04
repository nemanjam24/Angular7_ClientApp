import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/interfaces/product';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product : Product;

  constructor(private productService : ProductService, private route : ActivatedRoute) { }

  ngOnInit() {
    let id = this.route.snapshot.params['id'];
    this.productService.getProduct(id).subscribe(
      response => {
        this.product = response;
      }
    );
  }

}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../interfaces/product';
import { shareReplay, flatMap, first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private product$: Observable<Product[]>;

  private baseUrl: string = "http://localhost:50112/api/product/getproducts";
  private productUrl: string = "http://localhost:50112/api/product/addproduct";
  private deleteUrl: string = "http://localhost:50112/api/product/deleteproduct/";
  private updateUrl: string = "http://localhost:50112/api/product/updateproduct/";

  constructor(private http: HttpClient) { }

  
  getProducts(): Observable<Product[]>{
    if(!this.product$){
      this.product$ = this.http.get<Product[]>(this.baseUrl)
      .pipe(shareReplay());
    }
    
    // if products cache exists return it
    return this.product$;
  }

  // Get product by its ID
  getProduct(id: number): Observable<Product>{
    return this.getProducts()
    .pipe(
      flatMap(
        response => response
      ),
      first(product => product.productId == id)
    );
  }

  insertProduct(newProduct: Product): Observable<Product>{
    return this.http.post<Product>(this.productUrl, newProduct);
  }

  updateProduct(id: number, editProduct: Product): Observable<Product>{
    return this.http.put<Product>(this.updateUrl + id, editProduct);
  }

  deleteProduct(id: number): Observable<any>{
    return this.http.delete(this.deleteUrl + id);
  }

  clearCache(){
    this.product$ = null;
  }
}

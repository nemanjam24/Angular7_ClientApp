import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { AuthGuardService } from '../guards/auth-guard.service';

const routes: Routes = [
  { path: '', component: ProductListComponent, canActivate: [AuthGuardService] },
  { path: 'product-list', component: ProductListComponent, canActivate: [AuthGuardService] },
  { path: ':id', component: ProductDetailComponent, canActivate: [AuthGuardService] }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [ AuthGuardService ]
})
export class ProductsRoutingModule { }

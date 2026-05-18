import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminProduct, AdminService } from '../../core/services/admin.service';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe],
  template: `
    <div class="p-4 md:p-8">
      <h1 class="text-xl md:text-2xl font-display font-bold text-dark mb-6">Products</h1>

      @if (products$ | async; as products) {
        <p class="text-sm text-muted mb-4">{{ products.length }} products in catalog</p>

        @if (products.length === 0) {
          <div class="bg-card rounded-xl border border-border p-12 text-center text-muted">
            No products in catalog.
          </div>
        } @else {
          <div class="bg-card rounded-xl border border-border overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead class="bg-bg border-b border-border">
                  <tr>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Product</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider hidden md:table-cell">Brand</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider hidden md:table-cell">Category</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Price</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Stock</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider hidden lg:table-cell">Status</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-border">
                  @for (product of products; track product.id) {
                    <tr class="hover:bg-bg/50 transition-colors">
                      <td class="px-4 py-3">
                        <p class="font-medium text-dark line-clamp-1">{{ product.name }}</p>
                        <p class="text-xs text-muted md:hidden">{{ product.brandName }}</p>
                      </td>
                      <td class="px-4 py-3 text-muted hidden md:table-cell">{{ product.brandName }}</td>
                      <td class="px-4 py-3 text-muted hidden md:table-cell">{{ product.categoryName }}</td>
                      <td class="px-4 py-3 font-semibold text-dark">
                        ₹{{ product.price.toLocaleString('en-IN') }}
                      </td>
                      <td class="px-4 py-3">
                        <span [class]="product.inStock ? 'text-xs text-success' : 'text-xs text-red'">
                          {{ product.inStock ? 'In Stock' : 'Out' }}
                        </span>
                      </td>
                      <td class="px-4 py-3 hidden lg:table-cell">
                        <span [class]="product.isActive
                          ? 'text-xs px-2 py-0.5 rounded-full bg-success/10 text-success'
                          : 'text-xs px-2 py-0.5 rounded-full bg-muted/10 text-muted'">
                          {{ product.isActive ? 'Active' : 'Inactive' }}
                        </span>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        }
      } @else {
        <div class="space-y-2">
          @for (i of [1, 2, 3, 4, 5, 6]; track i) {
            <div class="h-12 bg-border/40 rounded-lg animate-pulse"></div>
          }
        </div>
      }
    </div>
  `,
})
export class AdminProductsComponent {
  private readonly adminService = inject(AdminService);
  readonly products$: Observable<AdminProduct[]> = this.adminService.getAdminProducts();
}

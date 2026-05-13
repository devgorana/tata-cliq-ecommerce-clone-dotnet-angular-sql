import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { AsyncPipe, CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { OrderService, Order } from '../../core/services/order.service';
import { SkeletonLoaderComponent } from '../../shared/components/skeleton-loader.component';

const ORDER_STEPS = ['Placed', 'Confirmed', 'Shipped', 'Delivered'] as const;
type OrderStep = (typeof ORDER_STEPS)[number];

@Component({
  selector: 'app-order-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, AsyncPipe, RouterLink, CurrencyPipe, DatePipe, SkeletonLoaderComponent],
  template: `
    <div class="max-w-2xl mx-auto px-4 py-6">
      <a routerLink="/account" class="inline-flex items-center gap-1 text-sm text-muted hover:text-navy mb-6">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
        Back to Account
      </a>

      @if (order$ | async; as order) {
        <div class="bg-card rounded-xl border border-border p-5 mb-6">
          <div class="flex items-start justify-between flex-wrap gap-2 mb-4">
            <div>
              <h1 class="text-lg font-display font-bold text-dark">Order #{{ order.orderNumber }}</h1>
              <p class="text-xs text-muted mt-0.5">Placed on {{ order.createdAt | date:'mediumDate' }}</p>
            </div>
            @if (isCancelled(order.status)) {
              <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red/10 text-red">
                Cancelled
              </span>
            }
          </div>

          <!-- Status Stepper -->
          @if (!isCancelled(order.status)) {
            <div class="mt-4 mb-6">
              <div class="flex items-center justify-between relative">
                <!-- Connecting line -->
                <div class="absolute left-0 right-0 top-4 h-0.5 bg-border z-0 mx-8"></div>

                @for (step of steps; track step; let i = $index) {
                  <div class="flex flex-col items-center z-10 flex-1">
                    <div class="w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors"
                         [class]="getStepClass(step, order.status)">
                      @if (isCompleted(step, order.status)) {
                        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                        </svg>
                      } @else {
                        <span class="text-xs font-bold">{{ i + 1 }}</span>
                      }
                    </div>
                    <p class="text-xs mt-1 text-center font-medium"
                       [class]="isActiveOrCompleted(step, order.status) ? 'text-dark' : 'text-muted'">
                      {{ step }}
                    </p>
                  </div>
                }
              </div>
            </div>
          }
        </div>

        <!-- Order Items -->
        <div class="bg-card rounded-xl border border-border p-5 mb-4">
          <h2 class="text-sm font-semibold text-muted uppercase tracking-widest mb-4">Items</h2>
          <div class="divide-y divide-border">
            @for (item of order.items; track item.productId) {
              <div class="py-3 flex gap-4">
                @if (item.imageUrl) {
                  <img [src]="item.imageUrl" [alt]="item.name"
                       class="w-16 h-16 object-cover rounded-lg border border-border shrink-0" />
                }
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-dark line-clamp-2">{{ item.name }}</p>
                  <p class="text-xs text-muted mt-1">Qty: {{ item.quantity }}</p>
                </div>
                <p class="text-sm font-semibold text-dark shrink-0">
                  {{ item.price | currency:'INR':'symbol-narrow':'1.0-0' }}
                </p>
              </div>
            }
          </div>
        </div>

        <!-- Order Total -->
        <div class="bg-card rounded-xl border border-border p-5">
          <div class="flex justify-between text-sm">
            <span class="text-muted">Order Total</span>
            <span class="font-bold text-dark">{{ order.total | currency:'INR':'symbol-narrow':'1.0-0' }}</span>
          </div>
        </div>
      } @else {
        <app-skeleton-loader height="200px" cssClass="rounded-xl mb-4" />
        <app-skeleton-loader height="120px" cssClass="rounded-xl" />
      }
    </div>
  `,
})
export class OrderDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly orderService = inject(OrderService);

  readonly steps: OrderStep[] = [...ORDER_STEPS];

  order$!: Observable<Order>;

  ngOnInit(): void {
    this.order$ = this.route.paramMap.pipe(
      switchMap((params) => this.orderService.getOrder(params.get('id')!)),
    );
  }

  isCancelled(status: string): boolean {
    return status === 'Cancelled';
  }

  private stepIndex(step: string): number {
    return ORDER_STEPS.indexOf(step as OrderStep);
  }

  isCompleted(step: OrderStep, status: string): boolean {
    return this.stepIndex(status) > this.stepIndex(step);
  }

  isActiveOrCompleted(step: OrderStep, status: string): boolean {
    return this.stepIndex(status) >= this.stepIndex(step);
  }

  getStepClass(step: OrderStep, status: string): string {
    const activeIdx = this.stepIndex(status);
    const stepIdx = this.stepIndex(step);
    if (activeIdx > stepIdx) return 'bg-red border-red';
    if (activeIdx === stepIdx) return 'bg-red border-red text-white';
    return 'bg-card border-border text-mid-gray';
  }
}

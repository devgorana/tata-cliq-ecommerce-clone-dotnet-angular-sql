import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink],
  template: `
    <footer class="bg-navy text-white mt-12">
      <div class="max-w-layout mx-auto px-4 py-10">

        <!-- Desktop grid -->
        <div class="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          @for (section of footerLinks; track section.heading) {
            <div>
              <h3 class="font-semibold text-sm mb-3 text-[#F9A825]">{{ section.heading }}</h3>
              <ul class="space-y-2">
                @for (link of section.links; track link.label) {
                  <li>
                    <a [routerLink]="link.href" class="text-sm text-white/70 hover:text-white transition">
                      {{ link.label }}
                    </a>
                  </li>
                }
              </ul>
            </div>
          }
        </div>

        <!-- Divider -->
        <div class="border-t border-white/20 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/60">
          <p>© 2026 Tata CLiQ Clone. All rights reserved.</p>
          <div class="flex gap-4">
            <a href="#" class="hover:text-white transition">Privacy Policy</a>
            <a href="#" class="hover:text-white transition">Terms of Use</a>
            <a href="#" class="hover:text-white transition">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  readonly footerLinks = [
    {
      heading: 'Shop',
      links: [
        { label: 'Women',       href: '/products?category=women' },
        { label: 'Men',         href: '/products?category=men' },
        { label: 'Electronics', href: '/products?category=electronics' },
        { label: 'Luxury',      href: '/products?category=luxury' },
      ],
    },
    {
      heading: 'Help',
      links: [
        { label: 'Track Order',   href: '/account/orders' },
        { label: 'Returns',       href: '/help/returns' },
        { label: 'FAQs',          href: '/help/faq' },
        { label: 'Contact Us',    href: '/help/contact' },
      ],
    },
    {
      heading: 'Account',
      links: [
        { label: 'Sign In',       href: '/auth/login' },
        { label: 'Register',      href: '/auth/register' },
        { label: 'My Orders',     href: '/account/orders' },
        { label: 'Wishlist',      href: '/account/wishlist' },
      ],
    },
    {
      heading: 'About',
      links: [
        { label: 'About Tata CLiQ', href: '/about' },
        { label: 'Careers',         href: '/careers' },
        { label: 'Press',           href: '/press' },
        { label: 'Sell on CLiQ',    href: '/sell' },
      ],
    },
  ];
}

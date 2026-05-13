import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface SubCategoryGroup {
  heading: string;
  links: { label: string; slug: string }[];
}

interface BrandTile {
  name: string;
  initials: string;
  color: string;
}

interface Editorial {
  bgColor: string;
  headline: string;
  sub: string;
  cta: string;
  link: string;
  queryParams: Record<string, string>;
}

interface MegaMenuData {
  subCategories: SubCategoryGroup[];
  brands: BrandTile[];
  editorial: Editorial;
}

const MEGA_MENU_DATA: Record<string, MegaMenuData> = {
  women: {
    subCategories: [
      {
        heading: 'Clothing',
        links: [
          { label: 'Kurtas & Suits',   slug: 'kurtas-suits' },
          { label: 'Sarees',           slug: 'sarees' },
          { label: 'Dresses',          slug: 'dresses' },
          { label: 'Tops & Tees',      slug: 'tops-tees' },
          { label: 'Jeans',            slug: 'jeans' },
        ],
      },
      {
        heading: 'Footwear',
        links: [
          { label: 'Heels',           slug: 'heels' },
          { label: 'Flats',           slug: 'flats' },
          { label: 'Sneakers',        slug: 'sneakers' },
          { label: 'Sandals',         slug: 'sandals' },
        ],
      },
      {
        heading: 'Accessories',
        links: [
          { label: 'Handbags',        slug: 'handbags' },
          { label: 'Watches',         slug: 'watches' },
          { label: 'Jewellery',       slug: 'jewellery' },
          { label: 'Sunglasses',      slug: 'sunglasses' },
        ],
      },
    ],
    brands: [
      { name: 'W',         initials: 'W',   color: '#E31837' },
      { name: 'Anouk',     initials: 'AN',  color: '#1C2B4A' },
      { name: 'BIBA',      initials: 'BI',  color: '#C9A84C' },
      { name: 'Libas',     initials: 'LI',  color: '#2E7D32' },
      { name: 'Mango',     initials: 'MG',  color: '#FF6900' },
      { name: 'Zara',      initials: 'ZA',  color: '#1A1A1A' },
    ],
    editorial: {
      bgColor: '#FFF5F7',
      headline: 'New Season Arrivals',
      sub: 'Fresh styles for every occasion',
      cta: 'Shop Women',
      link: '/products',
      queryParams: { category: 'women' },
    },
  },
  men: {
    subCategories: [
      {
        heading: 'Clothing',
        links: [
          { label: 'Shirts',          slug: 'shirts' },
          { label: 'T-Shirts',        slug: 't-shirts' },
          { label: 'Trousers',        slug: 'trousers' },
          { label: 'Jeans',           slug: 'jeans' },
          { label: 'Ethnic Wear',     slug: 'ethnic-wear' },
        ],
      },
      {
        heading: 'Footwear',
        links: [
          { label: 'Formal Shoes',    slug: 'formal-shoes' },
          { label: 'Sneakers',        slug: 'sneakers' },
          { label: 'Loafers',         slug: 'loafers' },
          { label: 'Sandals',         slug: 'sandals' },
        ],
      },
      {
        heading: 'Accessories',
        links: [
          { label: 'Watches',         slug: 'watches' },
          { label: 'Wallets',         slug: 'wallets' },
          { label: 'Belts',           slug: 'belts' },
          { label: 'Sunglasses',      slug: 'sunglasses' },
        ],
      },
    ],
    brands: [
      { name: 'Arrow',     initials: 'AR',  color: '#1C2B4A' },
      { name: 'Peter England', initials: 'PE', color: '#0071C2' },
      { name: 'Louis Philippe', initials: 'LP', color: '#C9A84C' },
      { name: 'Van Heusen', initials: 'VH', color: '#2E7D32' },
      { name: 'US Polo',   initials: 'UP',  color: '#E31837' },
      { name: 'Allen Solly', initials: 'AS', color: '#FF6900' },
    ],
    editorial: {
      bgColor: '#F0F4FF',
      headline: 'Office to Weekend',
      sub: 'Versatile styles for modern men',
      cta: 'Shop Men',
      link: '/products',
      queryParams: { category: 'men' },
    },
  },
  kids: {
    subCategories: [
      {
        heading: 'Boys',
        links: [
          { label: 'T-Shirts',        slug: 'boys-tshirts' },
          { label: 'Trousers',        slug: 'boys-trousers' },
          { label: 'Shorts',          slug: 'boys-shorts' },
          { label: 'Ethnic Wear',     slug: 'boys-ethnic' },
        ],
      },
      {
        heading: 'Girls',
        links: [
          { label: 'Frocks & Dresses', slug: 'girls-dresses' },
          { label: 'Tops',            slug: 'girls-tops' },
          { label: 'Leggings',        slug: 'girls-leggings' },
          { label: 'Ethnic Wear',     slug: 'girls-ethnic' },
        ],
      },
      {
        heading: 'Footwear',
        links: [
          { label: 'Boys Shoes',      slug: 'boys-shoes' },
          { label: 'Girls Shoes',     slug: 'girls-shoes' },
          { label: 'Sandals',         slug: 'kids-sandals' },
        ],
      },
    ],
    brands: [
      { name: 'H&M Kids',  initials: 'HM',  color: '#E31837' },
      { name: 'Gini & Jony', initials: 'GJ', color: '#FF6900' },
      { name: 'Lilliput',  initials: 'LL',  color: '#C9A84C' },
      { name: 'Mothercare', initials: 'MC', color: '#2E7D32' },
      { name: 'FirstCry',  initials: 'FC',  color: '#0071C2' },
      { name: 'Hopscotch', initials: 'HS',  color: '#9C27B0' },
    ],
    editorial: {
      bgColor: '#FFFBF0',
      headline: 'Fun & Colourful',
      sub: 'Clothes they\'ll love to wear',
      cta: 'Shop Kids',
      link: '/products',
      queryParams: { category: 'kids' },
    },
  },
  beauty: {
    subCategories: [
      {
        heading: 'Skincare',
        links: [
          { label: 'Moisturisers',    slug: 'moisturisers' },
          { label: 'Serums',          slug: 'serums' },
          { label: 'Sunscreen',       slug: 'sunscreen' },
          { label: 'Face Wash',       slug: 'face-wash' },
        ],
      },
      {
        heading: 'Makeup',
        links: [
          { label: 'Lipstick',        slug: 'lipstick' },
          { label: 'Foundation',      slug: 'foundation' },
          { label: 'Mascara',         slug: 'mascara' },
          { label: 'Eye Shadow',      slug: 'eye-shadow' },
        ],
      },
      {
        heading: 'Hair Care',
        links: [
          { label: 'Shampoo',         slug: 'shampoo' },
          { label: 'Conditioner',     slug: 'conditioner' },
          { label: 'Hair Oils',       slug: 'hair-oils' },
          { label: 'Hair Colour',     slug: 'hair-colour' },
        ],
      },
    ],
    brands: [
      { name: 'Lakme',     initials: 'LK',  color: '#E31837' },
      { name: "L'Oreal",   initials: 'LO',  color: '#C9A84C' },
      { name: 'Maybelline', initials: 'MB', color: '#1C2B4A' },
      { name: 'Nykaa',     initials: 'NK',  color: '#FC2779' },
      { name: 'MAC',       initials: 'MC',  color: '#1A1A1A' },
      { name: 'Forest Essentials', initials: 'FE', color: '#2E7D32' },
    ],
    editorial: {
      bgColor: '#FFF0F5',
      headline: 'Glow This Season',
      sub: 'Beauty essentials from top brands',
      cta: 'Shop Beauty',
      link: '/products',
      queryParams: { category: 'beauty' },
    },
  },
  home: {
    subCategories: [
      {
        heading: 'Bed & Bath',
        links: [
          { label: 'Bedsheets',       slug: 'bedsheets' },
          { label: 'Comforters',      slug: 'comforters' },
          { label: 'Towels',          slug: 'towels' },
          { label: 'Pillows',         slug: 'pillows' },
        ],
      },
      {
        heading: 'Decor',
        links: [
          { label: 'Cushions',        slug: 'cushions' },
          { label: 'Curtains',        slug: 'curtains' },
          { label: 'Candles',         slug: 'candles' },
          { label: 'Wall Art',        slug: 'wall-art' },
        ],
      },
      {
        heading: 'Kitchen',
        links: [
          { label: 'Cookware',        slug: 'cookware' },
          { label: 'Dinnerware',      slug: 'dinnerware' },
          { label: 'Storage',         slug: 'storage' },
        ],
      },
    ],
    brands: [
      { name: 'Trident',   initials: 'TR',  color: '#1C2B4A' },
      { name: 'Spaces',    initials: 'SP',  color: '#C9A84C' },
      { name: 'Bombay Dyeing', initials: 'BD', color: '#E31837' },
      { name: 'D\'Decor',  initials: 'DD',  color: '#2E7D32' },
      { name: 'Portico',   initials: 'PO',  color: '#FF6900' },
      { name: 'Raymond Home', initials: 'RH', color: '#0071C2' },
    ],
    editorial: {
      bgColor: '#F0F7F0',
      headline: 'Beautiful Homes',
      sub: 'Transform your living spaces',
      cta: 'Shop Home',
      link: '/products',
      queryParams: { category: 'home' },
    },
  },
  brands: {
    subCategories: [
      {
        heading: 'Premium Brands',
        links: [
          { label: 'Tommy Hilfiger',  slug: 'tommy-hilfiger' },
          { label: 'Calvin Klein',    slug: 'calvin-klein' },
          { label: 'Armani Exchange', slug: 'armani-exchange' },
          { label: 'Michael Kors',    slug: 'michael-kors' },
        ],
      },
      {
        heading: 'Indian Brands',
        links: [
          { label: 'Fabindia',        slug: 'fabindia' },
          { label: 'Manyavar',        slug: 'manyavar' },
          { label: 'W for Woman',     slug: 'w-for-woman' },
          { label: 'Raymond',         slug: 'raymond' },
        ],
      },
      {
        heading: 'Sport & Active',
        links: [
          { label: 'Nike',            slug: 'nike' },
          { label: 'Adidas',          slug: 'adidas' },
          { label: 'Puma',            slug: 'puma' },
          { label: 'Reebok',          slug: 'reebok' },
        ],
      },
    ],
    brands: [
      { name: 'Nike',      initials: 'NK',  color: '#1A1A1A' },
      { name: 'Adidas',    initials: 'AD',  color: '#1C2B4A' },
      { name: 'Puma',      initials: 'PU',  color: '#E31837' },
      { name: 'Tommy H',   initials: 'TH',  color: '#0071C2' },
      { name: 'Calvin K',  initials: 'CK',  color: '#C9A84C' },
      { name: 'Zara',      initials: 'ZA',  color: '#1A1A1A' },
    ],
    editorial: {
      bgColor: '#F5F0FF',
      headline: 'Top Brands, Best Prices',
      sub: 'Authentic products guaranteed',
      cta: 'All Brands',
      link: '/products',
      queryParams: { category: 'brands' },
    },
  },
  sale: {
    subCategories: [
      {
        heading: 'Best Deals',
        links: [
          { label: 'Under ₹499',      slug: 'under-499' },
          { label: 'Under ₹999',      slug: 'under-999' },
          { label: 'Under ₹1,999',    slug: 'under-1999' },
          { label: 'Under ₹2,999',    slug: 'under-2999' },
        ],
      },
      {
        heading: 'By Category',
        links: [
          { label: 'Women Sale',      slug: 'women-sale' },
          { label: 'Men Sale',        slug: 'men-sale' },
          { label: 'Kids Sale',       slug: 'kids-sale' },
          { label: 'Beauty Sale',     slug: 'beauty-sale' },
        ],
      },
      {
        heading: 'Extra Discounts',
        links: [
          { label: '50% Off & More',  slug: '50-off' },
          { label: 'Clearance Sale',  slug: 'clearance' },
          { label: 'End of Season',   slug: 'end-of-season' },
        ],
      },
    ],
    brands: [
      { name: 'Arrow',     initials: 'AR',  color: '#1C2B4A' },
      { name: 'W',         initials: 'W',   color: '#E31837' },
      { name: 'Mango',     initials: 'MG',  color: '#FF6900' },
      { name: 'H&M',       initials: 'HM',  color: '#E31837' },
      { name: 'Zara',      initials: 'ZA',  color: '#1A1A1A' },
      { name: 'Puma',      initials: 'PU',  color: '#2E7D32' },
    ],
    editorial: {
      bgColor: '#FFF5F5',
      headline: 'Sale Is On!',
      sub: 'Up to 70% off on top brands',
      cta: 'Shop Sale',
      link: '/products',
      queryParams: { category: 'sale' },
    },
  },
  luxury: {
    subCategories: [
      {
        heading: 'Women Luxury',
        links: [
          { label: 'Designer Bags',   slug: 'designer-bags' },
          { label: 'Luxury Watches',  slug: 'luxury-watches' },
          { label: 'Fine Jewellery',  slug: 'fine-jewellery' },
          { label: 'Premium Sarees',  slug: 'premium-sarees' },
        ],
      },
      {
        heading: 'Men Luxury',
        links: [
          { label: 'Luxury Suits',    slug: 'luxury-suits' },
          { label: 'Premium Watches', slug: 'premium-watches' },
          { label: 'Designer Shoes',  slug: 'designer-shoes' },
          { label: 'Cufflinks',       slug: 'cufflinks' },
        ],
      },
      {
        heading: 'Gifting',
        links: [
          { label: 'Gift Cards',      slug: 'gift-cards' },
          { label: 'Gift Sets',       slug: 'gift-sets' },
          { label: 'Personalized',    slug: 'personalized' },
        ],
      },
    ],
    brands: [
      { name: 'Emporio Armani', initials: 'EA', color: '#C9A84C' },
      { name: 'Versace',    initials: 'VS',  color: '#C9A84C' },
      { name: 'Guess',      initials: 'GS',  color: '#1A1A1A' },
      { name: 'Hugo Boss',  initials: 'HB',  color: '#1C2B4A' },
      { name: 'Tissot',     initials: 'TI',  color: '#2E7D32' },
      { name: 'Tumi',       initials: 'TU',  color: '#1A1A1A' },
    ],
    editorial: {
      bgColor: '#FFFBF0',
      headline: 'Luxury Curated',
      sub: 'Finest brands, premium experience',
      cta: 'Explore Luxury',
      link: '/products',
      queryParams: { category: 'luxury' },
    },
  },
};

const DEFAULT_DATA: MegaMenuData = {
  subCategories: [],
  brands: [],
  editorial: {
    bgColor: '#F5F5F5',
    headline: 'Explore Products',
    sub: 'Discover our full collection',
    cta: 'Shop Now',
    link: '/products',
    queryParams: {},
  },
};

@Component({
  selector: 'app-mega-menu',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- DESIGN.md §4.3 Mega-Menu: 3-column, full-bleed, dropdown-reveal animation -->
    <div
      class="absolute left-0 right-0 top-full w-full bg-white border-t border-border shadow-lg z-50"
      style="animation: dropdown-reveal 200ms ease-out forwards;"
      role="region"
      [attr.aria-label]="categorySlug + ' mega menu'"
    >
      <div class="max-w-layout mx-auto px-6 py-6">
        <div class="flex gap-8">

          <!-- Left 40%: Sub-category groups -->
          <div class="w-[40%] flex gap-6">
            @for (group of data.subCategories; track group.heading) {
              <div class="flex-1">
                <p class="text-[11px] font-bold uppercase tracking-widest text-mid-gray mb-3">
                  {{ group.heading }}
                </p>
                <ul class="space-y-1.5" role="list">
                  @for (link of group.links; track link.slug) {
                    <li>
                      <a
                        routerLink="/products"
                        [queryParams]="{ category: link.slug }"
                        class="text-[13px] text-dark hover:text-red transition-colors duration-150 block py-0.5"
                      >
                        {{ link.label }}
                      </a>
                    </li>
                  }
                </ul>
              </div>
            }
          </div>

          <!-- Divider -->
          <div class="w-px bg-border flex-shrink-0"></div>

          <!-- Center 35%: Top Brands -->
          <div class="w-[35%]">
            <p class="text-[11px] font-bold uppercase tracking-widest text-mid-gray mb-3">Top Brands</p>
            <div class="grid grid-cols-3 gap-3">
              @for (brand of data.brands; track brand.name) {
                <a
                  routerLink="/products"
                  [queryParams]="{ brand: brand.name }"
                  class="flex flex-col items-center gap-1.5 group"
                  [attr.aria-label]="'Shop ' + brand.name"
                >
                  <div
                    class="w-[72px] h-[72px] rounded-full border border-border flex items-center justify-center
                           text-white text-sm font-bold shadow-sm
                           group-hover:scale-[1.06] group-hover:border-red/40 group-hover:shadow-md
                           transition-all duration-200"
                    [style.background-color]="brand.color"
                  >
                    {{ brand.initials }}
                  </div>
                  <span class="text-[11px] text-dark group-hover:text-red text-center leading-tight transition-colors duration-150">
                    {{ brand.name }}
                  </span>
                </a>
              }
            </div>
          </div>

          <!-- Divider -->
          <div class="w-px bg-border flex-shrink-0"></div>

          <!-- Right 25%: Editorial promo -->
          <div class="w-[25%] flex-shrink-0">
            <div
              class="rounded-lg p-5 h-full flex flex-col justify-between min-h-[180px]"
              [style.background-color]="data.editorial.bgColor"
            >
              <div>
                <p class="text-[10px] font-bold uppercase tracking-widest text-mid-gray mb-1">Editor's Pick</p>
                <h3 class="text-base font-bold font-display text-dark leading-snug mb-1">
                  {{ data.editorial.headline }}
                </h3>
                <p class="text-[12px] text-muted leading-relaxed">
                  {{ data.editorial.sub }}
                </p>
              </div>
              <a
                [routerLink]="data.editorial.link"
                [queryParams]="data.editorial.queryParams"
                class="mt-4 inline-flex items-center gap-1.5 text-[12px] font-semibold text-red hover:gap-2.5 transition-all duration-200"
                [attr.aria-label]="data.editorial.cta + ' — editorial pick'"
              >
                {{ data.editorial.cta }}
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/>
                </svg>
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  `,
})
export class MegaMenuComponent implements OnChanges {
  @Input({ required: true }) categorySlug!: string;

  data: MegaMenuData = DEFAULT_DATA;

  ngOnChanges(): void {
    this.data = MEGA_MENU_DATA[this.categorySlug] ?? DEFAULT_DATA;
  }
}

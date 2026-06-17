export type Locale = 'fr' | 'ar';

export interface LocalizedField {
  fr: string;
  ar: string;
}

export interface CategoryData {
  id: string;
  slug: string;
  nameFr: string;
  nameAr: string;
  image: string | null;
  sortOrder: number;
  isActive: boolean;
}

export interface ProductData {
  id: string;
  slug: string;
  nameFr: string;
  nameAr: string;
  descriptionFr: string | null;
  descriptionAr: string | null;
  categoryId: string;
  supplierId: string | null;
  costPrice: number | null;
  sellPrice: number;
  images: string[];
  status: 'ACTIVE' | 'DRAFT' | 'OUT_OF_STOCK';
  featured: boolean;
  variants: ProductVariantData[];
  category?: CategoryData;
}

export interface ProductVariantData {
  id: string;
  size: string | null;
  color: string | null;
  colorHex: string | null;
  stock: number;
  sku: string;
  price: number | null;
}

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  name: string;
  slug: string;
  image: string;
  size?: string;
  color?: string;
  price: number;
  quantity: number;
  stock: number;
}

export interface OrderData {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  address: AddressData;
  city: string;
  region: string;
  deliveryMethod: string;
  deliveryFee: number;
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: 'COD' | 'ONLINE';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'RETURNED';
  items: OrderItemData[];
  createdAt: string;
}

export interface AddressData {
  street: string;
  city: string;
  region: string;
  zipCode?: string;
}

export interface OrderItemData {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

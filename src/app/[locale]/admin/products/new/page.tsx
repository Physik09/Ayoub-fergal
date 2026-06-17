import ProductForm from '@/components/admin/products/ProductForm';

export default function NewProductPage() {
  const params = Promise.resolve({ id: 'new' });
  return <ProductForm params={params} />;
}

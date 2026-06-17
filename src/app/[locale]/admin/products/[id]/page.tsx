import ProductForm from '@/components/admin/products/ProductForm';

type Props = {
  params: Promise<{ id: string }>;
};

export default function ProductEditPage({ params }: Props) {
  return <ProductForm params={params} />;
}

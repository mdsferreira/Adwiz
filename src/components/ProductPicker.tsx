'use client';

import { useEffect, useState } from 'react';
import { Input, Button, Card, CardBody, Typography } from '@material-tailwind/react';

type Product = {
  id: string;
  title: string;
  imageUrl?: string | null;
  price?: string | null;
  tags?: string | null;
};

type Props = {
  onSelect(product: Product): void;
};

export function ProductPicker({ onSelect }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);

  async function loadProducts(page = 1) {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page) });
    if (q) params.set('q', q);

    const res = await fetch(`/api/shopify/products?${params.toString()}`);
    const data = await res.json();
    setProducts(data.items);
    setLoading(false);
  }

  useEffect(() => {
    loadProducts(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          label="Search products"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          crossOrigin={undefined}
        />
        <Button size="sm" className="mt-1" onClick={() => loadProducts(1)} disabled={loading}>
          {loading ? 'Loading…' : 'Search'}
        </Button>
      </div>

      {loading && (
        <Typography variant="small" color="gray">
          Loading products...
        </Typography>
      )}

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {products.map((p) => (
          <Card
            key={p.id}
            className="cursor-pointer border border-gray-200 hover:border-gray-800"
            onClick={() => onSelect(p)}
          >
            <CardBody className="flex items-center gap-3">
              {p.imageUrl && (
                <img src={p.imageUrl} alt={p.title} className="h-12 w-12 rounded-md object-cover" />
              )}
              <div>
                <Typography variant="small" className="font-semibold">
                  {p.title}
                </Typography>
                <Typography variant="small" color="gray">
                  {p.price ? `€${p.price}` : 'No price'}
                </Typography>
                {p.tags && (
                  <Typography variant="small" color="gray" className="text-[11px] truncate">
                    {p.tags}
                  </Typography>
                )}
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}

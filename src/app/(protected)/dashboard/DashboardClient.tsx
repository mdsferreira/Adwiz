'use client';

import { useState } from 'react';
import { ProductPicker } from '@/components/ProductPicker';
import { AdResults } from '@/components/AdResults';
import {
  Card,
  CardBody,
  Typography,
  Button,
  Tabs,
  TabsHeader,
  Tab,
} from '@material-tailwind/react';

export default function DashboardClient() {
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [drafts, setDrafts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [platforms, setPlatforms] = useState<('META' | 'GOOGLE')[]>(['META', 'GOOGLE']);

  async function generate() {
    if (!selectedProduct) return;
    setLoading(true);
    const res = await fetch('/api/ads/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: selectedProduct.id,
        platforms,
        tone: 'bold',
        numVariants: 3,
      }),
    });

    if (res.status === 402) {
      const data = await res.json();
      alert(data.message);
      // or show a nicer UI and push to /pricing
      setLoading(false);
      return;
    }

    const data = await res.json();
    setDrafts(data.drafts || []);
    setLoading(false);
  }

  return (
    <main className="mx-auto max-w-5xl space-y-6 px-4 py-8">
      <Typography variant="h4" className="mb-2">
        AdWiz Dashboard
      </Typography>
      <Typography variant="small" color="gray">
        Connect your Shopify products and generate ready-to-use Meta & Google Ads.
      </Typography>

      <Card className="mt-4">
        <CardBody className="space-y-4">
          <Typography variant="h6">1. Pick a product</Typography>
          <ProductPicker onSelect={setSelectedProduct} />
        </CardBody>
      </Card>

      {selectedProduct && (
        <Card>
          <CardBody className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="h6">2. Configure & generate ads</Typography>
                <Typography variant="small" color="gray">
                  Product: <span className="font-semibold">{selectedProduct.title}</span>
                </Typography>
              </div>
              <Button size="sm" onClick={generate} disabled={loading}>
                {loading ? 'Generating…' : 'Generate ads'}
              </Button>
            </div>

            <div>
              <Typography variant="small" color="gray" className="mb-1">
                Platforms
              </Typography>
              <Tabs value="both" className="w-fit">
                <TabsHeader>
                  <Tab value="both" onClick={() => setPlatforms(['META', 'GOOGLE'])}>
                    Meta + Google
                  </Tab>
                  <Tab value="meta" onClick={() => setPlatforms(['META'])}>
                    Meta
                  </Tab>
                  <Tab value="google" onClick={() => setPlatforms(['GOOGLE'])}>
                    Google
                  </Tab>
                </TabsHeader>
              </Tabs>
            </div>
          </CardBody>
        </Card>
      )}

      {drafts.length > 0 && (
        <Card>
          <CardBody>
            <Typography variant="h6" className="mb-3">
              3. Review & export
            </Typography>
            <AdResults drafts={drafts} />
          </CardBody>
        </Card>
      )}
    </main>
  );
}

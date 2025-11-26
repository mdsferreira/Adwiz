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

type Platform = 'META' | 'GOOGLE';

export default function DashboardClient() {
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [drafts, setDrafts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [platforms, setPlatforms] = useState<Platform[]>(['META', 'GOOGLE']);

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
      // You can replace this with a nice dialog/snackbar
      alert(data.message);
      setLoading(false);
      return;
    }

    const data = await res.json();
    setDrafts(data.drafts || []);
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      {/* Hero / summary */}
      <section className="grid gap-4 md:grid-cols-[2fr,1.2fr]">
        <Card className="bg-slate-900/60 border border-slate-800 shadow-xl shadow-black/40">
          <CardBody className="space-y-3 p-4">
            <Typography variant="h5" className="text-slate-50">
              Welcome to your ad lab
            </Typography>
            <Typography variant="small" className="text-slate-400">
              Pick a product, choose your platforms, and let AdWiz craft high-converting Meta and
              Google ads in seconds.
            </Typography>
            <div className="flex flex-wrap gap-2 text-[11px]">
              <span className="rounded-full bg-emerald-400/10 px-2 py-1 text-emerald-200 border border-emerald-400/30">
                AI copywriter
              </span>
              <span className="rounded-full bg-sky-400/10 px-2 py-1 text-sky-200 border border-sky-400/30">
                Shopify integrated
              </span>
              <span className="rounded-full bg-purple-400/10 px-2 py-1 text-purple-200 border border-purple-400/30">
                Meta & Google ready
              </span>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-slate-900/60 border border-slate-800">
          <CardBody className="space-y-3 p-4">
            <Typography variant="small" className="text-slate-400">
              Tips
            </Typography>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>• Start with your best-selling or most profitable product.</li>
              <li>• Test 2–3 variants per platform in your ad manager.</li>
              <li>• Re-generate copy when you change pricing or positioning.</li>
            </ul>
          </CardBody>
        </Card>
      </section>

      {/* Step 1: Product */}
      <section className="grid gap-4 lg:grid-cols-[1.7fr,1.3fr]">
        <Card className="bg-slate-900/70 border border-slate-800">
          <CardBody className="space-y-4 p-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <Typography variant="h6" className="text-slate-50 text-sm">
                  1. Pick a product
                </Typography>
                <Typography variant="small" className="text-slate-400">
                  Products synced from your connected Shopify store.
                </Typography>
              </div>
            </div>

            <ProductPicker onSelect={setSelectedProduct} />
          </CardBody>
        </Card>

        {/* Step 2: Config & generate */}
        <Card className="bg-slate-900/70 border border-slate-800">
          <CardBody className="space-y-4 p-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <Typography variant="h6" className="text-slate-50 text-sm">
                  2. Configure & generate
                </Typography>
                <Typography variant="small" className="text-slate-400">
                  Choose platforms and generate multiple ad variations.
                </Typography>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <Typography variant="small" className="mb-1 text-slate-300">
                  Platforms
                </Typography>
                <Tabs value={platforms.length === 2 ? 'both' : platforms[0]} className="w-fit">
                  <TabsHeader className="bg-slate-800/80 border border-slate-700">
                    <Tab
                      value="both"
                      onClick={() => setPlatforms(['META', 'GOOGLE'])}
                      className="text-[11px] text-slate-200"
                    >
                      Meta + Google
                    </Tab>
                    <Tab
                      value="META"
                      onClick={() => setPlatforms(['META'])}
                      className="text-[11px] text-slate-200"
                    >
                      Meta only
                    </Tab>
                    <Tab
                      value="GOOGLE"
                      onClick={() => setPlatforms(['GOOGLE'])}
                      className="text-[11px] text-slate-200"
                    >
                      Google only
                    </Tab>
                  </TabsHeader>
                </Tabs>
              </div>

              <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-3 text-xs text-slate-300">
                {selectedProduct ? (
                  <>
                    <div className="font-semibold text-slate-100">Product selected</div>
                    <div>{selectedProduct.title}</div>
                    {selectedProduct.price && (
                      <div className="mt-1 text-slate-400">Price: €{selectedProduct.price}</div>
                    )}
                  </>
                ) : (
                  <div className="text-slate-500">Select a product on the left to get started.</div>
                )}
              </div>

              <Button
                size="sm"
                fullWidth
                onClick={generate}
                disabled={loading || !selectedProduct}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold"
              >
                {loading ? 'Generating ads…' : 'Generate ads'}
              </Button>
            </div>
          </CardBody>
        </Card>
      </section>

      {/* Step 3: Results */}
      {drafts.length > 0 && (
        <section>
          <Card className="bg-slate-900/80 border border-slate-800">
            <CardBody className="space-y-4 p-4">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <Typography variant="h6" className="text-slate-50 text-sm">
                    3. Review & export
                  </Typography>
                  <Typography variant="small" className="text-slate-400">
                    Copy, tweak, and export your ad variants to Meta or Google.
                  </Typography>
                </div>
              </div>

              <AdResults drafts={drafts} />
            </CardBody>
          </Card>
        </section>
      )}
    </div>
  );
}

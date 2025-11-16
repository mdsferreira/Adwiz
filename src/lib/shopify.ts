// lib/shopify.ts
import crypto from 'crypto';

const SHOPIFY_API_KEY = process.env.SHOPIFY_API_KEY!;
const SHOPIFY_API_SECRET = process.env.SHOPIFY_API_SECRET!;
const APP_URL = process.env.APP_URL!; // e.g. https://your-app.com

export function getInstallUrl(shop: string) {
  const redirectUri = `${APP_URL}/api/auth/shopify/callback`;
  const scopes = ['read_products', 'read_product_listings'].join(',');

  const state = crypto.randomBytes(16).toString('hex');

  const url = new URL(`https://${shop}/admin/oauth/authorize`);
  url.searchParams.set('client_id', SHOPIFY_API_KEY);
  url.searchParams.set('scope', scopes);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('state', state);

  return { url: url.toString(), state };
}

export function verifyHmac(query: URLSearchParams) {
  const hmac = query.get('hmac') || '';
  const map: Record<string, string> = {};

  query.forEach((value, key) => {
    if (key === 'hmac' || key === 'signature') return;
    map[key] = value;
  });

  const message = Object.keys(map)
    .sort()
    .map((k) => `${k}=${map[k]}`)
    .join('&');

  const digest = crypto.createHmac('sha256', SHOPIFY_API_SECRET).update(message).digest('hex');

  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(hmac));
}

export async function exchangeCodeForToken(shop: string, code: string) {
  const resp = await fetch(`https://${shop}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: SHOPIFY_API_KEY,
      client_secret: SHOPIFY_API_SECRET,
      code,
    }),
  });

  if (!resp.ok) {
    throw new Error('Failed to exchange code for token');
  }

  const data = await resp.json();
  return data.access_token as string;
}

export async function fetchShopProducts(shop: string, accessToken: string) {
  const resp = await fetch(
    `https://${shop}/admin/api/2024-01/products.json?limit=50&fields=id,title,images,tags,variants,vendor`,
    {
      headers: {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json',
      },
      cache: 'no-cache',
    },
  );

  if (!resp.ok) {
    throw new Error('Failed to fetch products from Shopify');
  }

  const data = await resp.json();
  return data.products as Array<{
    id: number;
    title: string;
    tags?: string;
    vendor?: string;
    images?: { src: string }[];
    variants?: { price: string }[];
  }>;
}

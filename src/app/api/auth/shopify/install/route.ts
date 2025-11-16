import { NextRequest, NextResponse } from 'next/server';
import { getInstallUrl } from '@/lib/shopify';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const shop = searchParams.get('shop');

  if (!shop) {
    return new NextResponse('Missing shop param', { status: 400 });
  }

  const { url } = getInstallUrl(shop);
  return NextResponse.redirect(url);
}

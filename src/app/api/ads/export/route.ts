import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { AdPlatform } from '@prisma/client';

export const dynamic = 'force-dynamic';

function toCsv(rows: string[][]) {
  return rows.map((r) => r.map((c) => `"${(c ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
}

export async function POST(req: NextRequest) {
  const { draftId, format = 'csv', platform } = await req.json();

  if (!draftId || !platform) {
    return new NextResponse('Missing draftId or platform', { status: 400 });
  }

  const draft = await prisma.adDraft.findUnique({ where: { id: draftId } });
  if (!draft) {
    return new NextResponse('Draft not found', { status: 404 });
  }

  const variants = draft.variants as any[];

  let rows: string[][] = [];

  if (platform === 'META') {
    rows = [
      ['Headline', 'PrimaryText', 'Description', 'CTA'],
      ...variants.map((v) => [v.headline, v.primaryText, v.description, v.cta]),
    ];
  } else if (platform === 'GOOGLE') {
    rows = [
      ['Headlines', 'Descriptions', 'CTA', 'Path'],
      ...variants.map((v) => [
        (v.headlines || []).join(' | '),
        (v.descriptions || []).join(' | '),
        v.cta,
        (v.path || []).join('/'),
      ]),
    ];
  } else {
    return new NextResponse('Unsupported platform', { status: 400 });
  }

  const csv = toCsv(rows);
  const fileName = `adwiz_${platform.toLowerCase()}_${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${fileName}"`,
    },
  });
}

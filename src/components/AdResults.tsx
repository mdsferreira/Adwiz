'use client';

import { useState } from 'react';

type Draft = {
  id: string;
  platform: 'META' | 'GOOGLE';
  variants: any[];
  audiences?: any;
};

type Props = {
  drafts: Draft[];
};

export function AdResults({ drafts }: Props) {
  const [activePlatform, setActivePlatform] = useState<'META' | 'GOOGLE'>(
    drafts[0]?.platform ?? 'META',
  );

  const current = drafts.filter((d) => d.platform === activePlatform);

  async function exportCsv(draftId: string, platform: 'META' | 'GOOGLE') {
    const res = await fetch('/api/ads/export', {
      method: 'POST',
      body: JSON.stringify({ draftId, platform, format: 'csv' }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) return;

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `adwiz_${platform.toLowerCase()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function copyText(text: string) {
    await navigator.clipboard.writeText(text);
    alert('Copied to clipboard');
  }

  return (
    <div className="space-y-4">
      <div className="inline-flex rounded-full border p-1 text-xs">
        <button
          className={`rounded-full px-3 py-1 ${
            activePlatform === 'META' ? 'bg-black text-white' : ''
          }`}
          onClick={() => setActivePlatform('META')}
        >
          Meta Ads
        </button>
        <button
          className={`rounded-full px-3 py-1 ${
            activePlatform === 'GOOGLE' ? 'bg-black text-white' : ''
          }`}
          onClick={() => setActivePlatform('GOOGLE')}
        >
          Google Ads
        </button>
      </div>

      {current.map((draft) => (
        <div key={draft.id} className="space-y-3 rounded-xl border p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">
              {draft.platform} – {draft.variants.length} variants
            </h3>
            <button
              onClick={() => exportCsv(draft.id, draft.platform)}
              className="text-xs underline"
            >
              Download CSV
            </button>
          </div>

          <div className="space-y-3">
            {draft.variants.map((v, idx) => {
              const textBlock =
                draft.platform === 'META'
                  ? `Headline: ${v.headline}\nPrimary: ${v.primaryText}\nDescription: ${v.description}\nCTA: ${v.cta}`
                  : `Headlines: ${(v.headlines || []).join(', ')}\nDescriptions: ${(v.descriptions || []).join(', ')}\nCTA: ${v.cta}`;

              return (
                <div key={idx} className="rounded-lg border bg-gray-50 p-3 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Variant {idx + 1}</span>
                    <button onClick={() => copyText(textBlock)} className="text-[11px] underline">
                      Copy
                    </button>
                  </div>
                  <pre className="whitespace-pre-wrap font-mono text-[11px]">{textBlock}</pre>
                </div>
              );
            })}
          </div>

          {draft.audiences && (
            <div className="rounded-lg border bg-white p-3 text-xs">
              <div className="mb-1 font-semibold">Audience suggestions</div>
              <pre className="whitespace-pre-wrap font-mono text-[11px]">
                {JSON.stringify(draft.audiences, null, 2)}
              </pre>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

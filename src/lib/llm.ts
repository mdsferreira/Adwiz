import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

type MetaVariant = {
  headline: string;
  primaryText: string;
  description: string;
  cta: string;
};

type MetaAudience = {
  name: string;
  interests: string[];
};

type GoogleVariant = {
  headlines: string[];
  descriptions: string[];
  path?: string[];
  cta: string;
};

type GoogleAudience = {
  keywords: string[];
};

export type GenerateAdInput = {
  product: {
    title: string;
    price?: string | null;
    tags?: string | null;
    vendor?: string | null;
  };
  platforms: ('META' | 'GOOGLE')[];
  tone: string;
  numVariants: number;
};

export async function generateAds(input: GenerateAdInput) {
  const { product, platforms, tone, numVariants } = input;

  const prompt = `
You are an expert ad copywriter.

Product:
- Title: ${product.title}
- Price: ${product.price ?? 'N/A'}
- Tags: ${product.tags ?? 'N/A'}
- Brand: ${product.vendor ?? 'N/A'}

Tone: ${tone}
Platforms requested: ${platforms.join(', ')}

Return a JSON object with this structure:

{
  "meta": {
    "variants": [
      { "headline": "...", "primaryText": "...", "description": "...", "cta": "Shop Now" }
    ],
    "audiences": [
      { "name": "...", "interests": ["...", "..."] }
    ]
  },
  "google": {
    "variants": [
      { "headlines": ["..."], "descriptions": ["..."], "cta": "Shop Now", "path": ["optional","path"] }
    ],
    "audiences": {
      "keywords": ["...", "..."]
    }
  }
}

Generate ${numVariants} variants per requested platform. If a platform is not requested, set it to null.
Keep headlines and descriptions within their usual ad length limits.
Return ONLY JSON.
`;

  const completion = await client.responses.create({
    model: 'gpt-4.1-mini',
    input: prompt,
  });

  const text = completion.output[0].content[0].text ?? '{}';
  let parsed: any = {};
  try {
    parsed = JSON.parse(text);
  } catch (e) {
    console.error('Failed to parse LLM JSON', e, text);
    throw new Error('LLM JSON parse error');
  }

  return parsed as {
    meta: { variants: MetaVariant[]; audiences: MetaAudience[] } | null;
    google: { variants: GoogleVariant[]; audiences: GoogleAudience } | null;
  };
}

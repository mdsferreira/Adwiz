import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';

export function ConnectShopifyButton() {
  const { data: session } = useSession();

  if (!session?.user) {
    return (
      <button onClick={() => signIn('google')} className="text-xs underline">
        Sign in with Google to connect Shopify
      </button>
    );
  }

  // You can ask for the shop domain in a small form instead of hardcoding
  return (
    <Link
      href={`/api/auth/shopify/install?shop=YOURSHOP.myshopify.com`}
      className="text-xs underline"
    >
      Connect Shopify Store
    </Link>
  );
}

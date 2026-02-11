import { headers } from 'next/headers';
import HeaderServer from './HeaderServer';
import DiscoverStickyHeader from './discover/DiscoverStickyHeader';

export default async function ConditionalHeader() {
  // Get pathname from middleware-set header to determine homeHref for /new routes
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '/';
  
  // /discover: sticky header + calm hero + "What is Ember?" sheet (discover-only)
  if (pathname.startsWith('/discover')) {
    return <DiscoverStickyHeader />;
  }
  
  // /new redirects to /discover; both use /discover as home
  const homeHref = pathname.startsWith('/new') ? '/discover' : '/';
  
  // Always show unified header - it's auth-aware
  return <HeaderServer homeHref={homeHref} />;
}


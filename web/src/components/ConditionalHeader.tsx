import { headers } from 'next/headers';
import HeaderServer from './HeaderServer';

export default async function ConditionalHeader() {
  // Get pathname from middleware-set header to determine homeHref for /new routes
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '/';
  
  // /new redirects to /discover; both use /discover as home
  const homeHref = pathname.startsWith('/discover') || pathname.startsWith('/new') ? '/discover' : '/';
  
  // Always show unified header - it's auth-aware
  return <HeaderServer homeHref={homeHref} />;
}


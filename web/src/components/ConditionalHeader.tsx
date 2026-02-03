import { headers } from 'next/headers';
import HeaderServer from './HeaderServer';

export default async function ConditionalHeader() {
  // Get pathname from middleware-set header to determine homeHref for /new routes
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '/';
  
  // For /new and /discover routes, set homeHref to keep users in the experience
  const homeHref = pathname.startsWith('/discover') ? '/discover' : pathname.startsWith('/new') ? '/new' : '/';
  
  // Always show unified header - it's auth-aware
  return <HeaderServer homeHref={homeHref} />;
}


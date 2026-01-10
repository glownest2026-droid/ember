import { headers } from 'next/headers';
import HeaderServer from './HeaderServer';

export default async function ConditionalHeader() {
  // Get pathname from middleware-set header to determine homeHref for /new routes
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '/';
  
  // For /new routes, set homeHref to /new to keep users in the experience
  const homeHref = pathname.startsWith('/new') ? '/new' : '/';
  
  // Always show unified header - it's auth-aware
  return <HeaderServer homeHref={homeHref} />;
}


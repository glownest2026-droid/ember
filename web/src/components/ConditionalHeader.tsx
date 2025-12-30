import HeaderServer from './HeaderServer';

/**
 * Unified header that's auth-aware on all routes.
 * Always uses HeaderServer for consistent auth state.
 */
export default function ConditionalHeader() {
  return <HeaderServer />;
}


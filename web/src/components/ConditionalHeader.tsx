import HeaderServer from './HeaderServer';

export default function ConditionalHeader() {
  // Always show unified header - it's auth-aware
  return <HeaderServer />;
}


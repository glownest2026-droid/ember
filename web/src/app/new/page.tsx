import { redirect } from 'next/navigation';

export default function NewPage() {
  // Default to 26 months (matching the mockup)
  redirect('/new/26');
}


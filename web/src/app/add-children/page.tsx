import { AddChildForm } from '@/components/add-children/AddChildForm';

export const dynamic = 'force-dynamic';

/** /add-children — Add-child form (Figma). List lives on /family. */
export default function AddChildrenPage() {
  return <AddChildForm backHref="/family" />;
}

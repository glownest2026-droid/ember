export const dynamic = "force-dynamic";
import ChildForm from '../_components/ChildForm';

export default function NewChildPage() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Add Child Profile</h1>
      <ChildForm />
    </div>
  );
}


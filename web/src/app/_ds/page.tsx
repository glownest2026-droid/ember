import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";

export const dynamic = "force-dynamic";

export default function DesignSystemPage() {
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <section>
        <Heading level={1}>Ember — Design Tokens & Components</Heading>
        <p className="text-[var(--color-muted)] mt-2">Edit <code>src/styles/theme.css</code> to change brand look & feel.</p>
      </section>

      <section className="space-y-3">
        <Heading level={2}>Buttons</Heading>
        <div className="flex gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button disabled>Disabled</Button>
        </div>
      </section>

      <section className="space-y-3">
        <Heading level={2}>Card</Heading>
        <Card>
          <CardHeader><Heading level={3}>Card title</Heading></CardHeader>
          <CardBody>Card body text using tokens for radius, shadow and borders.</CardBody>
        </Card>
      </section>

      <section className="space-y-3">
        <Heading level={2}>States</Heading>
        <div className="flex items-center gap-3">
          <Spinner />
          <EmptyState title="No items yet" />
          <ErrorState message="Failed to load" />
        </div>
      </section>
    </div>
  );
}

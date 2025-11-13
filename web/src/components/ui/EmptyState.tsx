import { Button } from "./Button";
export function EmptyState({ title="Nothing here yet", actionLabel, onAction }: { title?: string; actionLabel?: string; onAction?: () => void; }) {
  return (
    <div className="text-center p-8 border border-dashed border-[var(--color-border)] rounded-[var(--radius-lg)]">
      <p className="text-[var(--color-muted)] mb-3">{title}</p>
      {actionLabel && <Button variant="secondary" onClick={onAction}>{actionLabel}</Button>}
    </div>
  );
}

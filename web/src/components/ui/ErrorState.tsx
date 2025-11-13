import { Button } from "./Button";
export function ErrorState({ message="Something went wrong", onRetry }: { message?: string; onRetry?: () => void; }) {
  return (
    <div className="text-center p-8 border border-red-200 bg-red-50 text-red-800 rounded-[var(--radius-lg)]">
      <p className="mb-3">{message}</p>
      {onRetry && <Button variant="primary" onClick={onRetry}>Retry</Button>}
    </div>
  );
}

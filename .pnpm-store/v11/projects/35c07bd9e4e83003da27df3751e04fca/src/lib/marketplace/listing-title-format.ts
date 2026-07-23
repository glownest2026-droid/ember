/**
 * Parent-facing product title formatting (no server-only — safe for client + server).
 */

const MINOR_WORDS = new Set(["a", "an", "the", "and", "or", "for", "of", "to", "with", "in", "on"]);

/** e.g. "toy knight helmet" → "Toy knight helmet" */
export function formatProductTitleCase(value: string | null | undefined): string {
  const trimmed = String(value ?? "").trim();
  if (!trimmed) return "";

  const words = trimmed.toLowerCase().split(/\s+/);
  return words
    .map((word, index) => {
      if (index === 0) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
      // Keep the trailing object noun lowercase (helmet, toy, book, …).
      if (index === words.length - 1) {
        return word;
      }
      if (MINOR_WORDS.has(word)) {
        return word;
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

type AffiliateDisclosureNoticeProps = {
  /** When true, copy refers to live retailer links on the page. */
  hasRetailerLinks?: boolean;
  className?: string;
};

export function AffiliateDisclosureNotice({
  hasRetailerLinks = false,
  className = '',
}: AffiliateDisclosureNoticeProps) {
  const copy = hasRetailerLinks
    ? 'Some retailer links may earn Ember a commission at no extra cost to you. Stage-fit and safety rules come first.'
    : 'When Ember links to retailers, some links may earn us a commission at no extra cost to you. Stage-fit and safety rules come first.';

  return (
    <p
      className={`text-xs leading-relaxed text-[#66717D] ${className}`.trim()}
      role="note"
    >
      {copy}
    </p>
  );
}

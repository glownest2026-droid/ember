import { BlockShell } from "./BlockShell";
import { fonts, radius } from "./tokens";

export type HeroBlockProps = {
  eyebrow?: string;
  heading: string;
  subheading?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
};

export function HeroBlock(props: HeroBlockProps) {
  const { eyebrow, heading, subheading, primaryLabel, primaryHref, secondaryLabel, secondaryHref } = props;
  return (
    <BlockShell background="default">
      <div className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)] items-center">
        <div className="space-y-4">
          {eyebrow && (
            <p className="text-sm font-semibold uppercase tracking-wide text-amber-600">
              {eyebrow}
            </p>
          )}
          <h1
            className="text-3xl md:text-4xl font-semibold text-slate-900"
            style={{ fontFamily: fonts.heading }}
          >
            {heading}
          </h1>
          {subheading && (
            <p
              className="text-base md:text-lg text-slate-600"
              style={{ fontFamily: fonts.body }}
            >
              {subheading}
            </p>
          )}
          {(primaryLabel || secondaryLabel) && (
            <div className="flex flex-wrap gap-3 pt-2">
              {primaryLabel && primaryHref && (
                <a
                  href={primaryHref}
                  className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800"
                >
                  {primaryLabel}
                </a>
              )}
              {secondaryLabel && secondaryHref && (
                <a
                  href={secondaryHref}
                  className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium text-slate-900 bg-slate-100 hover:bg-slate-200"
                >
                  {secondaryLabel}
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </BlockShell>
  );
}

export type ValueProp = {
  icon?: string;
  heading: string;
  body?: string;
};

export type ValuePropsBlockProps = {
  title?: string;
  items: ValueProp[];
};

export function ValuePropsBlock({ title, items }: ValuePropsBlockProps) {
  return (
    <BlockShell background="default">
      <div className="space-y-6">
        {title && (
          <h2 className="text-2xl font-semibold text-slate-900" style={{ fontFamily: fonts.heading }}>
            {title}
          </h2>
        )}
        <div className="grid gap-6 md:grid-cols-3">
          {items?.map((item, index) => (
            <div
              key={index}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              style={{ borderRadius: radius.lg }}
            >
              {item.icon && (
                <div className="mb-3 text-2xl" aria-hidden="true">
                  {item.icon}
                </div>
              )}
              <h3 className="text-base font-semibold text-slate-900" style={{ fontFamily: fonts.heading }}>
                {item.heading}
              </h3>
              {item.body && (
                <p className="mt-2 text-sm text-slate-600" style={{ fontFamily: fonts.body }}>
                  {item.body}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </BlockShell>
  );
}

export type FeatureGridItem = {
  label: string;
  description?: string;
  badge?: string;
};

export type FeatureGridBlockProps = {
  title?: string;
  items: FeatureGridItem[];
};

export function FeatureGridBlock({ title, items }: FeatureGridBlockProps) {
  return (
    <BlockShell background="alt">
      <div className="space-y-6">
        {title && (
          <h2 className="text-2xl font-semibold text-slate-900" style={{ fontFamily: fonts.heading }}>
            {title}
          </h2>
        )}
        <div className="grid gap-4 md:grid-cols-2">
          {items?.map((item, index) => (
            <div key={index} className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900" style={{ fontFamily: fonts.heading }}>
                    {item.label}
                  </p>
                  {item.description && (
                    <p className="mt-1 text-sm text-slate-600" style={{ fontFamily: fonts.body }}>
                      {item.description}
                    </p>
                  )}
                </div>
                {item.badge && (
                  <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                    {item.badge}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </BlockShell>
  );
}

export type CTAStyle = "primary" | "secondary";

export type CtaBlockProps = {
  kicker?: string;
  heading: string;
  body?: string;
  primaryLabel: string;
  primaryHref: string;
  variant?: CTAStyle;
};

export function CtaBlock({ kicker, heading, body, primaryLabel, primaryHref, variant = "primary" }: CtaBlockProps) {
  const primaryClass =
    variant === "secondary"
      ? "bg-white text-slate-900 border border-slate-200 hover:bg-slate-50"
      : "bg-slate-900 text-white hover:bg-slate-800";

  return (
    <BlockShell background="alt">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="space-y-2">
          {kicker && (
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
              {kicker}
            </p>
          )}
          <h2 className="text-xl md:text-2xl font-semibold text-slate-900" style={{ fontFamily: fonts.heading }}>
            {heading}
          </h2>
          {body && (
            <p className="text-sm text-slate-600" style={{ fontFamily: fonts.body }}>
              {body}
            </p>
          )}
        </div>
        <a
          href={primaryHref}
          className={`inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium ${primaryClass}`}
        >
          {primaryLabel}
        </a>
      </div>
    </BlockShell>
  );
}

export type SplitCtaBlockProps = {
  left: CtaBlockProps;
  right: CtaBlockProps;
};

export function SplitCtaBlock({ left, right }: SplitCtaBlockProps) {
  return (
    <BlockShell background="default">
      <div className="grid gap-4 md:grid-cols-2">
        <CtaBlock {...left} />
        <CtaBlock {...right} />
      </div>
    </BlockShell>
  );
}

export type Testimonial = {
  quote: string;
  name: string;
  role?: string;
};

export type TestimonialListBlockProps = {
  title?: string;
  items: Testimonial[];
};

export function TestimonialListBlock({ title, items }: TestimonialListBlockProps) {
  return (
    <BlockShell background="default">
      <div className="space-y-6">
        {title && (
          <h2 className="text-2xl font-semibold text-slate-900" style={{ fontFamily: fonts.heading }}>
            {title}
          </h2>
        )}
        <div className="grid gap-6 md:grid-cols-3">
          {items?.map((item, index) => (
            <figure
              key={index}
              className="flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5"
            >
              <blockquote className="text-sm text-slate-700" style={{ fontFamily: fonts.body }}>
                “{item.quote}”
              </blockquote>
              <figcaption className="mt-4 text-sm text-slate-900">
                <span className="font-semibold">{item.name}</span>
                {item.role && <span className="text-slate-500"> · {item.role}</span>}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </BlockShell>
  );
}

export type FAQItem = {
  question: string;
  answer: string;
};

export type FAQListBlockProps = {
  title?: string;
  items: FAQItem[];
};

export function FAQListBlock({ title, items }: FAQListBlockProps) {
  return (
    <BlockShell background="alt">
      <div className="space-y-6">
        {title && (
          <h2 className="text-2xl font-semibold text-slate-900" style={{ fontFamily: fonts.heading }}>
            {title}
          </h2>
        )}
        <dl className="space-y-4">
          {items?.map((item, index) => (
            <div key={index} className="rounded-xl border border-slate-200 bg-white p-4">
              <dt className="text-sm font-semibold text-slate-900" style={{ fontFamily: fonts.heading }}>
                {item.question}
              </dt>
              <dd className="mt-2 text-sm text-slate-600" style={{ fontFamily: fonts.body }}>
                {item.answer}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </BlockShell>
  );
}

export type LogoItem = {
  name: string;
  imageUrl?: string;
};

export type LogoWallBlockProps = {
  title?: string;
  items: LogoItem[];
};

export function LogoWallBlock({ title, items }: LogoWallBlockProps) {
  return (
    <BlockShell background="default">
      <div className="space-y-4">
        {title && (
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
            {title}
          </h2>
        )}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {items?.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white px-4 py-3 text-xs font-medium text-slate-500"
            >
              {item.name}
            </div>
          ))}
        </div>
      </div>
    </BlockShell>
  );
}

export type StatItem = {
  label: string;
  value: string;
  helper?: string;
};

export type StatsBarBlockProps = {
  items: StatItem[];
};

export function StatsBarBlock({ items }: StatsBarBlockProps) {
  return (
    <BlockShell background="alt">
      <div className="grid gap-4 md:grid-cols-4">
        {items?.map((item, index) => (
          <div key={index} className="rounded-2xl bg-slate-900 px-4 py-3 text-sm text-white">
            <p className="text-xs uppercase tracking-wide text-slate-300">{item.label}</p>
            <p className="mt-1 text-xl font-semibold">{item.value}</p>
            {item.helper && (
              <p className="mt-1 text-xs text-slate-300">
                {item.helper}
              </p>
            )}
          </div>
        ))}
      </div>
    </BlockShell>
  );
}

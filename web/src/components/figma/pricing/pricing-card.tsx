'use client';

import { Check } from 'lucide-react';

interface PricingCardProps {
  name: string;
  price: string;
  period?: string;
  label: string;
  features: string[];
  ctaText: string;
  recommended?: boolean;
  badge?: string;
  annualPrice?: string;
}

export function PricingCard({
  name,
  price,
  period,
  label,
  features,
  ctaText,
  recommended = false,
  badge,
  annualPrice,
}: PricingCardProps) {
  return (
    <div
      className="relative flex flex-col rounded-3xl p-5 lg:p-6 transition-all duration-300"
      style={{
        backgroundColor: recommended ? 'white' : 'var(--ember-gray-200)',
        border: recommended ? '2px solid var(--ember-primary)' : '1px solid var(--ember-gray-300)',
        boxShadow: recommended ? '0px 12px 48px rgba(0,0,0,0.12)' : '0px 8px 32px rgba(0,0,0,0.08)',
      }}
      onMouseEnter={(e) => {
        if (!recommended) {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0px 12px 48px rgba(0,0,0,0.12)';
        }
      }}
      onMouseLeave={(e) => {
        if (!recommended) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0px 8px 32px rgba(0,0,0,0.08)';
        }
      }}
    >
      {badge && (
        <div
          className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full whitespace-nowrap"
          style={{
            backgroundColor: 'var(--ember-primary)',
            color: 'white',
            fontWeight: 600,
            fontSize: '0.75rem',
          }}
        >
          {badge}
        </div>
      )}

      <div className="mb-3.5">
        <h3
          className="mb-1"
          style={{
            color: 'var(--ember-gray-900)',
            fontSize: '1.25rem',
            fontWeight: 400,
          }}
        >
          {name}
        </h3>
        <div className="mb-1">
          <span
            className="inline-block"
            style={{
              fontSize: '2.5rem',
              fontWeight: 400,
              color: 'var(--ember-gray-900)',
              letterSpacing: '-0.02em',
              lineHeight: 1,
            }}
          >
            {price}
          </span>
          {period && (
            <span
              className="ml-1"
              style={{
                color: 'var(--ember-gray-600)',
                fontSize: '0.875rem',
              }}
            >
              {period}
            </span>
          )}
        </div>
        {annualPrice && (
          <p
            className="mb-1"
            style={{
              color: 'var(--ember-gray-600)',
              fontSize: '0.75rem',
            }}
          >
            {annualPrice}
          </p>
        )}
        <p
          style={{
            color: 'var(--ember-gray-600)',
            fontSize: '0.8125rem',
            lineHeight: 1.35,
          }}
        >
          {label}
        </p>
      </div>

      <ul className="flex-1 mb-4 space-y-1.5">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2">
            <Check
              size={15}
              className="mt-0.5 flex-shrink-0"
              style={{
                color: 'var(--ember-primary)',
                strokeWidth: 2.5,
              }}
            />
            <span
              style={{
                color: 'var(--ember-gray-900)',
                lineHeight: 1.4,
                fontSize: '0.8125rem',
              }}
            >
              {feature}
            </span>
          </li>
        ))}
      </ul>

      <button
        className="w-full rounded-xl px-6 py-3 transition-all duration-300"
        style={{
          backgroundColor: recommended ? 'var(--ember-primary)' : 'transparent',
          color: recommended ? 'white' : 'var(--ember-gray-900)',
          border: recommended ? 'none' : '2px solid var(--ember-gray-300)',
          fontWeight: 600,
          fontSize: '0.9375rem',
        }}
        onMouseEnter={(e) => {
          if (recommended) {
            e.currentTarget.style.backgroundColor = 'var(--ember-primary-dark)';
            e.currentTarget.style.transform = 'scale(1.02)';
          } else {
            e.currentTarget.style.borderColor = 'var(--ember-primary)';
            e.currentTarget.style.color = 'var(--ember-primary)';
          }
        }}
        onMouseLeave={(e) => {
          if (recommended) {
            e.currentTarget.style.backgroundColor = 'var(--ember-primary)';
            e.currentTarget.style.transform = 'scale(1)';
          } else {
            e.currentTarget.style.borderColor = 'var(--ember-gray-300)';
            e.currentTarget.style.color = 'var(--ember-gray-900)';
          }
        }}
      >
        {ctaText}
      </button>
    </div>
  );
}

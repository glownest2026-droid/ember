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
      className="relative flex flex-col rounded-3xl p-8 lg:p-10 transition-all duration-300"
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
          className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full text-sm whitespace-nowrap"
          style={{
            backgroundColor: 'var(--ember-primary)',
            color: 'white',
            fontWeight: 600,
          }}
        >
          {badge}
        </div>
      )}

      <div className="mb-6">
        <h3
          className="mb-2"
          style={{
            color: 'var(--ember-gray-900)',
            fontSize: '1.5rem',
            fontWeight: 400,
          }}
        >
          {name}
        </h3>
        <div className="mb-3">
          <span
            className="inline-block"
            style={{
              fontSize: '3.5rem',
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
              className="ml-2"
              style={{
                color: 'var(--ember-gray-600)',
                fontSize: '1.125rem',
              }}
            >
              {period}
            </span>
          )}
        </div>
        {annualPrice && (
          <p
            className="mb-3 text-sm"
            style={{ color: 'var(--ember-gray-600)' }}
          >
            {annualPrice}
          </p>
        )}
        <p
          style={{
            color: 'var(--ember-gray-600)',
            fontSize: '1.0625rem',
            lineHeight: 1.625,
          }}
        >
          {label}
        </p>
      </div>

      <ul className="flex-1 mb-8 space-y-4">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <Check
              size={20}
              className="mt-0.5 flex-shrink-0"
              style={{
                color: 'var(--ember-primary)',
                strokeWidth: 2,
              }}
            />
            <span style={{ color: 'var(--ember-gray-900)' }}>{feature}</span>
          </li>
        ))}
      </ul>

      <button
        className="w-full rounded-xl px-8 py-4 transition-all duration-300"
        style={{
          backgroundColor: recommended ? 'var(--ember-primary)' : 'transparent',
          color: recommended ? 'white' : 'var(--ember-gray-900)',
          border: recommended ? 'none' : '2px solid var(--ember-gray-300)',
          fontWeight: 600,
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

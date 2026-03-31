'use client';

import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface FAQItemProps {
  question: string;
  answer: string;
}

export function FAQItem({ question, answer }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="border-b transition-colors duration-300"
      style={{ borderColor: 'var(--ember-gray-300)' }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left transition-colors duration-300"
        style={{ color: 'var(--ember-gray-900)' }}
      >
        <span
          className="pr-8"
          style={{
            fontSize: '1.125rem',
            fontWeight: 500,
          }}
        >
          {question}
        </span>
        <ChevronDown
          size={20}
          className="flex-shrink-0 transition-transform duration-300"
          style={{
            color: 'var(--ember-primary)',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </button>
      {isOpen && (
        <div
          className="pb-6 pr-8"
          style={{
            color: 'var(--ember-gray-600)',
            lineHeight: 1.625,
          }}
        >
          {answer}
        </div>
      )}
    </div>
  );
}

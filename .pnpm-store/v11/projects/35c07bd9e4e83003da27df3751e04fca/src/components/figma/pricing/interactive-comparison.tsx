'use client';

import { useState } from 'react';
import { Heart, Eye, MapPin, Package, TrendingUp, Gift } from 'lucide-react';

type ComparisonRow = 'know' | 'buy' | 'move';

interface RowData {
  id: ComparisonRow;
  title: string;
  free: string;
  plus: string;
}

const rows: RowData[] = [
  {
    id: 'know',
    title: 'Know it',
    free: 'Browse what fits this age yourself.',
    plus: "Unlock stage alerts and guidance to stay ahead, so you know what's coming next, why it's happening, and which play ideas may help before it catches you off guard.",
  },
  {
    id: 'buy',
    title: 'Buy it',
    free: 'Search, compare, and decide for yourself.',
    plus: 'Get Ember Picks — discover the best products backed across industry sources, pre-researched and those worth your time.',
  },
  {
    id: 'move',
    title: 'Pass it on',
    free: 'Make your own gift list, and list things yourself when you are ready.',
    plus: 'Keep family buying in sync with what your child actually needs next, and get smart pass-it-on prompts when it may be time to clear space and help another local family.',
  },
];

export function InteractiveComparison() {
  const [selectedRow, setSelectedRow] = useState<ComparisonRow>('buy');

  return (
    <div className="rounded-3xl p-8 lg:p-12" style={{ backgroundColor: 'white' }}>
      <div className="hidden lg:grid grid-cols-[58%_42%] gap-8 lg:gap-12">
        <div>
          <div className="grid grid-cols-[auto_1fr_1fr] gap-4 mb-6 pb-4 border-b" style={{ borderColor: 'var(--ember-gray-300)' }}>
            <div className="w-32"></div>
            <div className="text-center" style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--ember-gray-900)' }}>Free</div>
            <div className="text-center" style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--ember-gray-900)' }}>Ember Plus</div>
          </div>
          <div className="space-y-3">
            {rows.map((row) => (
              <button
                key={row.id}
                onClick={() => setSelectedRow(row.id)}
                className="w-full text-left transition-all duration-300 rounded-2xl"
                style={{
                  backgroundColor: selectedRow === row.id ? 'var(--ember-blush)' : 'transparent',
                  border: selectedRow === row.id ? '2px solid var(--ember-primary-light)' : '2px solid transparent',
                  padding: '1.25rem',
                }}
              >
                <div className="grid grid-cols-[auto_1fr_1fr] gap-4 items-start">
                  <div className="w-32">
                    <div style={{ fontSize: '1.125rem', fontWeight: selectedRow === row.id ? 600 : 500, color: 'var(--ember-gray-900)', lineHeight: 1.3 }}>{row.title}</div>
                    {selectedRow === row.id && (
                      <div className="mt-1 text-xs" style={{ color: 'var(--ember-primary)', fontWeight: 500 }}>See preview →</div>
                    )}
                  </div>
                  <div className="text-sm" style={{ color: 'var(--ember-gray-600)', lineHeight: 1.5 }}>{row.free}</div>
                  <div className="text-sm" style={{ color: 'var(--ember-gray-900)', lineHeight: 1.5, fontWeight: 500 }}>{row.plus}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="rounded-2xl p-6 lg:p-8 sticky top-24" style={{ backgroundColor: 'var(--ember-gray-100)', border: '1px solid var(--ember-gray-300)' }}>
            {selectedRow === 'buy' && <BuyItPreview />}
            {selectedRow === 'know' && <KnowItPreview />}
            {selectedRow === 'move' && <MoveItPreview />}
          </div>
        </div>
      </div>

      <div className="lg:hidden">
        <MobileTabbedComparison selectedRow={selectedRow} onSelectRow={setSelectedRow} />
      </div>
    </div>
  );
}

function BuyItPreview() {
  return (
    <div>
      <div className="mb-2" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--ember-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Buy it</div>
      <p className="mb-6" style={{ fontSize: '0.9375rem', color: 'var(--ember-gray-600)', lineHeight: 1.5 }}>Skip the research spiral.</p>
      <div className="rounded-2xl p-6" style={{ backgroundColor: 'white', border: '1px solid var(--ember-gray-300)' }}>
        <div className="mb-5">
          <div className="inline-block px-3 py-1 rounded-full text-xs mb-3" style={{ backgroundColor: 'rgba(255, 99, 71, 0.15)', color: 'var(--ember-primary)', fontWeight: 600 }}>Research-backed</div>
          <h4 style={{ fontSize: '1.0625rem', color: 'var(--ember-gray-900)', fontWeight: 600 }}>Ember Picks for Jesse</h4>
        </div>
        <div className="space-y-3">
          {[
            { name: 'Kitchen helper stool', reason: 'Perfect for simple helping jobs at counter height', tag: 'Worth buying now', tagColor: 'var(--ember-primary)' },
            { name: 'Foot measuring gauge', reason: 'Get the right shoe size without guessing', tag: 'Gift-friendly', tagColor: '#10b981' },
            { name: 'Shape sorter', reason: 'Supports problem-solving emerging now', tag: 'Good second-hand option', tagColor: '#f59e0b' },
          ].map((product, index) => (
            <div key={index} className="rounded-xl p-3" style={{ backgroundColor: 'var(--ember-gray-100)', border: '1px solid var(--ember-gray-300)' }}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="mb-1" style={{ fontWeight: 500, color: 'var(--ember-gray-900)', fontSize: '0.875rem' }}>{product.name}</div>
                  <div className="text-xs" style={{ color: 'var(--ember-gray-600)' }}>{product.reason}</div>
                </div>
                <div className="ml-3 px-2 py-1 rounded text-xs whitespace-nowrap" style={{ backgroundColor: 'white', color: product.tagColor, border: `1px solid ${product.tagColor}`, fontWeight: 500 }}>{product.tag}</div>
              </div>
              <div className="flex gap-2 mt-2">
                <button className="flex-1 px-3 py-2 rounded-lg text-xs flex items-center justify-center gap-2" style={{ backgroundColor: 'var(--ember-primary)', color: 'white', fontWeight: 500 }}>
                  <Eye size={14} />
                  Visit
                </button>
                <button className="px-3 py-2 rounded-lg text-xs flex items-center justify-center gap-2" style={{ backgroundColor: 'white', color: 'var(--ember-gray-700)', border: '1px solid var(--ember-gray-300)', fontWeight: 500 }}>
                  <Heart size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function KnowItPreview() {
  return (
    <div>
      <div className="mb-2" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--ember-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Know it</div>
      <p className="mb-6" style={{ fontSize: '0.9375rem', color: 'var(--ember-gray-600)', lineHeight: 1.5 }}>Stay ahead of what may be coming next.</p>
      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'white', border: '2px solid var(--ember-primary-light)' }}>
        <div
          className="h-32 bg-cover bg-center"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1612200057237-59ff4c861453?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b2RkbGVyJTIwa2l0Y2hlbiUyMGhlbHBlciUyMHN0b29sJTIwaW5kZXBlbmRlbmNlfGVufDF8fHx8MTc3NDk1MzkzN3ww&ixlib=rb-4.1.0&q=80&w=1080)',
            backgroundColor: 'var(--ember-gray-200)',
          }}
        />
        <div className="p-6">
          <div className="inline-block px-3 py-1 rounded-full text-xs mb-3" style={{ backgroundColor: 'var(--ember-blush)', color: 'var(--ember-primary)', fontWeight: 600 }}>Jesse, 15–18 months</div>
          <h4 className="mb-4" style={{ fontSize: '1.0625rem', fontWeight: 600, color: 'var(--ember-gray-900)' }}>Coming up next for Jesse</h4>
          <div className="space-y-2 mb-4">
            <div className="text-sm" style={{ color: 'var(--ember-gray-700)', lineHeight: 1.5 }}>• Wanting more control</div>
            <div className="text-sm" style={{ color: 'var(--ember-gray-700)', lineHeight: 1.5 }}>• Ready for simple helping jobs</div>
          </div>
          <div className="pt-4 border-t" style={{ borderColor: 'var(--ember-gray-300)' }}>
            <div className="text-xs mb-2" style={{ color: 'var(--ember-gray-600)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Play ideas that may help</div>
            <div className="flex flex-wrap gap-2">
              {['Kitchen stool', 'Posting play', 'Simple puzzles'].map((idea, index) => (
                <div key={index} className="px-3 py-1.5 rounded-lg text-xs" style={{ backgroundColor: 'var(--ember-gray-100)', color: 'var(--ember-gray-900)', fontWeight: 500 }}>{idea}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MoveItPreview() {
  return (
    <div>
      <div className="mb-2" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--ember-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pass it on</div>
      <p className="mb-6" style={{ fontSize: '0.9375rem', color: 'var(--ember-gray-600)', lineHeight: 1.5 }}>Keep family in sync and help items find their next home.</p>
      <div className="rounded-2xl p-6" style={{ backgroundColor: 'white', border: '1px solid var(--ember-gray-300)' }}>
        <div className="mb-6 pb-6 border-b" style={{ borderColor: 'var(--ember-gray-300)' }}>
          <div className="flex items-center gap-2 mb-4">
            <Gift size={16} style={{ color: 'var(--ember-primary)' }} />
            <h4 style={{ fontSize: '0.9375rem', color: 'var(--ember-gray-900)', fontWeight: 600 }}>Good gift ideas for Jesse right now</h4>
          </div>
          <div className="space-y-2">
            {[
              { name: 'Kitchen helper stool', label: 'Useful in the next 3 months' },
              { name: 'Simple shape sorter', label: 'Good for grandparents' },
            ].map((gift, index) => (
              <div key={index} className="rounded-xl p-3 flex items-center justify-between" style={{ backgroundColor: 'var(--ember-gray-100)', border: '1px solid var(--ember-gray-300)' }}>
                <div className="flex-1">
                  <div style={{ fontWeight: 500, color: 'var(--ember-gray-900)', fontSize: '0.8125rem' }}>{gift.name}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--ember-gray-600)' }}>{gift.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#059669' }}>
              <TrendingUp size={12} />
              <span className="text-xs font-semibold">4 nearby families may want these</span>
            </div>
          </div>
          <h4 className="mb-3" style={{ fontSize: '0.9375rem', color: 'var(--ember-gray-900)', fontWeight: 600 }}>Ready to pass on soon</h4>
          <div className="space-y-2 mb-4">
            {[
              { name: 'Baby gym play mat', age: '0–6 months' },
              { name: 'Soft blocks set', age: '9–15 months' },
            ].map((item, index) => (
              <div key={index} className="rounded-xl p-3 flex items-center gap-3" style={{ backgroundColor: 'var(--ember-gray-100)', border: '1px solid var(--ember-gray-300)' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'white' }}>
                  <Package size={14} style={{ color: 'var(--ember-primary)' }} />
                </div>
                <div className="flex-1">
                  <div style={{ fontWeight: 500, color: 'var(--ember-gray-900)', fontSize: '0.8125rem' }}>{item.name}</div>
                  <div className="text-xs mt-0.5 flex items-center gap-1.5" style={{ color: 'var(--ember-gray-600)' }}>
                    <MapPin size={10} />
                    Popular with {item.age} families
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full px-5 py-3 rounded-xl text-sm" style={{ backgroundColor: 'var(--ember-primary)', color: 'white', fontWeight: 600 }}>List as bundle</button>
        </div>
      </div>
    </div>
  );
}

function MobileTabbedComparison({ selectedRow, onSelectRow }: { selectedRow: ComparisonRow; onSelectRow: (row: ComparisonRow) => void }) {
  return (
    <div>
      <div className="flex gap-2 mb-6 p-1 rounded-2xl" style={{ backgroundColor: 'var(--ember-gray-100)' }}>
        {rows.map((row) => (
          <button
            key={row.id}
            onClick={() => onSelectRow(row.id)}
            className="flex-1 px-4 py-3 rounded-xl transition-all duration-300 text-sm"
            style={{
              backgroundColor: selectedRow === row.id ? 'white' : 'transparent',
              color: selectedRow === row.id ? 'var(--ember-gray-900)' : 'var(--ember-gray-600)',
              fontWeight: selectedRow === row.id ? 600 : 500,
              boxShadow: selectedRow === row.id ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
            }}
          >
            {row.title}
          </button>
        ))}
      </div>
      <div className="space-y-5">
        <div className="rounded-2xl p-5" style={{ backgroundColor: 'white', border: '2px solid var(--ember-gray-300)' }}>
          <div className="text-xs mb-3" style={{ color: 'var(--ember-gray-600)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Free</div>
          <p style={{ color: 'var(--ember-gray-700)', lineHeight: 1.6, fontSize: '0.9375rem' }}>{rows.find((r) => r.id === selectedRow)?.free}</p>
        </div>
        <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'white', border: '2px solid var(--ember-primary)' }}>
          <div className="p-5 pb-4">
            <div className="text-xs mb-3" style={{ color: 'var(--ember-primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ember Plus</div>
            <p className="mb-4" style={{ color: 'var(--ember-gray-900)', lineHeight: 1.6, fontSize: '0.9375rem', fontWeight: 500 }}>{rows.find((r) => r.id === selectedRow)?.plus}</p>
          </div>
          <div className="h-px mx-5" style={{ backgroundColor: 'var(--ember-gray-300)' }} />
          <div className="p-5 pt-4">
            {selectedRow === 'buy' && <MobileBuyItPreview />}
            {selectedRow === 'know' && <MobileKnowItPreview />}
            {selectedRow === 'move' && <MobileMoveItPreview />}
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileBuyItPreview() {
  return (
    <div>
      <div className="text-xs mb-3" style={{ color: 'var(--ember-gray-600)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Example: Ember Picks</div>
      <div className="space-y-2.5">
        {[
          { name: 'Kitchen helper stool', tag: 'Worth buying now', color: 'var(--ember-primary)' },
          { name: 'Foot measuring gauge', tag: 'Gift-friendly', color: '#10b981' },
        ].map((product, index) => (
          <div key={index} className="rounded-xl p-3" style={{ backgroundColor: 'var(--ember-gray-100)' }}>
            <div className="flex items-center justify-between">
              <div className="font-medium text-sm" style={{ color: 'var(--ember-gray-900)' }}>{product.name}</div>
              <div className="text-xs px-2 py-1 rounded" style={{ color: product.color, border: `1px solid ${product.color}`, fontWeight: 600, whiteSpace: 'nowrap', marginLeft: '8px' }}>
                {product.tag}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MobileKnowItPreview() {
  return (
    <div>
      <div className="text-xs mb-3" style={{ color: 'var(--ember-gray-600)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Example: Stage alert</div>
      <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--ember-blush)', border: '1px solid var(--ember-primary-light)' }}>
        <div className="text-xs mb-2" style={{ color: 'var(--ember-primary)', fontWeight: 600 }}>Jesse, 15–18 months</div>
        <div className="font-semibold mb-3" style={{ color: 'var(--ember-gray-900)', fontSize: '0.9375rem' }}>Coming up next for Jesse</div>
        <div className="space-y-1.5 text-sm" style={{ color: 'var(--ember-gray-700)' }}>
          <div>• Wanting more control</div>
          <div>• Ready for simple helping jobs</div>
        </div>
      </div>
    </div>
  );
}

function MobileMoveItPreview() {
  return (
    <div>
      <div className="text-xs mb-3" style={{ color: 'var(--ember-gray-600)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Example: Gift sync + Pass on</div>
      <div className="space-y-3">
        <div className="rounded-xl p-3.5" style={{ backgroundColor: 'var(--ember-gray-100)' }}>
          <div className="flex items-center gap-2 mb-2">
            <Gift size={14} style={{ color: 'var(--ember-primary)' }} />
            <div className="text-xs font-semibold" style={{ color: 'var(--ember-gray-900)' }}>Gift ideas for Jesse</div>
          </div>
          <div className="text-sm" style={{ color: 'var(--ember-gray-700)' }}>Kitchen stool, Shape sorter</div>
        </div>
        <div className="rounded-xl p-3.5" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={14} style={{ color: '#059669' }} />
            <div className="text-xs font-semibold" style={{ color: '#059669' }}>4 nearby families may want these</div>
          </div>
          <div className="text-sm" style={{ color: 'var(--ember-gray-700)' }}>Baby gym, Soft blocks</div>
        </div>
      </div>
    </div>
  );
}

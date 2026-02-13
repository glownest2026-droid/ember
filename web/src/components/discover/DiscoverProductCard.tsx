'use client';

import { motion, PanInfo } from 'motion/react';
import { Bookmark, Check, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import type { GatewayPick } from '@/lib/pl/public';
import { getProductIconKey, getProductIconComponent } from '@/lib/icons/productIcon';
import type { ProductIconKey } from '@/lib/icons/productIcon';

const ACCENT = '#FF6347';
const ACCENT_DARK = '#B8432B';
const BORDER = '#E5E7EB';
const TEXT_HIGH = '#1A1E23';
const TEXT_LOW = '#5C646D';

const gradients = [
  'from-orange-50 via-red-50 to-pink-50',
  'from-blue-50 via-indigo-50 to-purple-50',
  'from-green-50 via-emerald-50 to-teal-50',
  'from-yellow-50 via-orange-50 to-red-50',
  'from-purple-50 via-pink-50 to-rose-50',
];

export interface DiscoverProductCardProps {
  pick: GatewayPick;
  ageRangeLabel: string;
  index: number;
  totalCards: number;
  isTop: boolean;
  onSwipe: (direction: 'left' | 'right') => void;
  onSave: (productId: string, triggerEl: HTMLButtonElement | null) => void;
  onHave: (productId: string) => void;
  productUrl: string;
  wrapperLabel?: string | null;
}

export function DiscoverProductCard({
  pick,
  ageRangeLabel,
  index,
  totalCards,
  isTop,
  onSwipe,
  onSave,
  onHave,
  productUrl,
  wrapperLabel,
}: DiscoverProductCardProps) {
  const product = pick.product;
  const iconKey = getProductIconKey(product, wrapperLabel ?? undefined);
  const Icon = getProductIconComponent(iconKey as ProductIconKey);
  const gradient = gradients[Number(String(product.id).replace(/\D/g, '0')) % gradients.length];
  const rationale = product.rationale?.trim() || pick.categoryType?.label || 'Chosen for this age and focus.';
  const shortRationale = rationale.length > 120 ? rationale.slice(0, 120).trim() + '…' : rationale;

  const yOffset = index * 16;
  const xOffset = index * 4;
  const rotation = index % 2 === 0 ? index * 2.5 : -index * 2.5;
  const scale = 1 - index * 0.04;

  const handleDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 80;
    if (Math.abs(info.offset.x) > threshold) {
      onSwipe(info.offset.x > 0 ? 'right' : 'left');
    }
  };

  return (
    <motion.div
      className="absolute w-full max-w-md"
      style={{ zIndex: totalCards - index, transformOrigin: 'bottom center' }}
      initial={{ y: yOffset, x: xOffset, rotate: rotation, scale, opacity: 1 }}
      animate={{ y: yOffset, x: xOffset, rotate: rotation, scale, opacity: 1 }}
      exit={{ x: 0, y: 500, rotate: 0, opacity: 0, transition: { duration: 0.4, ease: 'easeInOut' } }}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      whileHover={isTop ? { scale: scale * 1.02, y: yOffset - 8 } : {}}
      transition={{ type: 'spring', stiffness: 260, damping: 25 }}
    >
      <div
        className="bg-white rounded-[28px] border-2 overflow-hidden cursor-grab active:cursor-grabbing relative"
        style={{
          borderColor: BORDER,
          boxShadow: isTop
            ? '0 20px 60px -15px rgba(0, 0, 0, 0.15), 0 10px 30px -10px rgba(0, 0, 0, 0.1)'
            : `0 ${index * 4 + 8}px ${index * 8 + 20}px -${index * 2 + 5}px rgba(0, 0, 0, 0.12)`,
        }}
      >
        {isTop && (
          <>
            <motion.div
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-md rounded-full p-2 shadow-lg border-2"
              style={{ borderColor: ACCENT }}
              animate={{ x: [-5, 5, -5], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ChevronLeft className="w-6 h-6" style={{ color: ACCENT }} strokeWidth={3} />
            </motion.div>
            <motion.div
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-md rounded-full p-2 shadow-lg border-2"
              style={{ borderColor: ACCENT }}
              animate={{ x: [5, -5, 5], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ChevronRight className="w-6 h-6" style={{ color: ACCENT }} strokeWidth={3} />
            </motion.div>
          </>
        )}

        <div className="absolute top-0 right-0 w-24 h-24 opacity-10">
          <div className="absolute top-4 right-4 w-16 h-16 rounded-full blur-2xl" style={{ backgroundColor: ACCENT }} />
        </div>

        <div className={`relative h-48 bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden`}>
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white/30 rounded-full blur-2xl" />
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/40 rounded-full blur-3xl" />
          </div>
          {product.image_url ? (
            <img
              src={product.image_url}
              alt=""
              className="w-full h-full object-cover"
              draggable={false}
            />
          ) : (
            <motion.div
              className="relative w-28 h-28 rounded-3xl bg-white border-2 border-white/50 flex items-center justify-center shadow-2xl"
              style={{ borderColor: 'rgba(255,255,255,0.5)' }}
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Icon className="w-16 h-16" style={{ color: ACCENT }} strokeWidth={1.5} />
            </motion.div>
          )}
          <div className="absolute top-4 right-4">
            <div className="px-3 py-1.5 bg-white/95 backdrop-blur-md rounded-full border-2 border-white shadow-lg">
              <span className="text-xs font-bold" style={{ color: TEXT_HIGH }}>{ageRangeLabel}</span>
            </div>
          </div>
          <div className="absolute top-4 left-4">
            <div className="px-3 py-1.5 backdrop-blur-md rounded-full shadow-lg" style={{ backgroundColor: ACCENT }}>
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                {product.brand ?? pick.categoryType?.label ?? 'Product'}
              </span>
            </div>
          </div>
        </div>

        <div className="p-5 space-y-3.5 bg-white">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="h-1 w-10 rounded-full bg-gradient-to-r" style={{ background: `linear-gradient(to right, ${ACCENT}, #FF8B6D)` }} />
            </div>
            <h2 className="text-xl font-bold leading-tight" style={{ color: TEXT_HIGH }}>{product.name}</h2>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: TEXT_LOW }}>{shortRationale}</p>
          <div className="bg-gradient-to-br from-[#F1F3F2] to-white rounded-2xl p-4 border-2 relative overflow-hidden" style={{ borderColor: BORDER }}>
            <div className="absolute top-0 right-0 w-20 h-20 rounded-full blur-xl opacity-5" style={{ backgroundColor: ACCENT }} />
            <div className="relative flex items-start gap-2.5">
              <div className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: ACCENT }}>
                <span className="text-white font-bold text-xs">?</span>
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: ACCENT }}>Why this toy?</div>
                <p className="text-xs leading-relaxed" style={{ color: TEXT_HIGH }}>{rationale}</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2.5 pt-1">
            <motion.button
              type="button"
              className="px-3 py-3 text-white rounded-2xl font-bold flex flex-col items-center justify-center gap-1 shadow-lg hover:shadow-xl col-span-1 group"
              style={{ backgroundColor: ACCENT }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => onSave(product.id, e.currentTarget)}
            >
              <Bookmark className="w-4 h-4 group-hover:fill-white transition-all" strokeWidth={2.5} />
              <span className="text-xs">Save</span>
            </motion.button>
            <motion.button
              type="button"
              className="px-3 py-3 bg-white border-2 rounded-2xl font-bold flex flex-col items-center justify-center gap-1 hover:bg-[#FAFAFA] shadow-md hover:shadow-lg col-span-1 group"
              style={{ borderColor: BORDER, color: TEXT_HIGH }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onHave(product.id)}
            >
              <Check className="w-4 h-4 group-hover:transition-colors" style={{ stroke: ACCENT }} strokeWidth={2.5} />
              <span className="text-xs">Have</span>
            </motion.button>
            <motion.a
              href={productUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-3 bg-white border-2 rounded-2xl font-bold flex flex-col items-center justify-center gap-1 hover:bg-[#FAFAFA] shadow-md hover:shadow-lg col-span-1 group"
              style={{ borderColor: BORDER, color: TEXT_HIGH }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <ExternalLink className="w-4 h-4 mx-auto" style={{ color: TEXT_LOW }} strokeWidth={2.5} />
              <span className="text-xs">Visit</span>
            </motion.a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

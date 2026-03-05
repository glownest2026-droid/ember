"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { MapPin, Baby, ShoppingBag, Plus, Info } from "lucide-react";

interface NotificationCard {
  type: "buy" | "sell";
  title: string;
  detail: string;
  distance?: string;
  stage?: string;
  image?: string;
  price?: string;
  condition?: string;
  listedTime?: string;
  whyMatch?: string;
}

const notifications: NotificationCard[] = [
  {
    type: "buy",
    title: "Wooden stacking rings",
    detail: "Available 0.7 miles away",
    stage: "Matches: 8–12m",
    image:
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&q=80",
    price: "£12",
    condition: "Like new",
    listedTime: "2h ago",
    whyMatch:
      "Perfect for developing hand-eye coordination and fine motor skills through stacking play",
  },
  {
    type: "sell",
    title: "4 nearby families just had babies",
    detail: "List your newborn bundle?",
    stage: "Newborn items",
    image:
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400&q=80",
  },
  {
    type: "buy",
    title: "Shape sorting cube",
    detail: "Available 1.2 miles away",
    stage: "Matches: 15–18m",
    image:
      "https://images.unsplash.com/photo-1587912781340-82cbe5827969?w=400&q=80",
    price: "£8",
    condition: "Good",
    listedTime: "5h ago",
    whyMatch:
      "Supports problem-solving and spatial awareness as toddlers learn to match shapes",
  },
  {
    type: "sell",
    title: "3 parents looking for 6–9m toys",
    detail: "List your baby gym?",
    stage: "6–9m items",
    image:
      "https://images.unsplash.com/photo-1560582861-45078880e48e?w=400&q=80",
  },
];

export function NotificationAnimation() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % notifications.length);
        setVisible(true);
      }, 300);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const current = notifications[currentIndex];

  return (
    <div className="relative w-full max-w-md mx-auto h-[450px] sm:h-[500px] flex items-center justify-center">
      {/* Map background with smooth blend */}
      <div className="absolute inset-0 rounded-3xl overflow-hidden">
        <svg
          className="w-full h-full"
          viewBox="0 0 400 400"
          preserveAspectRatio="xMidYMid slice"
        >
          <rect width="400" height="400" fill="#F3F4F6" />
          <ellipse
            cx="100"
            cy="100"
            rx="40"
            ry="35"
            fill="#E5F3E5"
            opacity="0.7"
          />
          <ellipse
            cx="320"
            cy="300"
            rx="50"
            ry="45"
            fill="#E5F3E5"
            opacity="0.7"
          />
          <rect
            x="50"
            y="180"
            width="60"
            height="80"
            fill="#FFFFFF"
            opacity="0.8"
          />
          <rect
            x="280"
            y="100"
            width="70"
            height="90"
            fill="#FFFFFF"
            opacity="0.8"
          />
          <rect
            x="130"
            y="280"
            width="55"
            height="70"
            fill="#FFFFFF"
            opacity="0.8"
          />
          <rect
            x="250"
            y="200"
            width="50"
            height="60"
            fill="#FFFFFF"
            opacity="0.8"
          />
          <path
            d="M 0 200 L 400 200"
            stroke="#D1D5DB"
            strokeWidth="16"
            fill="none"
            opacity="0.6"
          />
          <path
            d="M 200 0 L 200 400"
            stroke="#D1D5DB"
            strokeWidth="16"
            fill="none"
            opacity="0.6"
          />
          <path
            d="M 0 200 L 400 200"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeDasharray="12 8"
            fill="none"
            opacity="0.4"
          />
          <path
            d="M 200 0 L 200 400"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeDasharray="12 8"
            fill="none"
            opacity="0.4"
          />
          <path
            d="M 0 120 L 400 120"
            stroke="#D1D5DB"
            strokeWidth="8"
            fill="none"
            opacity="0.5"
          />
          <path
            d="M 0 280 L 400 280"
            stroke="#D1D5DB"
            strokeWidth="8"
            fill="none"
            opacity="0.5"
          />
          <path
            d="M 100 0 L 100 400"
            stroke="#D1D5DB"
            strokeWidth="8"
            fill="none"
            opacity="0.5"
          />
          <path
            d="M 300 0 L 300 400"
            stroke="#D1D5DB"
            strokeWidth="8"
            fill="none"
            opacity="0.5"
          />
          <g opacity="0.7">
            <circle cx="150" cy="140" r="5" fill="#FF6347">
              <animate
                attributeName="r"
                values="5;7;5"
                dur="2s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.7;1;0.7"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="260" cy="170" r="5" fill="#FF6347">
              <animate
                attributeName="r"
                values="5;7;5"
                dur="2s"
                begin="0.5s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.7;1;0.7"
                dur="2s"
                begin="0.5s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="170" cy="240" r="5" fill="#FF6347">
              <animate
                attributeName="r"
                values="5;7;5"
                dur="2s"
                begin="1s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.7;1;0.7"
                dur="2s"
                begin="1s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="230" cy="250" r="5" fill="#5C646D">
              <animate
                attributeName="r"
                values="5;7;5"
                dur="2s"
                begin="0.3s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.7;1;0.7"
                dur="2s"
                begin="0.3s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="280" cy="150" r="5" fill="#5C646D">
              <animate
                attributeName="r"
                values="5;7;5"
                dur="2s"
                begin="0.8s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.7;1;0.7"
                dur="2s"
                begin="0.8s"
                repeatCount="indefinite"
              />
            </circle>
          </g>
          <circle
            cx="200"
            cy="200"
            r="80"
            fill="none"
            stroke="#FF6347"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            opacity="0.25"
          />
          <circle
            cx="200"
            cy="200"
            r="120"
            fill="none"
            stroke="#FF6347"
            strokeWidth="1"
            strokeDasharray="4 4"
            opacity="0.15"
          />
          <circle cx="200" cy="200" r="10" fill="#FF6347" opacity="0.9" />
          <circle cx="200" cy="200" r="10" fill="#FF6347">
            <animate
              attributeName="r"
              values="10;16;10"
              dur="3s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.9;0.3;0.9"
              dur="3s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="200" cy="200" r="7" fill="#FFFFFF" opacity="1" />
          <circle cx="200" cy="200" r="4" fill="#FF6347" opacity="1" />
        </svg>
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/20 to-white/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-transparent to-white/80" />
      </div>

      <AnimatePresence mode="wait">
        {visible && (
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative w-full max-w-sm z-10 px-4"
          >
            {current.type === "buy" && (
              <div className="bg-white rounded-3xl shadow-[0_12px_48px_rgba(0,0,0,0.12)] border-2 border-[#E5E7EB] overflow-hidden">
                {current.image && (
                  <div className="relative h-40 bg-[#F8F9FA] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={current.image}
                      alt={current.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <div className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-primary text-white shadow-lg">
                        {current.stage}
                      </div>
                    </div>
                    <div className="absolute top-3 right-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1A1E23] text-white shadow-lg">
                        <ShoppingBag
                          className="h-4 w-4"
                          strokeWidth={2.5}
                        />
                      </div>
                    </div>
                  </div>
                )}
                <div className="p-5 space-y-3">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                        Match Nearby
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-[#1A1E23] mb-1">
                      {current.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-[#5C646D]">
                      <MapPin
                        className="h-4 w-4 text-[#5C646D]"
                        strokeWidth={2}
                      />
                      <span>{current.detail}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {current.price && (
                      <span className="text-base font-semibold text-[#1A1E23]">
                        {current.price}
                      </span>
                    )}
                    {current.condition && (
                      <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#F1F3F2] text-[#5C646D] border border-[#E5E7EB]">
                        {current.condition}
                      </div>
                    )}
                    {current.listedTime && (
                      <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#F1F3F2] text-[#5C646D] border border-[#E5E7EB]">
                        {current.listedTime}
                      </div>
                    )}
                  </div>
                  {current.whyMatch && (
                    <button
                      type="button"
                      className="flex items-center gap-1 text-xs text-[#5C646D] hover:text-primary transition-colors duration-300 group"
                    >
                      <Info
                        className="h-3.5 w-3.5"
                        strokeWidth={2}
                      />
                      <span className="underline underline-offset-2">
                        Why this match?
                      </span>
                    </button>
                  )}
                  <button
                    type="button"
                    className="w-full px-4 py-2.5 bg-primary hover:bg-[#E55540] text-white text-sm font-semibold rounded-xl transition-colors duration-300"
                  >
                    View listing →
                  </button>
                </div>
              </div>
            )}

            {current.type === "sell" && (
              <div className="bg-white rounded-3xl shadow-[0_12px_48px_rgba(255,99,71,0.15)] border-2 border-primary/30 overflow-hidden">
                {current.image && (
                  <div className="relative h-40 bg-[#F8F9FA] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={current.image}
                      alt={current.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <div className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-primary text-white shadow-lg">
                        {current.stage}
                      </div>
                    </div>
                    <div className="absolute top-3 right-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white shadow-lg">
                        <Plus
                          className="h-4 w-4"
                          strokeWidth={2.5}
                        />
                      </div>
                    </div>
                  </div>
                )}
                <div className="p-5 space-y-3">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                        Sell Opportunity
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-[#1A1E23] mb-1">
                      {current.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-[#5C646D]">
                      <Baby
                        className="h-4 w-4 text-primary"
                        strokeWidth={2}
                      />
                      <span>{current.detail}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="w-full px-4 py-2.5 bg-primary hover:bg-[#E55540] text-white text-sm font-semibold rounded-xl transition-colors duration-300"
                  >
                    Create listing →
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
        {notifications.map((_, index) => (
          <div
            key={index}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentIndex ? "w-6 bg-primary" : "w-1.5 bg-[#E5E7EB]"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

"use client";

import { motion } from "motion/react";
import { Plus, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface SellSuggestion {
  category: string;
  ageRange: string;
  demand: string;
}

const suggestions: SellSuggestion[] = [
  { category: "Newborn bouncer", ageRange: "0–3m", demand: "4 nearby families looking" },
  { category: "Baby play gym", ageRange: "3–6m", demand: "2 nearby families looking" },
  { category: "Soft books bundle", ageRange: "0–6m", demand: "3 nearby families looking" },
  { category: "Bottle & feeding set", ageRange: "0–6m", demand: "5 nearby families looking" },
];

export function SellSuggestions() {
  return (
    <Card className="rounded-3xl border-2 border-[#E5E7EB] bg-gradient-to-br from-[#FFF5F3] to-white overflow-hidden">
      <div className="p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-primary" strokeWidth={2} />
              <span className="text-xs font-medium text-primary uppercase tracking-wide">
                Sell prompt
              </span>
            </div>
            <h3 className="text-2xl font-normal text-[#1A1E23] mb-2">
              What you could pass on now
            </h3>
            <p className="text-sm text-[#5C646D] font-light">
              Based on your child&apos;s stage, these items might be ready to list
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3 mb-6">
          {suggestions.map((item, index) => (
            <motion.button
              key={index}
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="text-left bg-white border border-[#E5E7EB] rounded-2xl p-4 hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-all duration-300"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <h4 className="font-medium text-[#1A1E23] text-sm">{item.category}</h4>
                <Plus className="h-4 w-4 text-[#5C646D] flex-shrink-0" strokeWidth={2} />
              </div>
              <div className="space-y-1">
                <p className="text-xs text-[#5C646D]">
                  <span className="font-medium">Age range:</span> {item.ageRange}
                </p>
                <p className="text-xs text-primary font-medium">{item.demand}</p>
              </div>
            </motion.button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button className="flex-1" asChild>
            <Link href="/products">Start a listing</Link>
          </Button>
          <Button variant="outline" className="flex-1" asChild>
            <Link href="/products">List a bundle</Link>
          </Button>
        </div>

        <p className="text-xs text-[#5C646D] mt-4 font-light text-center">
          You arrange pickup/payment directly with buyers
        </p>
      </div>
    </Card>
  );
}

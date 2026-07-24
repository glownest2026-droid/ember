// Inline copy of age parsers for local testing (mirrors stage3-ff-check.mjs)
function parseAgeText(raw) {
  const text = String(raw || '').trim();
  if (!text) return null;
  const lower = text.toLowerCase();
  const signals = [];

  const under =
    lower.match(/not suitable(?: for children)? under\s+(\d+)\s*(years?|months?)/i) ||
    lower.match(/under\s+(\d+)\s*(years?|months?).{0,20}(not suitable|choking)/i);
  if (under) {
    const n = Number(under[1]);
    const unit = under[2].startsWith('month') ? 1 : 12;
    const months = n * unit;
    signals.push({
      signal_type: 'safety_exclusion',
      raw_text: text,
      forbidden_under_months: months,
      min_months: months,
      max_months: null,
    });
  }

  const from =
    lower.match(/(?:from|suitable from)\s+(\d+)\s*(years?|months?)/i) ||
    lower.match(/recommended for ages from\s+(\d+)\s*(years?|months?)/i);
  if (from) {
    const n = Number(from[1]);
    const unit = from[2].startsWith('month') ? 1 : 12;
    const months = n * unit;
    signals.push({
      signal_type: 'min_age',
      raw_text: text,
      min_months: months,
      max_months: null,
      forbidden_under_months: months >= 36 ? months : null,
    });
  }

  const range = lower.match(/(?:ages?|age range)\s*:?\s*(\d+)\s*[-–]\s*(\d+)/i);
  if (range) {
    const a = Number(range[1]) * 12;
    const b = Number(range[2]) * 12;
    signals.push({
      signal_type: 'age_range',
      raw_text: text,
      min_months: Math.min(a, b),
      max_months: Math.max(a, b),
      forbidden_under_months: null,
    });
  }

  const plus =
    lower.match(/(?:ages?|age)\s*:?\s*(\d+)\s*\+/i) ||
    lower.match(/(\d+)\s*\+\s*(?:years?|yrs?)/i);
  if (plus && !from) {
    const months = Number(plus[1]) * 12;
    signals.push({
      signal_type: 'min_age',
      raw_text: text,
      min_months: months,
      max_months: null,
      forbidden_under_months: months >= 36 ? months : null,
    });
  }

  return signals;
}

function evaluateAgeGate(pick, band) {
  const collected = [...(pick.age_signals || [])];
  if (pick.age_mark_on_listing) {
    const parsed = parseAgeText(pick.age_mark_on_listing);
    if (parsed) collected.push(...parsed);
  }
  const fail_reasons = [];
  const { min: bMin, max: bMax } = band;
  for (const s of collected) {
    if (s.signal_type === 'interest_age') continue;
    if (s.forbidden_under_months != null && bMin != null && bMin < s.forbidden_under_months) {
      fail_reasons.push(`safety_exclusion_under_${s.forbidden_under_months}`);
    }
    if (s.signal_type === 'min_age' && s.min_months != null && bMin != null && s.min_months > bMin) {
      if (s.min_months >= 36 && bMin < 36) fail_reasons.push(`min_age_${s.min_months}_excludes_under_36`);
      else if (s.min_months > bMax) fail_reasons.push(`min_age_${s.min_months}_above_band_max`);
    }
    if (s.min_months != null && s.max_months != null && bMin != null && bMax != null) {
      const overlaps = s.min_months <= bMax && s.max_months >= bMin;
      if (!overlaps) fail_reasons.push(`age_range_no_overlap`);
    }
  }
  return { result: fail_reasons.length ? 'fail' : 'pass', fail_reasons, signals: collected };
}

const samples = [
  'Recommended for ages from 3 years.',
  'Recommended for ages from 0 year.',
  'Ages 2+',
  'Not suitable for children under 3 years',
  'Suitable from 18 months',
  'Ages 1-5',
  'WARNING Small Parts Choking Hazard not Suitable for under 2',
];

for (const s of samples) {
  const sig = parseAgeText(s);
  const gate = evaluateAgeGate({ age_signals: sig, age_mark_on_listing: s }, { min: 25, max: 27 });
  console.log(s);
  console.log(' ', JSON.stringify(sig), gate.result, gate.fail_reasons);
}

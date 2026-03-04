'use client';

import React, { useState } from 'react';

/** Fallback image component for sidebar imagery. No Next/Image to match Figma pack exactness. */
export function ImageWithFallback(
  props: React.ImgHTMLAttributes<HTMLImageElement>
) {
  const [didError, setDidError] = useState(false);

  const handleError = () => {
    setDidError(true);
  };

  const { src, alt, style, className, ...rest } = props;

  if (didError || !src) {
    return (
      <div
        className={`inline-block bg-gray-100 text-center align-middle ${className ?? ''}`}
        style={style}
      >
        <div className="flex items-center justify-center w-full h-full min-h-[120px]" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt ?? ''}
      className={className}
      style={style}
      onError={handleError}
      {...rest}
    />
  );
}

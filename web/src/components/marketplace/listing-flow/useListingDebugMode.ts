"use client";

import { useEffect, useState } from "react";

export function useListingDebugMode(): boolean {
  const [debugMode, setDebugMode] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setDebugMode(
      params.get("debug") === "1" || process.env.NODE_ENV === "development"
    );
  }, []);

  return debugMode;
}

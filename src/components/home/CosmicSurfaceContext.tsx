"use client";

import { createContext, type ReactNode } from "react";

/**
 * When true, children live on a cosmic glass plate: in-view animations must not use
 * vertical (or horizontal) slide — only opacity / scale so depth stays “Z-like”, not up/down.
 */
export const CosmicSurfaceContext = createContext(false);

export function CosmicSurfaceProvider({ children }: { children: ReactNode }) {
  return <CosmicSurfaceContext.Provider value={true}>{children}</CosmicSurfaceContext.Provider>;
}

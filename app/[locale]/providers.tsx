"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CosmicExperienceProvider } from "@/context/CosmicExperienceContext";
import { CosmicBootInit } from "@/components/CosmicBootInit";
import { CosmicRouteSync } from "@/components/CosmicRouteSync";
import { ScrollToTop } from "@/components/ScrollToTop";
import { ImmersiveThreeBackground } from "@/components/home/ImmersiveThreeBackground";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider storageKey="pal-theme">
        <CosmicExperienceProvider>
          <ScrollToTop />
          <CosmicBootInit />
          <CosmicRouteSync />
          {/*
            Full-site WebGL stars (single canvas). In DevTools, select: [data-cosmos="immersive-webgl"].
            Mounted here (not under RSC `Layout`) so client navigations keep the same fiber / GL context.
          */}
          <ImmersiveThreeBackground />
          {children}
        </CosmicExperienceProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

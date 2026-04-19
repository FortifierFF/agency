/**
 * Persistent chrome for `app/[locale]/*` (navbar, main, footer). The WebGL cosmos mounts in
 * `app/[locale]/providers.tsx` beside `{children}` so RSC navigation payloads cannot remount it.
 */
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CosmicMainRouteReveal } from "@/components/CosmicMainRouteReveal";
import { RouteFlightController } from "@/components/RouteFlightController";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="relative z-[1] min-h-screen flex flex-col">
      <RouteFlightController />
      <Navbar />
      <main className="relative z-10 flex-1">
        <CosmicMainRouteReveal>{children}</CosmicMainRouteReveal>
      </main>
      <Footer />
    </div>
  );
}

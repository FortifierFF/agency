import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export const SITE_LOGO_PATH = "/pal-studio-logo.png";

const cropFrameClassName = "relative block shrink-0 overflow-hidden";

const croppedImageClassName =
  "absolute left-1/2 top-1/2 h-full w-auto max-w-none -translate-x-1/2 -translate-y-1/2 origin-center object-contain";

type SiteLogoProps = {
  alt: string;
  className?: string;
  wrapperClassName?: string;
  priority?: boolean;
  variant?: "nav" | "footer";
  href?: string;
  linkAriaLabel?: string;
};

export function SiteLogo({
  alt,
  className,
  wrapperClassName,
  priority = false,
  variant = "nav",
  href,
  linkAriaLabel,
}: SiteLogoProps) {
  void variant;

  const cropFrame = (
    <div className={cn(cropFrameClassName, wrapperClassName)}>
      <Image
        src={SITE_LOGO_PATH}
        alt={href ? "" : alt}
        width={480}
        height={160}
        priority={priority}
        className={cn(croppedImageClassName, className)}
      />
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        aria-label={linkAriaLabel ?? alt}
        className="inline-flex w-fit max-w-fit shrink-0 transition-opacity hover:opacity-90"
      >
        {cropFrame}
      </Link>
    );
  }

  return cropFrame;
}

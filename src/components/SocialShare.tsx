"use client";

import { useState, useEffect } from "react";
import { 
  Facebook, 
  Linkedin, 
  Mail,
  MessageCircle,
  MessageSquare
} from "lucide-react";

// Custom X (Twitter) icon component
const XIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Social media platform types
export type SocialPlatform = 
  | "facebook" 
  | "twitter" 
  | "linkedin" 
  | "viber" 
  | "whatsapp" 
  | "email";

interface SocialShareProps {
  /**
   * Array of social platforms to display
   * If not provided, all platforms will be shown
   */
  platforms?: SocialPlatform[];
  /**
   * Custom URL to share (defaults to current page URL)
   */
  url?: string;
  /**
   * Custom title/description for the shared content
   */
  title?: string;
  /**
   * Custom description for the shared content
   */
  description?: string;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Display style: "icons" shows only icons, "labels" shows labels, "both" shows both
   */
  variant?: "icons" | "labels" | "both";
  /**
   * Size of the buttons
   */
  size?: "sm" | "md" | "lg";
}

// Platform configurations with icons and colors
const platformConfig: Record<
  SocialPlatform,
  { icon: React.ElementType; color: string; label: string }
> = {
  facebook: {
    icon: Facebook,
    color: "hover:bg-[#1877F2] hover:text-white",
    label: "Facebook",
  },
  twitter: {
    icon: XIcon,
    color: "hover:bg-[#000000] hover:text-white",
    label: "X (Twitter)",
  },
  linkedin: {
    icon: Linkedin,
    color: "hover:bg-[#0077B5] hover:text-white",
    label: "LinkedIn",
  },
  viber: {
    icon: MessageSquare,
    color: "hover:bg-[#665CAC] hover:text-white",
    label: "Viber",
  },
  whatsapp: {
    icon: MessageCircle,
    color: "hover:bg-[#25D366] hover:text-white",
    label: "WhatsApp",
  },
  email: {
    icon: Mail,
    color: "hover:bg-primary hover:text-primary-foreground",
    label: "Email",
  },
};

// All available platforms
const allPlatforms: SocialPlatform[] = [
  "facebook",
  "twitter",
  "linkedin",
  "viber",
  "whatsapp",
  "email",
];

export function SocialShare({
  platforms,
  url,
  title,
  description,
  className,
  variant = "icons",
  size = "md",
}: SocialShareProps) {
  const [currentUrl, setCurrentUrl] = useState("");
  const [currentTitle, setCurrentTitle] = useState("");

  // Get current page URL and title
  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(url || window.location.href);
      setCurrentTitle(title || document.title || "");
    }
  }, [url, title]);

  // Determine which platforms to show
  const platformsToShow = platforms || allPlatforms;

  // Generate sharing URLs
  const getShareUrl = (platform: SocialPlatform): string => {
    const shareUrl = encodeURIComponent(currentUrl);
    const shareTitle = encodeURIComponent(currentTitle);
    const shareDescription = encodeURIComponent(description || "");

    switch (platform) {
      case "facebook":
        return `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
      case "twitter":
        return `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}${shareDescription ? `&text=${shareDescription}` : ""}`;
      case "linkedin":
        return `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`;
      case "viber":
        return `viber://forward?text=${shareTitle}%20${shareUrl}`;
      case "whatsapp":
        return `https://wa.me/?text=${shareTitle}%20${shareUrl}`;
      case "email":
        return `mailto:?subject=${shareTitle}&body=${shareDescription || shareTitle}%20${shareUrl}`;
      default:
        return "#";
    }
  };

  // Handle share click
  const handleShare = (platform: SocialPlatform) => {
    const shareUrl = getShareUrl(platform);

    // For email, use mailto link
    if (platform === "email") {
      window.location.href = shareUrl;
      return;
    }

    // For mobile apps (Viber, WhatsApp), try to open app, fallback to web
    if (platform === "viber" || platform === "whatsapp") {
      window.open(shareUrl, "_blank");
      return;
    }

    // For web platforms, open in popup window
    const width = 600;
    const height = 400;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;

    window.open(
      shareUrl,
      "share",
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
    );
  };

  // Size classes
  const sizeClasses = {
    sm: "h-8 w-8 text-sm",
    md: "h-10 w-10 text-base",
    lg: "h-12 w-12 text-lg",
  };

  const iconSizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  return (
    <div className={cn("flex items-center gap-2 flex-wrap", className)}>
      {platformsToShow.map((platform) => {
        const config = platformConfig[platform];
        const Icon = config.icon;
        const isLabelVariant = variant === "labels" || variant === "both";
        const isIconVariant = variant === "icons" || variant === "both";

        return (
          <Button
            key={platform}
            variant="outline"
            size={size === "sm" ? "sm" : size === "lg" ? "lg" : "default"}
            onClick={() => handleShare(platform)}
            className={cn(
              "rounded-full transition-all duration-200",
              config.color,
              sizeClasses[size],
              isLabelVariant && !isIconVariant && "px-4"
            )}
            aria-label={`Share on ${config.label}`}
            title={`Share on ${config.label}`}
          >
            {isIconVariant && (
              <Icon className={cn(iconSizeClasses[size])} />
            )}
            {isLabelVariant && (
              <span className={cn(isIconVariant && "ml-2")}>
                {config.label}
              </span>
            )}
          </Button>
        );
      })}
    </div>
  );
}

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

// Custom Discord icon component
const DiscordIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
);
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Social media platform types
export type SocialPlatform = 
  | "facebook" 
  | "twitter" 
  | "linkedin" 
  | "viber" 
  | "whatsapp" 
  | "discord"
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
  discord: {
    icon: DiscordIcon,
    color: "hover:bg-[#5865F2] hover:text-white",
    label: "Discord",
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
  "discord",
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
      case "discord":
        // Discord doesn't have a share URL, so we'll copy to clipboard
        return currentUrl;
      case "email":
        return `mailto:?subject=${shareTitle}&body=${shareDescription || shareTitle}%20${shareUrl}`;
      default:
        return "#";
    }
  };

  // Handle share click
  const handleShare = async (platform: SocialPlatform) => {
    // For Discord, copy link to clipboard
    if (platform === "discord") {
      try {
        const shareText = `${currentTitle} ${currentUrl}`;
        await navigator.clipboard.writeText(shareText);
        toast.success("Link copied to clipboard!", {
          description: "You can now paste it in Discord",
        });
        return;
      } catch (err) {
        toast.error("Failed to copy link", {
          description: "Please try again",
        });
        return;
      }
    }

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

"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const t = useTranslations("notFound");
  const tCommon = useTranslations("common");
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center px-4">
        <p className="text-6xl font-bold text-primary mb-4">404</p>
        <h1 className="text-2xl font-bold mb-2">{t("title")}</h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          {t("description")}
        </p>
        <Button asChild className="rounded-full px-6">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {tCommon("backToHome")}
          </Link>
        </Button>
      </div>
    </div>
  );
}

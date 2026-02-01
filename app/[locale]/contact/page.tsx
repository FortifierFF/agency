"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, MapPin, Send, CheckCircle } from "lucide-react";
import { Layout } from "@/components/Layout";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export default function ContactPage() {
  const t = useTranslations("contact");
  const tCommon = useTranslations("common");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const formSchema = z.object({
    name: z.string().min(2, t("nameRequired")).max(100),
    email: z.string().email(t("emailRequired")).max(255),
    company: z.string().max(100).optional(),
    serviceType: z.string().min(1, t("serviceRequired")),
    budgetRange: z.string().min(1, t("budgetRequired")),
    message: z.string().min(10, t("messageRequired")).max(2000),
  });

  type FormData = z.infer<typeof formSchema>;
  
  const serviceOptions = [
    { value: "web-development", label: t("serviceOptions.webDevelopment") },
    { value: "ui-ux-design", label: t("serviceOptions.uiUxDesign") },
    { value: "seo-performance", label: t("serviceOptions.seoPerformance") },
    { value: "mobile-apps", label: t("serviceOptions.mobileApps") },
    { value: "other", label: t("serviceOptions.other") },
  ];

  const budgetOptions = [
    { value: "under-5k", label: t("budgetOptions.under5k") },
    { value: "5k-15k", label: t("budgetOptions.5k15k") },
    { value: "15k-50k", label: t("budgetOptions.15k50k") },
    { value: "50k-plus", label: t("budgetOptions.50kPlus") },
    { value: "not-sure", label: t("budgetOptions.notSure") },
  ];

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      serviceType: "",
      budgetRange: "",
      message: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    // Simulate API call - replace with actual submission logic
    // TODO: Implement server action or API route for form submission
    console.log("Form submitted:", data);
    
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-12">
        <div className="container">
          <AnimatedSection>
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-primary mb-2 uppercase tracking-wide">
                {t("title")}
              </p>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
                {t("title")}
              </h1>
              <p className="text-lg text-muted-foreground">
                {t("description")}
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Form Section */}
      <section className="pb-20">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Form */}
            <div className="lg:col-span-2">
              <AnimatedSection>
                {isSubmitted ? (
                  <div className="p-12 rounded-2xl bg-card border border-border text-center">
                    <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="h-8 w-8 text-success" />
                    </div>
                    <h2 className="text-2xl font-bold mb-4">{tCommon("messageSent")}</h2>
                    <p className="text-muted-foreground mb-8">
                      {tCommon("thanksForReachingOut")}
                    </p>
                    <Button
                      onClick={() => {
                        setIsSubmitted(false);
                        form.reset();
                      }}
                      variant="outline"
                      className="rounded-full"
                    >
                      {tCommon("sendAnotherMessage")}
                    </Button>
                  </div>
                ) : (
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="p-8 rounded-2xl bg-card border border-border space-y-6"
                    >
                      <div className="grid sm:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("name")} *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder={t("namePlaceholder")}
                                  {...field}
                                  className="rounded-lg"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("email")} *</FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder={t("emailPlaceholder")}
                                  {...field}
                                  className="rounded-lg"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="company"
                        render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("company")}</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder={t("companyPlaceholder")}
                                  {...field}
                                  className="rounded-lg"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                        )}
                      />

                      <div className="grid sm:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="serviceType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("serviceType")} *</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="rounded-lg">
                                    <SelectValue placeholder={t("selectService")} />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {serviceOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="budgetRange"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("budgetRange")} *</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="rounded-lg">
                                    <SelectValue placeholder={t("selectRange")} />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {budgetOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("message")} *</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder={t("messagePlaceholder")}
                                  rows={6}
                                  {...field}
                                  className="rounded-lg resize-none"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        size="lg"
                        className="w-full rounded-full"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          tCommon("sending")
                        ) : (
                          <>
                            {tCommon("sendMessage")}
                            <Send className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                )}
              </AnimatedSection>
            </div>

            {/* Sidebar */}
            <div>
              <AnimatedSection delay={0.2}>
                <div className="space-y-8">
                  <div>
                    <h3 className="font-semibold mb-4">{t("directContact")}</h3>
                    <div className="space-y-4">
                      <a
                        href="mailto:hello@apexstudio.com"
                        className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                          <Mail className="h-4 w-4" />
                        </div>
                        hello@apexstudio.com
                      </a>
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                          <MapPin className="h-4 w-4" />
                        </div>
                        {t("remoteLocation")}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-card border border-border">
                    <h3 className="font-semibold mb-2">{t("responseTime")}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t("responseTimeDescription")}
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-card border border-border">
                    <h3 className="font-semibold mb-2">{t("whatHappensNext")}</h3>
                    <ol className="text-sm text-muted-foreground space-y-2">
                      <li>{t("whatHappensNext1")}</li>
                      <li>{t("whatHappensNext2")}</li>
                      <li>{t("whatHappensNext3")}</li>
                    </ol>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

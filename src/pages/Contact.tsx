import { useState } from "react";
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

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email address").max(255),
  company: z.string().max(100).optional(),
  serviceType: z.string().min(1, "Please select a service type"),
  budgetRange: z.string().min(1, "Please select a budget range"),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
});

type FormData = z.infer<typeof formSchema>;

const serviceOptions = [
  { value: "web-development", label: "Website / Web App" },
  { value: "ui-ux-design", label: "UI/UX Design" },
  { value: "seo-performance", label: "SEO & Performance" },
  { value: "mobile-apps", label: "Mobile App" },
  { value: "other", label: "Something Else" },
];

const budgetOptions = [
  { value: "under-5k", label: "Under $5,000" },
  { value: "5k-15k", label: "$5,000 - $15,000" },
  { value: "15k-50k", label: "$15,000 - $50,000" },
  { value: "50k-plus", label: "$50,000+" },
  { value: "not-sure", label: "Not Sure Yet" },
];

const Contact = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
                Contact
              </p>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
                Let's talk about your project
              </h1>
              <p className="text-lg text-muted-foreground">
                Fill out the form below and we'll get back to you within 24 hours. 
                Or if you prefer, reach out directly via email.
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
                    <h2 className="text-2xl font-bold mb-4">Message Sent!</h2>
                    <p className="text-muted-foreground mb-8">
                      Thanks for reaching out. We'll review your message and get 
                      back to you within 24 hours.
                    </p>
                    <Button
                      onClick={() => {
                        setIsSubmitted(false);
                        form.reset();
                      }}
                      variant="outline"
                      className="rounded-full"
                    >
                      Send Another Message
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
                              <FormLabel>Name *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Your name"
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
                              <FormLabel>Email *</FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="you@company.com"
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
                            <FormLabel>Company (Optional)</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Your company name"
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
                              <FormLabel>Service Type *</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="rounded-lg">
                                    <SelectValue placeholder="Select a service" />
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
                              <FormLabel>Budget Range *</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="rounded-lg">
                                    <SelectValue placeholder="Select a range" />
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
                            <FormLabel>Message *</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Tell us about your project..."
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
                          "Sending..."
                        ) : (
                          <>
                            Send Message
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
                    <h3 className="font-semibold mb-4">Direct Contact</h3>
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
                        Remote-first, Global
                      </div>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-card border border-border">
                    <h3 className="font-semibold mb-2">Response Time</h3>
                    <p className="text-sm text-muted-foreground">
                      We typically respond within 24 hours during business days. 
                      For urgent inquiries, please mention it in your message.
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-card border border-border">
                    <h3 className="font-semibold mb-2">What happens next?</h3>
                    <ol className="text-sm text-muted-foreground space-y-2">
                      <li>1. We'll review your project details</li>
                      <li>2. Schedule a discovery call</li>
                      <li>3. Provide a tailored proposal</li>
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
};

export default Contact;

export interface PricingPackage {
  id: string;
  name: string;
  description: string;
  timeline: string;
  priceRange: string;
  included: string[];
  bestFor: string[];
  notFor: string[];
  popular?: boolean;
}

export const packages: PricingPackage[] = [
  {
    id: "landing-page-sprint",
    name: "Landing Page Sprint",
    description: "A high-converting landing page designed and built in just 7-10 days. Perfect for launches, campaigns, or testing new ideas.",
    timeline: "7-10 days",
    priceRange: "$3,500 - $6,000",
    included: [
      "Custom landing page design",
      "Responsive development",
      "Basic SEO setup",
      "Contact form integration",
      "Analytics setup",
      "1 round of revisions"
    ],
    bestFor: [
      "Product launches",
      "Marketing campaigns",
      "MVP validation",
      "Event promotions"
    ],
    notFor: [
      "Complex multi-page sites",
      "E-commerce functionality",
      "Custom backend needs"
    ]
  },
  {
    id: "ux-audit",
    name: "UX Audit + Action Plan",
    description: "A comprehensive review of your existing product with prioritized recommendations to improve user experience and conversion.",
    timeline: "5-7 days",
    priceRange: "$2,500 - $4,000",
    included: [
      "Heuristic evaluation",
      "User flow analysis",
      "Conversion funnel review",
      "Competitive analysis",
      "Prioritized recommendations",
      "Executive summary presentation"
    ],
    bestFor: [
      "Established products needing improvement",
      "Pre-redesign assessment",
      "Conversion optimization",
      "Stakeholder alignment"
    ],
    notFor: [
      "Brand new products",
      "Implementation work",
      "Ongoing design support"
    ]
  },
  {
    id: "seo-fix-pack",
    name: "SEO Technical Fix Pack",
    description: "Identify and fix technical SEO issues hurting your rankings. Includes Core Web Vitals optimization and structured data setup.",
    timeline: "1-2 weeks",
    priceRange: "$2,000 - $5,000",
    included: [
      "Technical SEO audit",
      "Core Web Vitals fixes",
      "Schema markup implementation",
      "Meta tag optimization",
      "Sitemap & robots.txt setup",
      "Performance recommendations"
    ],
    bestFor: [
      "Sites with traffic drops",
      "Poor search rankings",
      "Slow-loading pages",
      "Technical debt cleanup"
    ],
    notFor: [
      "Content strategy",
      "Link building",
      "Ongoing SEO management"
    ],
    popular: true
  },
  {
    id: "mvp-build",
    name: "MVP Build",
    description: "Go from idea to launched product in 4-6 weeks. We'll help you define scope, design, and build a functional minimum viable product.",
    timeline: "4-6 weeks",
    priceRange: "$15,000 - $35,000",
    included: [
      "Product strategy session",
      "UI/UX design",
      "Frontend development",
      "Backend/API setup",
      "Database design",
      "Deployment & handover"
    ],
    bestFor: [
      "Startup founders",
      "New product validation",
      "Investor demos",
      "Internal tools"
    ],
    notFor: [
      "Complex enterprise systems",
      "Highly regulated industries",
      "Ongoing maintenance"
    ]
  },
  {
    id: "custom-retainer",
    name: "Custom / Retainer",
    description: "For larger projects or ongoing partnerships. Let's discuss your specific needs and create a custom scope that fits.",
    timeline: "Flexible",
    priceRange: "Custom pricing",
    included: [
      "Dedicated team allocation",
      "Flexible hours/month",
      "Priority support",
      "Regular strategy calls",
      "Custom deliverables",
      "Long-term roadmap planning"
    ],
    bestFor: [
      "Growing companies",
      "Ongoing product development",
      "Multiple projects",
      "Long-term partnerships"
    ],
    notFor: [
      "One-time small projects",
      "Tight fixed budgets"
    ]
  }
];

export const getPackageById = (id: string) => packages.find(p => p.id === id);

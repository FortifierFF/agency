export interface Project {
  slug: string;
  title: string;
  shortSummary: string;
  tags: ("Web" | "UIUX" | "SEO" | "Mobile")[];
  thumbnail: string;
  challenge: string;
  approach: string;
  deliverables: string[];
  techStack: string[];
  resultsMetrics: {
    label: string;
    value: string;
  }[];
  galleryImages: string[];
  clientName: string;
  industry: string;
  timeline: string;
  featured?: boolean;
}

export const projects: Project[] = [
  {
    slug: "fintech-dashboard",
    title: "Fintech Dashboard Redesign",
    shortSummary: "Transformed a complex financial platform into an intuitive experience that increased user engagement by 340%.",
    tags: ["Web", "UIUX"],
    thumbnail: "/placeholder.svg",
    challenge: "The existing dashboard was cluttered with data, leading to user confusion and high support ticket volumes. Users struggled to find key insights and complete essential tasks efficiently.",
    approach: "We conducted extensive user research, created detailed personas, and mapped user journeys. Through iterative prototyping and usability testing, we developed a clean, data-hierarchy-driven interface.",
    deliverables: [
      "Complete UI/UX redesign",
      "Interactive prototype",
      "Design system with 200+ components",
      "Responsive web application",
      "User onboarding flow"
    ],
    techStack: ["React", "TypeScript", "Tailwind CSS", "D3.js", "Framer Motion"],
    resultsMetrics: [
      { label: "User Engagement", value: "+340%" },
      { label: "Task Completion", value: "+85%" },
      { label: "Support Tickets", value: "-60%" },
      { label: "User Satisfaction", value: "4.8/5" }
    ],
    galleryImages: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    clientName: "FinanceFlow",
    industry: "Financial Services",
    timeline: "12 weeks",
    featured: true
  },
  {
    slug: "ecommerce-platform",
    title: "E-commerce Platform Rebuild",
    shortSummary: "Built a high-performance e-commerce platform that handles 10,000+ daily transactions with sub-second load times.",
    tags: ["Web", "SEO"],
    thumbnail: "/placeholder.svg",
    challenge: "The legacy platform couldn't handle traffic spikes during sales events and had poor SEO visibility. Page load times exceeded 8 seconds, causing significant cart abandonment.",
    approach: "We architected a modern JAMstack solution with edge caching, optimized media delivery, and implemented comprehensive technical SEO improvements including structured data.",
    deliverables: [
      "Custom e-commerce platform",
      "Headless CMS integration",
      "Payment gateway setup",
      "Inventory management system",
      "SEO optimization package"
    ],
    techStack: ["Next.js", "Shopify Storefront API", "Vercel", "Algolia", "Stripe"],
    resultsMetrics: [
      { label: "Page Speed", value: "0.8s" },
      { label: "Organic Traffic", value: "+220%" },
      { label: "Conversion Rate", value: "+45%" },
      { label: "Revenue Growth", value: "+180%" }
    ],
    galleryImages: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    clientName: "StyleHub",
    industry: "Retail",
    timeline: "16 weeks",
    featured: true
  },
  {
    slug: "healthcare-mobile-app",
    title: "Healthcare Companion App",
    shortSummary: "Designed and developed a patient-first mobile app that improved medication adherence by 78%.",
    tags: ["Mobile", "UIUX"],
    thumbnail: "/placeholder.svg",
    challenge: "Patients struggled to manage complex medication schedules and often missed doses. The client needed an accessible solution that worked for users of all ages and tech comfort levels.",
    approach: "We prioritized accessibility from day one, implementing voice controls, large touch targets, and simple navigation. Extensive testing with real patients shaped every design decision.",
    deliverables: [
      "iOS and Android applications",
      "Caregiver portal",
      "Medication reminder system",
      "Health tracking dashboard",
      "Pharmacy integration"
    ],
    techStack: ["React Native", "TypeScript", "Node.js", "PostgreSQL", "Firebase"],
    resultsMetrics: [
      { label: "Med Adherence", value: "+78%" },
      { label: "App Store Rating", value: "4.9★" },
      { label: "Daily Active Users", value: "50K+" },
      { label: "Caregiver Adoption", value: "89%" }
    ],
    galleryImages: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    clientName: "MediCare Plus",
    industry: "Healthcare",
    timeline: "20 weeks",
    featured: true
  },
  {
    slug: "saas-landing-optimization",
    title: "SaaS Landing Page Optimization",
    shortSummary: "Redesigned landing pages that doubled demo bookings and reduced bounce rate by 45%.",
    tags: ["Web", "SEO", "UIUX"],
    thumbnail: "/placeholder.svg",
    challenge: "Despite strong traffic, the existing landing pages had poor conversion rates. Messaging was unclear, and users couldn't quickly understand the product's value proposition.",
    approach: "We ran A/B tests on messaging, restructured the information hierarchy, and implemented social proof strategically. Performance optimizations ensured fast load times.",
    deliverables: [
      "Landing page redesign",
      "A/B testing framework",
      "Conversion tracking setup",
      "Performance optimization",
      "Copy recommendations"
    ],
    techStack: ["React", "Next.js", "Vercel Analytics", "Hotjar", "Optimizely"],
    resultsMetrics: [
      { label: "Demo Bookings", value: "+100%" },
      { label: "Bounce Rate", value: "-45%" },
      { label: "Time on Page", value: "+65%" },
      { label: "Lead Quality", value: "+40%" }
    ],
    galleryImages: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    clientName: "CloudSync",
    industry: "Technology",
    timeline: "6 weeks"
  },
  {
    slug: "restaurant-ordering-system",
    title: "Restaurant Ordering System",
    shortSummary: "Created a seamless ordering experience that increased average order value by 35% and reduced wait times.",
    tags: ["Web", "Mobile"],
    thumbnail: "/placeholder.svg",
    challenge: "The restaurant chain struggled with long queues during peak hours and inconsistent ordering experiences across locations. Staff spent excessive time taking orders manually.",
    approach: "We built a unified ordering platform with QR code table ordering, mobile app, and kitchen display integration. Real-time sync ensured accurate order tracking.",
    deliverables: [
      "Web ordering platform",
      "Mobile app (iOS/Android)",
      "Kitchen display system",
      "Admin dashboard",
      "Analytics reporting"
    ],
    techStack: ["React", "React Native", "Node.js", "MongoDB", "Socket.io"],
    resultsMetrics: [
      { label: "Avg Order Value", value: "+35%" },
      { label: "Wait Time", value: "-50%" },
      { label: "Order Accuracy", value: "99.5%" },
      { label: "Customer Satisfaction", value: "+60%" }
    ],
    galleryImages: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    clientName: "FreshBite",
    industry: "Food & Beverage",
    timeline: "14 weeks"
  },
  {
    slug: "real-estate-platform",
    title: "Real Estate Marketplace",
    shortSummary: "Built a property marketplace that generated $2M in transactions within the first quarter.",
    tags: ["Web", "UIUX", "SEO"],
    thumbnail: "/placeholder.svg",
    challenge: "The client wanted to disrupt traditional real estate listings with a modern, user-friendly platform. Existing solutions were outdated and lacked advanced search capabilities.",
    approach: "We created an immersive property browsing experience with virtual tours, advanced filtering, and neighborhood insights. SEO was baked in from the architecture level.",
    deliverables: [
      "Property listing platform",
      "Virtual tour integration",
      "Agent portal",
      "Lead management system",
      "SEO content strategy"
    ],
    techStack: ["Next.js", "TypeScript", "PostgreSQL", "Mapbox", "Three.js"],
    resultsMetrics: [
      { label: "Transactions", value: "$2M+" },
      { label: "Listed Properties", value: "5,000+" },
      { label: "Monthly Visitors", value: "100K+" },
      { label: "Agent Sign-ups", value: "500+" }
    ],
    galleryImages: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    clientName: "HomeFind",
    industry: "Real Estate",
    timeline: "18 weeks"
  }
];

export const getFeaturedProjects = () => projects.filter(p => p.featured);

export const getProjectBySlug = (slug: string) => projects.find(p => p.slug === slug);

export const getProjectsByTag = (tag: string) => 
  tag === "All" ? projects : projects.filter(p => p.tags.includes(tag as "Web" | "UIUX" | "SEO" | "Mobile"));

export const searchProjects = (query: string) => 
  projects.filter(p => 
    p.title.toLowerCase().includes(query.toLowerCase()) ||
    p.shortSummary.toLowerCase().includes(query.toLowerCase()) ||
    p.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
  );

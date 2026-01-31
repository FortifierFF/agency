export interface Service {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  deliverables: string[];
  icon: string;
}

export const services: Service[] = [
  {
    id: "web-development",
    title: "Websites & Web Apps",
    shortTitle: "Web",
    description: "From high-converting landing pages to complex web applications, we build digital experiences that perform. Fast, accessible, and designed to scale with your business.",
    deliverables: [
      "Custom website design & development",
      "Progressive web applications",
      "E-commerce platforms",
      "Content management systems",
      "API integrations",
      "Performance optimization"
    ],
    icon: "Globe"
  },
  {
    id: "ui-ux-design",
    title: "UI/UX Design",
    shortTitle: "UI/UX",
    description: "Beautiful interfaces backed by research and strategy. We create intuitive experiences that delight users and drive conversions through thoughtful design.",
    deliverables: [
      "User research & personas",
      "Information architecture",
      "Wireframing & prototyping",
      "Visual design systems",
      "Usability testing",
      "Design handoff documentation"
    ],
    icon: "Palette"
  },
  {
    id: "seo-performance",
    title: "SEO & Performance",
    shortTitle: "SEO",
    description: "Get found and load fast. We optimize your digital presence for search engines and speed, turning visitors into customers with measurable results.",
    deliverables: [
      "Technical SEO audits",
      "Core Web Vitals optimization",
      "Structured data implementation",
      "Content strategy",
      "Performance monitoring",
      "Analytics setup & reporting"
    ],
    icon: "TrendingUp"
  },
  {
    id: "mobile-apps",
    title: "Mobile Apps",
    shortTitle: "Mobile",
    description: "Native-quality mobile experiences that users love. We build iOS and Android apps that are fast, reliable, and designed for engagement.",
    deliverables: [
      "iOS app development",
      "Android app development",
      "Cross-platform solutions",
      "App store optimization",
      "Push notifications",
      "Offline functionality"
    ],
    icon: "Smartphone"
  }
];

export const getServiceById = (id: string) => services.find(s => s.id === id);

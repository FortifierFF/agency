export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export const faqs: FAQ[] = [
  {
    id: "1",
    question: "How long does a typical project take?",
    answer: "Project timelines vary based on complexity. A landing page sprint takes 7-10 days, while a full MVP build takes 4-6 weeks. During our initial call, we'll provide a realistic timeline based on your specific requirements and priorities."
  },
  {
    id: "2",
    question: "What's your design and development process?",
    answer: "We follow a proven 4-phase process: Discover (understanding your goals and users), Design (wireframes and visual design with your feedback), Build (development with regular check-ins), and Launch & Grow (deployment and optimization). You'll have visibility at every step."
  },
  {
    id: "3",
    question: "Do you work with startups or only established companies?",
    answer: "We work with both! From early-stage startups validating ideas with MVPs to established companies looking to modernize their digital presence. Our packages are designed to fit different stages and budgets."
  },
  {
    id: "4",
    question: "What technologies do you use?",
    answer: "We specialize in modern web technologies: React, Next.js, TypeScript, and Tailwind CSS for web; React Native for mobile apps. We choose the right stack for each project based on requirements, scalability needs, and your team's capabilities."
  },
  {
    id: "5",
    question: "How do you handle revisions and feedback?",
    answer: "Collaboration is built into our process. Each project includes defined revision rounds, and we use tools like Figma for design feedback and regular video calls to ensure we're aligned. We don't disappear—we communicate."
  },
  {
    id: "6",
    question: "What happens after the project launches?",
    answer: "We provide a thorough handover with documentation and training. If you need ongoing support, we offer maintenance retainers. Many clients continue working with us on iterations and new features after launch."
  },
  {
    id: "7",
    question: "Can you work with our existing team or codebase?",
    answer: "Absolutely. We regularly collaborate with in-house teams and can work within existing codebases. We're experienced in code reviews, documentation, and knowledge transfer to ensure smooth handoffs."
  },
  {
    id: "8",
    question: "What's included in your pricing?",
    answer: "Our pricing covers everything needed to deliver the project: strategy, design, development, testing, and deployment. There are no hidden fees. We'll provide a detailed scope before starting so you know exactly what you're getting."
  }
];

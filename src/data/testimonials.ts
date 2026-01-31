export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar?: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "1",
    quote: "They transformed our outdated platform into something our users actually love. The attention to detail and commitment to quality exceeded our expectations.",
    author: "Sarah Chen",
    role: "Head of Product",
    company: "FinanceFlow",
    avatar: "/placeholder.svg"
  },
  {
    id: "2",
    quote: "Our conversion rate doubled within the first month. They didn't just build what we asked for—they understood our business and delivered what we needed.",
    author: "Marcus Rodriguez",
    role: "CEO",
    company: "StyleHub",
    avatar: "/placeholder.svg"
  },
  {
    id: "3",
    quote: "The mobile app they built has a 4.9 rating and our patients genuinely find it easier to manage their health. That's the real measure of success.",
    author: "Dr. Emily Watson",
    role: "Chief Medical Officer",
    company: "MediCare Plus",
    avatar: "/placeholder.svg"
  },
  {
    id: "4",
    quote: "Fast, professional, and incredibly talented. They delivered on time and the results speak for themselves. Our organic traffic is up 220%.",
    author: "James Park",
    role: "Marketing Director",
    company: "CloudSync",
    avatar: "/placeholder.svg"
  }
];

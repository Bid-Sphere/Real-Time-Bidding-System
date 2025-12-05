import { Rocket, Shield, Zap, Globe } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface Feature {
    id: string;
    title: string;
    description: string;
    icon: LucideIcon;
}

export interface Category {
    id: string;
    name: string;
    count: string;
    image: string;
}

export interface Testimonial {
    id: string;
    name: string;
    role: string;
    company: string;
    content: string;
    avatar: string;
}

export const heroContent = {
    title: "Build the Future with Top Talent",
    subtitle: "Connect with world-class organizations. The decentralized marketplace for the next generation of work.",
    ctaPrimary: "Get Started",
    ctaSecondary: "Explore Talent"
};

export const features: Feature[] = [
    {
        id: '1',
        title: "Smart Matching",
        description: "AI-driven algorithms to pair you with the perfect talent or project instantly.",
        icon: Zap
    },
    {
        id: '2',
        title: "Secure Escrow",
        description: "Payments are held securely until work is approved. Trust built into the code.",
        icon: Shield
    },
    {
        id: '3',
        title: "Global Reach",
        description: "Access a worldwide pool of professionals and opportunities without borders.",
        icon: Globe
    },
    {
        id: '4',
        title: "Fast Payments",
        description: "Instant settlements via crypto or traditional banking rails.",
        icon: Rocket
    }
];

export const categories: Category[] = [
    {
        id: '1',
        name: "Development",
        count: "1,200+ Jobs",
        image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: '2',
        name: "Design",
        count: "850+ Jobs",
        image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: '3',
        name: "AI & ML",
        count: "500+ Jobs",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: '4',
        name: "Blockchain",
        count: "300+ Jobs",
        image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=80"
    }
];

export const testimonials: Testimonial[] = [
    {
        id: '1',
        name: "Sarah Chen",
        role: "Product Manager",
        company: "TechFlow",
        content: "The quality of talent here is unmatched. We built our MVP in record time.",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80"
    },
    {
        id: '2',
        name: "Alex Rivera",
        role: "Full Stack Dev",
        company: "Tech Solutions Inc",
        content: "Finally, a platform that treats organizations fairly. The payments are instant.",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
    },
    {
        id: '3',
        name: "Marcus Johnson",
        role: "CTO",
        company: "InnovateX",
        content: "Secure, fast, and professional. This is the future of hiring.",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
    }
];

import React, { useState, useEffect, useRef } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';

// Lucide React Icons
import { 
  Mail, 
  Linkedin, 
  Facebook,
  Instagram,
  ArrowRight, 
  Phone, 
  Globe 
} from 'lucide-react';

// --- Types ---
type Category = 
  | 'Systems Thinking'
  | 'Risk Management'
  | 'Strategic Leadership'
  | 'Disaster Resilience'
  | 'AI Innovation'
  | 'Compliance';

interface CategoryColors {
  accent: string;
  name: string;
}

const CATEGORY_COLORS: Record<Category, CategoryColors> = {
  'Systems Thinking': { accent: '#3B82F6', name: 'blue' },
  'Risk Management': { accent: '#EF4444', name: 'red' },
  'Strategic Leadership': { accent: '#10B981', name: 'emerald' },
  'Disaster Resilience': { accent: '#F59E0B', name: 'amber' },
  'AI Innovation': { accent: '#8B5CF6', name: 'violet' },
  'Compliance': { accent: '#06B6D4', name: 'cyan' }
};

const CATEGORIES: Category[] = [
  'Systems Thinking',
  'Risk Management',
  'Strategic Leadership',
  'Disaster Resilience',
  'AI Innovation',
  'Compliance'
];

// --- Official Assets URLs ---
const OFFICIAL_LOGO_URL = "https://appimize.app/assets/apps/user_1097/images/2c7d825bf937_232_1097.png";
const HERO_BG_IMAGE_URL = "https://appimize.app/assets/apps/user_1097/images/8df0614c4061_739_1097.jpg";
const DDRIVE_IMAGE_URL = "https://appimize.app/assets/apps/user_1097/images/4750f689086d_379_1097.png";
const STRAT_PLANNER_IMAGE_URL = "https://appimize.app/assets/apps/user_1097/images/d6780c531792_34_1097.png";
const RTL_IMAGE_URL = "https://appimize.app/assets/apps/user_1097/images/d479ce1cc4b2_113_1097.png";
const AI_SOLUTIONS_IMAGE_URL = "https://appimize.app/assets/apps/user_1097/images/055b612d128d_302_1097.png";

// --- Intersection Observer Hook for scroll animations ---
const useIntersectionObserver = (options: IntersectionObserverInit = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, { threshold: 0.1, ...options });

    const currentTarget = targetRef.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }
    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [options]);

  return [targetRef, isIntersecting] as const;
};

// --- Animated Counter Component ---
interface AnimatedCounterProps {
  end: number;
  duration?: number;
  suffix?: string;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ 
  end, 
  duration = 2000, 
  suffix = '' 
}) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    const currentRef = counterRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;
    
    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, end, duration]);

  return (
    <span ref={counterRef} className="tabular-nums">
      {count}{suffix}
    </span>
  );
};

// --- Stats Section Component ---
const StatsSection: React.FC = () => {
  const [ref, isVisible] = useIntersectionObserver();
  
  const stats = [
    { value: 15, suffix: '+', label: 'Government Partners', icon: '🏛️' },
    { value: 3200, suffix: '+', label: 'Lives Protected', icon: '🛡️' },
    { value: 70, suffix: '%', label: 'Faster Response Time', icon: '⚡' },
    { value: 98, suffix: '%', label: 'Client Retention', icon: '⭐' }
  ];

  return (
    <section
      ref={ref}
      className={`py-20 px-6 bg-gradient-to-b from-slate-900 to-[#020617] transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      aria-labelledby="stats-heading"
    >
      <div className="max-w-7xl mx-auto">
        <h2 id="stats-heading" className="sr-only">Impact Statistics</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-8 rounded-2xl bg-slate-900/50 border border-white/10 hover:border-blue-500/30 transition-all duration-300 hover:scale-105"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-4xl mb-4" aria-hidden="true">{stat.icon}</div>
              <div className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 mb-2">
                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-slate-400 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- Feature Highlight Component ---
interface FeatureHighlightProps {
  feature: {
    icon: string;
    title: string;
    description: string;
    benefits: string[];
  };
  index: number;
}

const FeatureHighlight: React.FC<FeatureHighlightProps> = ({ feature, index }) => {
  const [ref, isVisible] = useIntersectionObserver();
  
  return (
    <div
      ref={ref}
      className={`group relative p-8 rounded-2xl bg-slate-900/50 border border-white/10 hover:border-blue-500/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 ${
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 to-indigo-700/0 group-hover:from-blue-600/5 group-hover:to-indigo-700/5 rounded-2xl transition-all duration-500"></div>
      <div className="relative z-10">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-blue-500/30">
          <span className="text-3xl" aria-hidden="true">{feature.icon}</span>
        </div>
        <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-blue-300 transition-colors">
          {feature.title}
        </h3>
        <p className="text-slate-300 leading-relaxed mb-6">
          {feature.description}
        </p>
        <ul className="space-y-2">
          {feature.benefits.map((benefit, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
              <span className="text-blue-400 mt-1" aria-hidden="true">→</span>
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// --- Service Interface ---
interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  link: string;
  gradient: string;
  imageUrl: string;
  imageAlt: string;
}

// --- Persona Interface ---
interface Persona {
  target: string;
  desc: string;
  icon: string;
  stats: string;
  color: string;
}

// --- Enhanced Footer Component ---
interface FooterProps {
  onCategorySelect?: (category: Category) => void;
  onNewsletterOpen?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ 
  onCategorySelect, 
  onNewsletterOpen 
}) => {
  const [email, setEmail] = useState('');

  const handleQuickSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      if (onNewsletterOpen) {
        onNewsletterOpen();
      }
    }
  };

  const currentYear = new Date().getFullYear();

  // Utility function to clean URLs
  const cleanUrl = (url: string): string => url.trim();

  return (
    <footer className="bg-[#010409] text-white">
      {/* Newsletter Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">
                Join 10,000+ Leaders Transforming Their Organizations
              </h3>
              <p className="text-white/80">
                Get weekly insights on systems thinking, risk management, and strategic leadership.
              </p>
            </div>
            <form onSubmit={handleQuickSubscribe} className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 md:w-72 px-5 py-3 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-full hover:bg-gray-100 transition-colors flex items-center gap-2"
              >
                Subscribe
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <img 
                src={cleanUrl(OFFICIAL_LOGO_URL)} 
                alt="ASilva Innovations" 
                className="h-12 w-12 object-contain"
              />
              <div>
                <h4 className="font-bold text-xl">ASilva Innovations</h4>
                <p className="text-gray-400 text-sm">Transforming Systems, Empowering Resilience</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6 max-w-sm">
              Building resilient communities through ethical AI and human-centered tech designs. Headquartered in Alabang, Muntinlupa City, Philippines.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 text-gray-400">
              <a href="mailto:info@asilvainnovations.com" className="flex items-center gap-3 hover:text-white transition-colors">
                <Mail className="w-5 h-5" />
                info@asilvainnovations.com
              </a>
              <a href="tel:+639178555134" className="flex items-center gap-3 hover:text-white transition-colors">
                <Phone className="w-5 h-5" />
                +63 (917) 855-5134
              </a>
              <a 
                href={cleanUrl("https://asilvainnovations.com")} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-3 hover:text-white transition-colors"
              >
                <Globe className="w-5 h-5" />
                asilvainnovations.com
              </a>
            </div>

            {/* Social Links */}
            <div className="flex gap-4 mt-6">
              <a 
                href="https://linkedin.asilvainnovations.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 bg-gray-800 rounded-full hover:bg-blue-600 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="https://facebook.asilvainnovations.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 bg-gray-800 rounded-full hover:bg-blue-600 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://instagram.asilvainnovations.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 bg-gray-800 rounded-full hover:bg-pink-600 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Topics Column */}
          <div>
            <h5 className="font-semibold text-lg mb-4">Topics</h5>
            <ul className="space-y-3">
              {CATEGORIES.map((category) => {
                const colors = CATEGORY_COLORS[category];
                return (
                  <li key={category}>
                    <button
                      onClick={() => onCategorySelect?.(category)}
                      className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-left"
                    >
                      <span 
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: colors.accent }}
                      />
                      {category}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h5 className="font-semibold text-lg mb-4">Resources</h5>
            <ul className="space-y-3">
              <li>
                <a 
                  href={cleanUrl("https://asilvainnovations.github.io/case-studies")} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Case Studies
                </a>
              </li>
              <li>
                <a 
                  href={cleanUrl("https://asilvainnovations.github.io/white-papers/")} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Whitepapers
                </a>
              </li>
              <li>
                <a 
                  href={cleanUrl("https://asilvainnovations.github.io/ddrive-m/")} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  DDRiVE-M
                </a>
              </li>
              <li>
                <a 
                  href={cleanUrl("https://asilvainnovations.github.io/strat-planner-pwa/public/index.html")} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Strat Planner Pro
                </a>
              </li>
              <li>
                <a 
                  href={cleanUrl("https://asilvainnovations.github.io/website/rtl.html")} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Real-Time Leadership
                </a>
              </li>
              <li>
                <a 
                  href={cleanUrl("https://asilvainnovations.com/smart-flood-detection/")} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Smart Flood Detection
                </a>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h5 className="font-semibold text-lg mb-4">Company</h5>
            <ul className="space-y-3">
              <li>
                <a 
                  href={cleanUrl("https://asilvainnovations.github.io/website/about-us.html")} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a 
                  href={cleanUrl("https://asilvainnovations.github.io/website/solutions.html")} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Our Solutions
                </a>
              </li>
              <li>
                <a 
                  href={cleanUrl("https://asilvainnovations.github.io/website/resources.html")} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Resources
                </a>
              </li>
              <li>
                <a 
                  href={cleanUrl("https://asilvainnovations.github.io/website/pricing.html/")} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Pricing Plans
                </a>
              </li>
              <li>
                <a 
                  href={cleanUrl("#contact")} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a 
                  href={cleanUrl("https://asilvainnovations.github.io/website/partnerships.html")} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Partnerships
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {currentYear} ASilva Innovations. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-6 text-sm">
            <a 
              href={cleanUrl("https://asilvainnovations.github.io/website/privacy-policy.html")} 
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-white transition-colors"
            >
              Privacy Policy
            </a>
            <a 
              href={cleanUrl("https://asilvainnovations.github.io/website/terms.html")} 
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-white transition-colors"
            >
              Terms of Service
            </a>
            <a 
              href={cleanUrl("https://asilvainnovations.github.io/website/cookie-policy.html")} 
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-white transition-colors"
            >
              Cookie Policy
            </a>
            <a 
              href={cleanUrl("https://asilvainnovations.github.io/website/accessibility-policy.html")} 
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-white transition-colors"
            >
              Accessibility Policy
            </a>
            <a 
              href={cleanUrl("https://asilvainnovations.github.io/website/ai-ethics.html")} 
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-white transition-colors"
            >
              AI Ethics Framework
            </a>
            <a 
              href={cleanUrl("https://asilvainnovations.com/site-map.xml")} 
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-white transition-colors"
            >
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- Main App Component ---
const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('ddrive');
  const [isLoading, setIsLoading] = useState(true);
  const logoUrl = OFFICIAL_LOGO_URL.trim();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    const timer = setTimeout(() => setIsLoading(false), 1000);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, []);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isMenuOpen]);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  const services: Service[] = [
    {
      id: 'ddrive',
      title: 'DDRiVE-M',
      description: 'Flagship Enterprise Risk Management system delivering real-time vulnerability mapping, compliance tracking, and predictive analytics for LGUs and NGOs.',
      features: [
        'Multi-Hazard Detection and Multi-Modal Risk Assessment Tools',
        'ISO 31000-Compliant Risk Management System with AI Services',
        'UNDRR Resilience Scorecard Assessment Integration',
        'Customizable AI-Plan Generators and Dashboards'
      ],
      link: 'https://asilvainnovations.github.io/ddrive-m/',
      gradient: 'from-blue-600 to-cyan-600',
      imageUrl: DDRIVE_IMAGE_URL,
      imageAlt: 'DDRiVE-M Platform Dashboard Interface'
    },
    {
      id: 'stratplanner',
      title: 'Strat Planner Pro',
      description: 'AI-powered strategic planning suite that transforms complex data into actionable roadmaps with automated analysis and performance tracking.',
      features: [
        'Systems-Driven Context Analysis',
        'AI-Supported Strategic Options Generation',
        'Structured Strategy Mapping with Balanced Scorecard',
        'Automated and Real-Time Updating of Monitoring, Evaluation, and Learning Dashboard'
      ],
      link: 'https://asilvainnovations.github.io/strat-planner-pwa/public/index.html',
      gradient: 'from-amber-600 to-orange-600',
      imageUrl: STRAT_PLANNER_IMAGE_URL,
      imageAlt: 'Strategic Planner Pro Interface'
    },
    {
      id: 'rtl',
      title: 'Real-Time Leadership',
      description: 'Systems-based emergency and risk-reduction leadership framework with practical tools to navigate high-risk scenarios and projects.',
      features: [
        'Tools on Mastery of Presence',
        'Options Generations Toolkit',
        'Validating Choices ',
        'Cross-Agency Collaboration'
      ],
      link: 'https://asilvainnovations.github.io/website/rtl.html',
      gradient: 'from-emerald-600 to-teal-600',
      imageUrl: RTL_IMAGE_URL,
      imageAlt: 'Real-Time Leadership Banner'
    },
    {
      id: 'ai-solutions',
      title: 'AI & Automation Suite',
      description: 'Specialized AI solutions for public sector challenges including flood prediction, damage assessment, and intelligent resource routing.',
      features: [
        'SPARC - Smart Predictive AI Resilience Calculator',
        'AI Chatbots - Context-aware assistants',
        'Customized DRRM Integration - Disaster risk reduction',
        'Custom AI-Powered Online Courses on DRR-CCA, and Real-Time Leadership'
      ],
      link: 'https://asilvainnovations.github.io/website/ai-solutions.html',
      gradient: 'from-violet-600 to-purple-600',
      imageUrl: AI_SOLUTIONS_IMAGE_URL,
      imageAlt: 'AI Solutions Platform'
    }
  ];

  const personas: Persona[] = [
    {
      target: "Local Government Units",
      desc: "End-to-end digital transformation for disaster resilience, compliance management, and community protection. Deployable in 30 days.",
      icon: '🏛️',
      stats: "12+ Philippine LGUs",
      color: 'blue'
    },
    {
      target: "NGOs & Development Agencies",
      desc: "Maximize field impact with predictive analytics and resource optimization tools for humanitarian operations.",
      icon: '🤝',
      stats: "37% faster deployment",
      color: 'rose'
    },
    {
      target: "SMEs & Social Enterprises",
      desc: "Enterprise-grade risk intelligence at accessible pricing. Protect operations and demonstrate resilience.",
      icon: '💼',
      stats: "ROI in 6 months",
      color: 'amber'
    }
  ];

  const keyFeatures = [
    {
      icon: '🎯',
      title: 'Rapid Deployment',
      description: 'Get up and running in under 30 days with our proven implementation methodology',
      benefits: ['Minimal infrastructure required', 'Comprehensive training included', 'Dedicated onboarding support']
    },
    {
      icon: '📊',
      title: 'Real-Time Intelligence',
      description: 'Make data-driven decisions with live vulnerability mapping and predictive analytics',
      benefits: ['24/7 monitoring capabilities', 'Automated alerts and notifications', 'Historical data analysis']
    },
    {
      icon: '🔒',
      title: 'Compliance Ready',
      description: 'Built-in compliance with Philippine DRRM Act (RA 10121) and ISO 31000 standards',
      benefits: ['Automated reporting', 'Audit trail functionality', 'Regular compliance updates']
    },
    {
      icon: '💡',
      title: 'Continuous Innovation',
      description: 'Regular updates with the latest AI models and disaster response best practices',
      benefits: ['Quarterly feature releases', 'Community-driven improvements', 'Free platform upgrades']
    }
  ];

  // Loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full mx-auto flex items-center justify-center animate-pulse shadow-2xl shadow-blue-500/50 border-4 border-white/20 p-2">
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center p-1">
              <img
                src={logoUrl}
                alt="ASilva Innovations"
                className="w-full h-full object-contain"
                loading="eager"
              />
            </div>
          </div>
          <div className="flex gap-2 justify-center">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <HelmetProvider>
      <Helmet>
        <title>ASilva Innovations | Real-Time, AI-Powered and Analytics for Resilience Solutions</title>
        <meta name="description" content="Enterprise-grade risk management platforms for Local Government Units, NGOs, and SMEs. DDRiVE-M delivers real-time vulnerability mapping, predictive analytics, and compliance tracking." />
        <meta name="keywords" content="disaster risk reduction, LGU software, NGO technology, resilience platform, AI for social impact, Philippine tech" />
        <meta property="og:title" content="ASilva Innovations: Building Resilient Communities Through Technology" />
        <meta property="og:description" content="Flagship DDRiVE-M platform empowers LGUs and NGOs with predictive analytics and real-time risk intelligence." />
        <meta property="og:type" content="website" />
        <meta name="@asilvainnovations" content="summary_large_image" />
        <link rel="canonical" href="https://asilvainnovations.com" />
      </Helmet>

      {/* Skip Navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only fixed top-4 left-4 bg-blue-600 text-white px-6 py-3 rounded-lg z-[100] focus:ring-2 focus:ring-blue-400 font-bold"
      >
        Skip to main content
      </a>

      <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-blue-500/30">
        
        {/* NAVIGATION */}
        <nav
          className={`fixed w-full z-50 transition-all duration-300 ${
            scrolled
              ? 'bg-[#020617]/95 backdrop-blur-md py-3 border-b border-blue-900/30 shadow-lg shadow-black/10'
              : 'bg-transparent py-6'
          }`}
          aria-label="Main navigation"
        >
          <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
            <a
              href="#hero"
              className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-lg p-1 -ml-1"
              aria-label="ASilva Innovations homepage"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center p-1.5 shadow-lg shadow-blue-500/40 group-hover:scale-110 transition-transform duration-300 border-3 border-white">
                <div className="w-full h-full bg-white rounded-full flex items-center justify-center p-1.5">
                  <img
                    src={OFFICIAL_LOGO_URL}
                    alt="ASilva Innovations logo"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      if (target.parentElement) {
                        target.parentElement.innerHTML = '<div class="text-blue-600 font-bold text-xl">A</div>';
                      }
                    }}
                    loading="eager"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-lg md:text-xl font-bold tracking-tight leading-none group-hover:text-blue-300 transition-colors">
                  ASilva <span className="text-blue-400">Innovations</span>
                </span>
                <span className="text-[9px] text-slate-400 font-medium tracking-[0.25em] uppercase hidden md:block">
                  Building Resilient Futures
                </span>
              </div>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {['Services', 'Impact', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-sm font-medium text-slate-300 hover:text-blue-300 transition-all duration-300 py-2 px-1 border-b-2 border-transparent hover:border-blue-400 relative group"
                >
                  {item}
                  <span className="absolute inset-x-0 -bottom-px h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </a>
              ))}
              <a
                href="https://blog-leadership-analytics.deploypad.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-slate-300 hover:text-blue-300 transition-colors py-2 px-1 flex items-center gap-1"
              >
                Blog
                <span className="text-xs" aria-hidden="true">↗</span>
              </a>
              <a
                href="https://asilvainnovations.github.io/ddrive-m/"
                className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white px-6 py-2.5 rounded-full font-bold transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <span>Get Started</span>
                <span aria-hidden="true" className="text-lg">→</span>
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-slate-100 p-2 hover:bg-white/10 rounded-lg transition-colors focus:ring-2 focus:ring-blue-400"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </nav>

        {/* MOBILE MENU */}
        {isMenuOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] animate-fadeIn"
              onClick={() => setIsMenuOpen(false)}
              aria-hidden="true"
            ></div>
            <div
              id="mobile-menu"
              className="fixed inset-y-0 right-0 w-full max-w-sm bg-[#020617] z-[70] flex flex-col p-8 shadow-2xl animate-slideInRight"
              role="dialog"
              aria-modal="true"
              aria-labelledby="mobile-menu-title"
            >
              <div className="flex justify-between items-center pb-6 border-b border-white/10">
                <h2 id="mobile-menu-title" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
                  Menu
                </h2>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  aria-label="Close menu"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex items-center gap-3 py-6 border-b border-white/10">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center p-1.5 border-3 border-white shadow-lg shadow-blue-500/30">
                  <div className="w-full h-full bg-white rounded-full flex items-center justify-center p-1.5">
                    <img
                      src={OFFICIAL_LOGO_URL}
                      alt="ASilva Innovations logo"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        if (target.parentElement) {
                          target.parentElement.innerHTML = '<div class="text-blue-600 font-bold text-xl">A</div>';
                        }
                      }}
                      loading="lazy"
                    />
                  </div>
                </div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
                  ASilva Innovations
                </span>
              </div>

              <nav className="flex flex-col space-y-6 text-xl font-bold mt-8">
                {['Services', 'Impact', 'Contact'].map((item, index) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    onClick={() => setIsMenuOpen(false)}
                    className="py-3 border-b border-white/10 hover:text-blue-400 hover:translate-x-2 transition-all duration-300 focus:outline-none focus:text-blue-300"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {item}
                  </a>
                ))}
                <a
                  href="https://blog-leadership-analytics.deploypad.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsMenuOpen(false)}
                  className="py-3 border-b border-white/10 hover:text-blue-400 hover:translate-x-2 transition-all duration-300 flex items-center justify-between"
                >
                  Blog
                  <span className="text-base" aria-hidden="true">↗</span>
                </a>
              </nav>

              <a
                href=" https://asilvainnovations.github.io/ddrive-m/"
                onClick={() => setIsMenuOpen(false)}
                className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-4 rounded-xl text-center font-bold mt-8 shadow-lg hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Get Started Today
              </a>

              <div className="mt-auto pt-8 border-t border-white/10 text-center text-sm text-slate-500 space-y-1">
                <p>Building resilient communities</p>
                <p>© {new Date().getFullYear()} ASilva Innovations</p>
              </div>
            </div>
          </>
        )}

        {/* HERO SECTION */}
        <header
          id="main-content"
          className="relative pt-32 md:pt-48 pb-28 px-6 overflow-hidden min-h-[85vh] flex items-center"
          tabIndex={-1}
        >
          <div className="absolute inset-0 z-0">
            <img
              src={HERO_BG_IMAGE_URL}
              alt="Hero background"
              className="w-full h-full object-cover"
              loading="eager"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#020617]/95 via-[#020617]/85 to-[#020617]/90"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent"></div>
          </div>

          <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl animate-float-delayed"></div>
          </div>

          <div className="max-w-7xl mx-auto relative z-10 w-full">
            <div className="max-w-4xl mx-auto text-center space-y-8 animate-fadeInUp">
              <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-300 text-sm font-bold uppercase tracking-wide hover:scale-105 transition-transform duration-300 backdrop-blur-sm">
                <div className="text-xl animate-bounce" aria-hidden="true">🏆</div>
                <span>Trusted by 15+ LGUs Across Southeast Asia</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight">
                <span className="block text-white drop-shadow-lg">Technology That</span>
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-300 py-2 animate-gradient drop-shadow-2xl">
                  Builds Unbreakable Communities
                </span>
              </h1>

              <p className="text-lg md:text-xl text-slate-200 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
                Enterprise-grade risk intelligence platforms purpose-built for Local Government Units, NGOs, and social enterprises operating in high-risk environments.
                <span className="text-blue-300 font-semibold"> Transform uncertainty into strategic advantage.</span>
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center">
                <a
                  href="#contact"
                  className="group bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-xl shadow-blue-600/40 hover:shadow-blue-500/60 hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
                >
                  <span>Schedule a Demo</span>
                  <span className="text-xl group-hover:translate-x-1 transition-transform duration-300" aria-hidden="true">→</span>
                </a>
                <a
                  href="https://asilvainnovations.github.io/website/solutions.html"
                  className="bg-slate-900/90 hover:bg-slate-800/90 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 border border-white/20 backdrop-blur-sm hover:border-blue-500/50 text-center hover:scale-105 active:scale-95"
                >
                  View All Solutions
                </a>
              </div>

              <div className="flex flex-wrap gap-4 pt-4 text-sm justify-center">
                <div className="flex items-center gap-2 text-emerald-400 font-medium animate-fadeIn bg-emerald-950/30 px-4 py-2 rounded-full border border-emerald-500/30 backdrop-blur-sm">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                  <span>Aligned with Philippine Government Frameworks</span>
                </div>
                <div className="flex items-center gap-2 text-amber-300 font-medium animate-fadeIn bg-amber-950/30 px-4 py-2 rounded-full border border-amber-500/30 backdrop-blur-sm" style={{ animationDelay: '200ms' }}>
                  <div className="w-2 h-2 rounded-full bg-amber-300 animate-pulse"></div>
                  <span>ISO 31000 Compliant</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* STATS SECTION */}
        <StatsSection />

        {/* SERVICES SECTION */}
        <section id="services" className="py-24 px-6 bg-gradient-to-b from-[#020617] to-slate-900 relative" aria-labelledby="services-heading">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20 space-y-6 animate-fadeInUp">
              <h2
                id="services-heading"
                className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-300"
              >
                Purpose-Built Solutions
              </h2>
              <div className="h-1.5 w-32 bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 mx-auto rounded-full animate-pulse"></div>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto font-medium leading-relaxed">
                Enterprise-grade platforms designed specifically for resource-constrained environments.
                <span className="text-blue-300"> Deployable in weeks, not years.</span>
              </p>
            </div>

            <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-8 mb-16">
              {services.map((service, index) => (
                <div
                  key={service.id}
                  onMouseEnter={() => setActiveTab(service.id)}
                  onFocus={() => setActiveTab(service.id)}
                  className={`group p-8 rounded-2xl border transition-all duration-500 cursor-pointer flex flex-col h-full hover:-translate-y-2 ${
                    activeTab === service.id
                      ? 'bg-slate-900 border-blue-500/50 shadow-2xl shadow-blue-500/20 scale-105'
                      : 'bg-slate-900/50 border-white/10 hover:border-white/20'
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                  role="region"
                  aria-labelledby={`service-title-${service.id}`}
                  tabIndex={0}
                >
                  <div className="relative w-full aspect-[16/9] mb-6 rounded-xl overflow-hidden border border-white/10 bg-slate-800/50 group-hover:scale-105 transition-transform duration-500">
                    <img
                      src={service.imageUrl}
                      alt={service.imageAlt}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (target.parentElement) {
                          target.parentElement.style.background = `linear-gradient(to bottom right, var(--tw-gradient-stops))`;
                          target.parentElement.className += ` bg-gradient-to-br ${service.gradient}`;
                        }
                        target.style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="text-white text-sm font-bold flex items-center gap-2">
                        <span aria-hidden="true">{service.icon}</span>
                        <span>{service.title}</span>
                      </div>
                    </div>
                  </div>

                  <div className={`relative w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 ${
                    activeTab === service.id
                      ? `bg-gradient-to-br ${service.gradient} shadow-lg shadow-blue-500/40 scale-110`
                      : 'bg-slate-800/70 group-hover:scale-105'
                  }`}>
                    <span className="text-3xl" aria-hidden="true">{service.icon}</span>
                    {activeTab === service.id && (
                      <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} rounded-2xl blur-xl opacity-50 animate-pulse`}></div>
                    )}
                  </div>

                  <h3
                    id={`service-title-${service.id}`}
                    className="text-2xl font-bold mb-4 text-white group-hover:text-blue-300 transition-colors"
                  >
                    {service.title}
                  </h3>

                  <p className="text-slate-300 mb-6 leading-relaxed flex-grow">
                    {service.description}
                  </p>

                  <ul className="space-y-3 mb-8">
                    {service.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-slate-200">
                        <div className="mt-1 text-lg text-blue-400 group-hover:scale-125 transition-transform" aria-hidden="true">✓</div>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href={service.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mt-auto inline-flex items-center gap-2 font-bold transition-all duration-300 ${
                      activeTab === service.id
                        ? 'text-blue-300 gap-3'
                        : 'text-slate-400 hover:text-white'
                    }`}
                    aria-label={`Learn more about ${service.title}`}
                  >
                    <span>Explore Solution</span>
                    <span className="text-xl transition-transform duration-300 group-hover:translate-x-2" aria-hidden="true">→</span>
                  </a>
                </div>
              ))}
            </div>

            {/* Key Features Grid */}
            <div className="mt-24">
              <h3 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
                Why Organizations Choose Us
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {keyFeatures.map((feature, index) => (
                  <FeatureHighlight key={index} feature={feature} index={index} />
                ))}
              </div>
            </div>

            <div className="mt-16 text-center animate-fadeInUp">
              <a
                href="https://asilvainnovations.github.io/website/solutions.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-300 font-bold hover:text-blue-200 transition-all duration-300 text-lg group hover:scale-105"
              >
                <span>See Full Solutions Portfolio</span>
                <span className="text-xl group-hover:translate-x-1 transition-transform" aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </section>

        {/* IMPACT SECTION */}
        <section id="impact" className="py-24 px-6 bg-gradient-to-b from-slate-900 via-[#030a23] to-slate-900" aria-labelledby="impact-heading">
          <div className="max-w-7xl mx-auto">
            <div className="bg-gradient-to-br from-blue-900/70 to-indigo-900/80 rounded-3xl p-8 md:p-12 lg:p-16 overflow-hidden relative shadow-2xl border border-white/10 hover:border-blue-500/30 transition-all duration-500">
              <div className="absolute top-0 right-0 w-1/2 h-full opacity-5" aria-hidden="true">
                <div className="w-full h-full" style={{
                  backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                  backgroundSize: '20px 20px'
                }}></div>
              </div>

              <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-10 animate-fadeInLeft">
                  <div>
                    <h2
                      id="impact-heading"
                      className="text-4xl md:text-5xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-cyan-200 to-blue-200"
                    >
                      Real Impact in Vulnerable Communities
                    </h2>
                    <p className="text-xl text-slate-200 mt-6 max-w-2xl leading-relaxed">
                      We measure success by <span className="text-blue-300 font-bold">lives protected</span>,
                      <span className="text-emerald-300 font-bold"> resources optimized</span>, and
                      <span className="text-amber-300 font-bold"> communities empowered</span>—not just software deployed.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {personas.map((p, i) => (
                      <div
                        key={i}
                        className="p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md hover:border-blue-500/40 hover:bg-white/10 transition-all duration-300 hover:scale-105 group"
                        style={{ animationDelay: `${i * 150}ms` }}
                      >
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${p.color}-600 to-${p.color}-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                          <span className="text-2xl" aria-hidden="true">{p.icon}</span>
                        </div>
                        <h3 className="font-bold text-xl mb-2 text-white group-hover:text-blue-300 transition-colors">
                          {p.target}
                        </h3>
                        <p className="text-slate-300 mb-3 leading-relaxed text-sm">
                          {p.desc}
                        </p>
                        <div className={`text-sm font-bold text-${p.color}-300 flex items-center gap-2`}>
                          <div className="w-2 h-2 rounded-full bg-current animate-pulse"></div>
                          {p.stats}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Testimonials Column */}
                <div className="space-y-6 animate-fadeInRight">
                  <div className="bg-black/40 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-blue-500/30 transition-all duration-500 hover:scale-105 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                      <img
                        src={STRAT_PLANNER_IMAGE_URL}
                        alt="Strategic Planner Pro"
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="relative z-10">
                      <div className="flex justify-center gap-1 mb-6" aria-hidden="true">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className="text-2xl text-amber-400 animate-bounce"
                            style={{ animationDelay: `${i * 100}ms` }}
                          >
                            ★
                          </div>
                        ))}
                      </div>
                      <blockquote className="relative">
                        <div className="absolute -top-4 -left-2 text-6xl text-blue-500/20 font-serif" aria-hidden="true">"</div>
                        <p className="text-lg md:text-xl italic font-medium text-center text-blue-100 border-l-4 border-blue-500 pl-6 py-2 relative z-10">
                          ASilva Innovations' approach in updating our Risk-informed Comprehensive Development Plan has truly been a game-changer giving us a clear and practical framework that integrates disaster risk reduction into our local development priorities.
                        </p>
                        <div className="absolute -bottom-4 -right-2 text-6xl text-blue-500/20 font-serif rotate-180" aria-hidden="true">"</div>
                      </blockquote>
                      <div className="mt-8 flex items-center justify-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-2xl shadow-lg animate-pulse-slow">
                          👤
                        </div>
                        <div className="text-left">
                          <div className="font-bold text-lg text-white">Arnold Pica</div>
                          <div className="text-sm text-blue-200/80">Municipal Disaster Risk Reduction and Management Officer (MDRRMO)</div>
                          <div className="text-xs text-slate-400">Salcedo, Eastern Samar</div>
                        </div>
                      </div>
                      <footer className="mt-6 text-center text-sm text-slate-400 italic flex items-center justify-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        Verified client testimonial • December 2025
                      </footer>
                    </div>
                  </div>

                  <div className="bg-black/40 backdrop-blur-sm p-8 rounded-2xl border border-white/10 hover:border-emerald-500/30 transition-all duration-500 hover:scale-105 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                      <img
                        src={AI_SOLUTIONS_IMAGE_URL}
                        alt="AI Solutions"
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="relative z-10">
                      <div className="flex justify-center gap-1 mb-6" aria-hidden="true">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className="text-2xl text-amber-400 animate-bounce"
                            style={{ animationDelay: `${i * 100}ms` }}
                          >
                            ★
                          </div>
                        ))}
                      </div>
                      <blockquote className="relative">
                        <div className="absolute -top-4 -left-2 text-6xl text-emerald-500/20 font-serif" aria-hidden="true">"</div>
                        <p className="text-lg md:text-xl italic font-medium text-center text-blue-100 border-l-4 border-emerald-500 pl-6 py-2 relative z-10">
                          ASilva Innovations' customized Integrated Risk and Resilience Management (IRRM) has been transformative for Bangsamoro communities and civil society organizations.
                        </p>
                        <div className="absolute -bottom-4 -right-2 text-6xl text-emerald-500/20 font-serif rotate-180" aria-hidden="true">"</div>
                      </blockquote>
                      <div className="mt-8 flex items-center justify-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-2xl shadow-lg animate-pulse-slow">
                          👤
                        </div>
                        <div className="text-left">
                          <div className="font-bold text-lg text-white">Rhadzni Taalim</div>
                          <div className="text-sm text-emerald-200/80">Executive Director</div>
                          <div className="text-xs text-slate-400">Bangsamoro Development Agency (BDA), Cotabato City</div>
                        </div>
                      </div>
                      <footer className="mt-6 text-center text-sm text-slate-400 italic flex items-center justify-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        Verified client testimonial • January 2026
                      </footer>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section id="contact" className="py-24 px-6 bg-gradient-to-b from-slate-900 to-[#020617]" aria-labelledby="contact-heading">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16">
            <div className="space-y-10 animate-fadeInLeft">
              <div>
                <h2
                  id="contact-heading"
                  className="text-4xl md:text-5xl font-extrabold uppercase bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 leading-tight"
                >
                  Start Your Resilience Journey
                </h2>
                <p className="text-slate-300 mt-6 text-lg leading-relaxed max-w-2xl">
                  Join <span className="text-blue-300 font-bold">50+ forward-thinking organizations</span> across Southeast Asia who trust ASilva Innovations to protect their communities and optimize their operations.
                  <span className="text-emerald-300 font-semibold"> Let's build your custom solution.</span>
                </p>
              </div>

              <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-slate-900/50 hover:scale-105 transition-transform duration-500 group">
                <img
                  src={HERO_BG_IMAGE_URL}
                  alt="Real-Time Lea Platform"
                  className="w-full h-64 object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
                <div className="absolute bottom-6 left-6">
                  <div className="text-white">
                    <div className="text-blue-400 font-bold text-sm flex items-center gap-2">
                      <span aria-hidden="true">🧠</span>
                      <span>ASilva Innovations</span>
                    </div>
                    <div className="text-xl font-bold mt-1">Actionable Intelligence for Life-Saving Decisions</div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {[
                  { icon: '📅', title: 'Schedule a Consultation', desc: 'Free 60-minute strategy session with our resilience experts', color: 'blue' },
                  { icon: '💡', title: 'Custom Solution Design', desc: "Tailored implementation roadmap for your organization's unique challenges", color: 'amber' }
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-5 p-6 rounded-2xl border border-white/5 bg-slate-900/50 hover:border-blue-500/40 hover:bg-slate-900 transition-all duration-300 hover:scale-105 group"
                    style={{ animationDelay: `${i * 150}ms` }}
                  >
                    <div className={`w-12 h-12 rounded-2xl bg-${item.color}-600/20 flex items-center justify-center text-${item.color}-400 flex-shrink-0 mt-1 group-hover:scale-110 transition-transform duration-300`}>
                      <span className="text-2xl" aria-hidden="true">{item.icon}</span>
                    </div>
                    <div>
                      <div className="text-lg font-bold mb-1 text-white group-hover:text-blue-300 transition-colors">
                        {item.title}
                      </div>
                      <div className="text-slate-400 group-hover:text-slate-300 transition-colors">
                        {item.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-white/10 mt-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-600/20 text-emerald-400 flex items-center justify-center" aria-hidden="true">✓</div>
                  Why Partner With Us?
                </h3>
                <ul className="space-y-3 text-slate-300">
                  {[
                    'Philippine-based team with deep LGU/NGO experience',
                    '98% client retention rate since 2020',
                    'Compliance with Philippine DRRM Act (RA 10121)',
                    'Transparent pricing with no hidden fees'
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3 hover:text-white transition-colors group">
                      <span className="text-emerald-400 mt-1 group-hover:scale-125 transition-transform" aria-hidden="true">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-slate-900 border border-white/10 rounded-2xl p-8 shadow-2xl hover:border-blue-500/30 transition-all duration-500 animate-fadeInRight">
              <form
                className="space-y-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target as HTMLFormElement);
                  const data = Object.fromEntries(formData);
                  console.log('Form submitted:', data);
                  alert('Thank you for your inquiry! Our team will contact you within 24 business hours.');
                  (e.target as HTMLFormElement).reset();
                }}
                aria-label="Contact form"
              >
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    Full Name
                    <span className="text-red-400" aria-label="required">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    aria-required="true"
                    className="w-full bg-slate-800/70 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-white font-medium placeholder-slate-500 hover:border-white/20"
                    placeholder="Maria Santos"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    Email Address
                    <span className="text-red-400" aria-label="required">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    aria-required="true"
                    className="w-full bg-slate-800/70 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-white font-medium placeholder-slate-500 hover:border-white/20"
                    placeholder="maria.santos@lgu-salcedo.gov.ph"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="organization" className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    Organization
                    <span className="text-red-400" aria-label="required">*</span>
                  </label>
                  <input
                    id="organization"
                    name="organization"
                    type="text"
                    required
                    aria-required="true"
                    className="w-full bg-slate-800/70 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-white font-medium placeholder-slate-500 hover:border-white/20"
                    placeholder="LGU Salcedo, Eastern Samar"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="inquiry" className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    Inquiry Type
                    <span className="text-red-400" aria-label="required">*</span>
                  </label>
                  <select
                    id="inquiry"
                    name="inquiry"
                    required
                    aria-required="true"
                    className="w-full bg-slate-800/70 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-white font-medium appearance-none cursor-pointer hover:border-white/20"
                  >
                    <option value="">Select an option</option>
                    <option value="ddrive">DDRiVE-M Implementation</option>
                    <option value="stratplanner">Strategic Planner Pro Integration</option>
                    <option value="rtl">Real-Time Leadership Deployment</option>
                    <option value="custom">Custom AI Solution</option>
                    <option value="partnership">Partnership Inquiry</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-bold uppercase tracking-wider text-slate-400">
                    Message (Optional)
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="w-full bg-slate-800/70 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-white font-medium placeholder-slate-500 resize-none hover:border-white/20"
                    placeholder="Tell us about your organization's needs..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-bold uppercase tracking-wider py-5 rounded-xl transition-all duration-300 shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 hover:scale-105 active:scale-95 mt-2 flex items-center justify-center gap-3 group"
                  aria-label="Submit contact form"
                >
                  <span>Request Consultation</span>
                  <span className="text-xl group-hover:translate-x-1 transition-transform" aria-hidden="true">→</span>
                </button>

                <p className="text-xs text-slate-500 text-center mt-2 flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  We respect your privacy. Your information is secure and will only be used to contact you.
                </p>
              </form>
            </div>
          </div>
        </section>

        {/* FOOTER - Using Imported Enhanced Component */}
        <Footer />

      </div>

      {/* Custom CSS Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-fadeIn { animation: fadeIn 1s ease-out; }
        .animate-fadeInUp { animation: fadeInUp 1s ease-out; }
        .animate-fadeInLeft { animation: fadeInLeft 1s ease-out; }
        .animate-fadeInRight { animation: fadeInRight 1s ease-out; }
        .animate-slideInRight { animation: slideInRight 0.3s ease-out; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float 6s ease-in-out 3s infinite; }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        .animate-pulse-slow { animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        
        /* Hide Bolt badge */
        [class*="bolt"],
        [class*="Bolt"],
        [id*="bolt"],
        [id*="Bolt"],
        a[href*="bolt.new"],
        a[href*="bolt.host"],
        div[style*="position: fixed"][style*="bottom"],
        div[style*="position: fixed"][style*="right"] {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
        }
        
        /* Cover bottom-right corner */
        body::after {
          content: '';
          position: fixed;
          bottom: 0;
          right: 0;
          width: 200px;
          height: 100px;
          background: #020617;
          pointer-events: none;
          z-index: 9999;
        }
      `}</style>
    </HelmetProvider>
  );
};

export default App;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import "../styles/landing.css";

// Icons
import {
  ArrowRightIcon,
  BanknotesIcon,
  UserGroupIcon,
  CreditCardIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  RocketLaunchIcon,
  CheckCircleIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  GlobeAltIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  ClockIcon,
  SparklesIcon,
  ChevronRightIcon
} from "@heroicons/react/24/outline";

const AnimatedCounter = ({ target, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView({ triggerOnce: true });

  useEffect(() => {
    if (inView) {
      let start = 0;
      const increment = target / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          setCount(target);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [inView, target, duration]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
};

const Home = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const features = [
    { icon: BanknotesIcon, title: "Multi-Tenant Banking", description: "Support multiple financial institutions with complete data isolation and independent operations.", color: "from-blue-500 to-cyan-500" },
    { icon: UserGroupIcon, title: "Customer Management", description: "Full KYC verification, address tracking, and complete customer lifecycle management.", color: "from-green-500 to-emerald-500" },
    { icon: CreditCardIcon, title: "Account Management", description: "Multiple account types with real-time balance tracking and interest calculations.", color: "from-purple-500 to-pink-500" },
    { icon: ChartBarIcon, title: "Loan Processing", description: "Complete loan lifecycle from application to approval, disbursement, and repayment.", color: "from-orange-500 to-red-500" },
    { icon: ShieldCheckIcon, title: "Secure Transactions", description: "PIN-authenticated deposits, withdrawals, transfers with reversal capabilities.", color: "from-indigo-500 to-purple-500" },
    { icon: RocketLaunchIcon, title: "Payment Gateways", description: "Integrated Paystack and Flutterwave payments for seamless subscription processing.", color: "from-yellow-500 to-orange-500" }
  ];

  const stats = [
    { icon: GlobeAltIcon, number: 50, suffix: "+", label: "Active Tenants", color: "text-blue-400" },
    { icon: UserGroupIcon, number: 100, suffix: "K+", label: "Customers Served", color: "text-green-400" },
    { icon: CurrencyDollarIcon, number: 50, suffix: "M+", label: "Transactions Processed", color: "text-yellow-400" },
    { icon: ClockIcon, number: 99.9, suffix: "%", label: "Uptime Guarantee", color: "text-purple-400" }
  ];

  const testimonials = [
    { name: "Mrs. Adesuwa Okonkwo", position: "CEO, Trust Microfinance Bank", quote: "This platform transformed our operations. Loan processing time reduced by 70%!", rating: 5, image: "AO" },
    { name: "Mr. Oluwaseun Adebayo", position: "CTO, Premier Savings & Loans", quote: "The multi-tenant architecture allows us to manage multiple branches seamlessly.", rating: 5, image: "OA" },
    { name: "Dr. Ngozi Eze", position: "Operations Director, United Microfinance", quote: "Customer onboarding and KYC verification has never been this easy.", rating: 5, image: "NE" }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="landing-page min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white overflow-x-hidden w-full">
      
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-500"></div>
      </div>

      {/* Navigation - Stretched */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-gray-900/95 backdrop-blur-md shadow-2xl' : 'bg-transparent'}`}>
        <div className="w-full px-6 lg:px-12">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => navigate('/')}>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition">
                <span className="text-2xl">🏦</span>
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">SaaS MF</span>
                <p className="text-xs text-gray-400">Micro Finance System</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white transition relative group">Features</a>
              <a href="#testimonials" className="text-gray-300 hover:text-white transition relative group">Testimonials</a>
              <a href="#contact" className="text-gray-300 hover:text-white transition relative group">Contact</a>
            </div>
            
            <div className="flex items-center space-x-4">
              <button onClick={() => navigate('/login')} className="px-6 py-2 btn-primary rounded-lg font-semibold text-white transition flex items-center space-x-2">
                <span>Login</span>
                <ArrowRightIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Stretched */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 w-full">
        <div className="w-full px-6 lg:px-20 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full border border-blue-500/30 mb-8">
              <SparklesIcon className="h-5 w-5 text-blue-400 mr-2" />
              <span className="text-blue-400 text-sm font-medium">Complete Banking Solution</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
              Modern Banking for
              <span className="gradient-text block mt-2"> Microfinance Institutions</span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed">
              A comprehensive multi-tenant banking platform with account management, 
              loan processing, transaction handling, and integrated payment gateways.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <motion.button onClick={() => navigate('/login')} className="px-8 py-4 btn-primary rounded-xl font-semibold text-white transition flex items-center justify-center text-lg group" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                Get Started
                <ChevronRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition" />
              </motion.button>
              <motion.a href="#features" className="px-8 py-4 btn-outline rounded-xl font-semibold text-white transition flex items-center justify-center text-lg" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                Learn More
              </motion.a>
            </div>
          </motion.div>
          
          {/* Stats Section - Stretched Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-24 w-full">
            {stats.map((stat, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="stat-card rounded-2xl p-8 text-center">
                <stat.icon className={`h-12 w-12 ${stat.color} mx-auto mb-4`} />
                <div className="text-4xl md:text-5xl font-bold text-white">
                  <AnimatedCounter target={stat.number} />
                  {stat.suffix}
                </div>
                <p className="text-gray-400 mt-2 text-lg">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Stretched */}
      <section id="features" className="relative py-24 w-full px-6 lg:px-20">
        <div className="w-full">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto">Everything you need to run a modern microfinance institution</p>
          </motion.div>
          
          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <motion.div key={index} variants={itemVariants} className="feature-card rounded-2xl p-10">
                <div className={`feature-icon w-20 h-20 rounded-xl flex items-center justify-center mb-6 bg-gradient-to-r ${feature.color}`}>
                  <feature.icon className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-3xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-300 text-lg leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer - Stretched */}
      <footer className="relative border-t border-white/10 py-16 w-full px-6 lg:px-20">
        <div className="w-full grid md:grid-cols-4 gap-12">
          {/* Footer content remains same but parent is now wide */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center"><span className="text-xl">🏦</span></div>
              <h3 className="font-bold text-lg">SaaS Micro Finance</h3>
            </div>
            <p className="text-gray-400">Empowering microfinance institutions with modern technology.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-xl">Quick Links</h4>
            <ul className="space-y-3 text-gray-400">
              <li><a href="#features" className="hover:text-white">Features</a></li>
              <li><a href="#testimonials" className="hover:text-white">Testimonials</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-xl">Integrations</h4>
            <ul className="space-y-3 text-gray-400">
              <li>Paystack</li>
              <li>Flutterwave</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-xl">Contact</h4>
            <p className="text-gray-400">Lagos, Nigeria</p>
            <p className="text-gray-400">info@saasmf.com</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
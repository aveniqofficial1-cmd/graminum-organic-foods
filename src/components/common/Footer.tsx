import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  QrCode,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useStoreSettings } from '../../context/StoreSettingsContext';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { showToast } = useToast();
  const { settings } = useStoreSettings();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@') || !email.includes('.')) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }
    setIsSubscribed(true);
    showToast('Thank you for subscribing to Graminum Natural Living newsletter!', 'success');
    setEmail('');
  };

  const cleanPhone = settings.whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <footer className="bg-[#06451F] text-white pt-16 pb-8 relative overflow-hidden border-t-4 border-[#8CCB55]">
      {/* Botanical Background Pattern Overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#8CCB55_1px,transparent_1px)] [background-size:24px_24px]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Trust Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-12 border-b border-emerald-800/60 mb-12">
          <div className="flex items-center gap-3 p-3 bg-emerald-900/40 rounded-2xl border border-emerald-700/40">
            <span className="text-2xl">🌱</span>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">100% Pure</h4>
              <p className="text-[11px] text-emerald-200">Zero synthetic chemicals</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-emerald-900/40 rounded-2xl border border-emerald-700/40">
            <span className="text-2xl">🌾</span>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Direct Farm Sourced</h4>
              <p className="text-[11px] text-emerald-200">Supporting native farmers</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-emerald-900/40 rounded-2xl border border-emerald-700/40">
            <span className="text-2xl">🛡️</span>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Ancient Vedic Ways</h4>
              <p className="text-[11px] text-emerald-200">Stone ground & wood pressed</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-emerald-900/40 rounded-2xl border border-emerald-700/40">
            <span className="text-2xl">🚚</span>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Pan-India Delivery</h4>
              <p className="text-[11px] text-emerald-200">Express 24-48 hr dispatch</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links & Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 pb-12 border-b border-emerald-800/60">
          {/* Column 1: Brand & Story (Spans 2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/assets/graminum-logo.png"
                alt="Graminum Logo"
                className="h-12 w-auto bg-white/95 p-1 rounded-xl shadow-md"
              />
              <div>
                <span className="text-2xl font-black text-white font-serif-title tracking-tight block">
                  GRAMINUM
                </span>
                <span className="text-xs text-[#8CCB55] font-telugu font-bold block -mt-1">
                  గ్రామీణం ఆర్గానిక్ ఫుడ్స్
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed max-w-sm">
              Connecting nature-conscious families directly with ethical Indian organic farmers.
              Committed to unadulterated native grains, Ayurvedic herbal wellness, cold-pressed oils,
              and wholesome multigrain nutrition for generations to come.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                href={`https://wa.me/${cleanPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#4D963C] hover:bg-[#8CCB55] hover:text-[#06451F] text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-md"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
              <Link
                to="/track-order"
                className="inline-flex items-center gap-1.5 bg-emerald-900/60 hover:bg-emerald-800 text-emerald-100 text-xs font-semibold px-3 py-2 rounded-xl border border-emerald-700/50 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#8CCB55]" />
                <span>Track Order</span>
              </Link>
            </div>
          </div>

          {/* Column 2: Organic Categories */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#8CCB55]"></span>
              Shop Categories
            </h3>
            <ul className="space-y-2.5 text-xs text-emerald-100/80">
              <li>
                <Link
                  to="/shop?category=Grains+%26+Cereals"
                  className="hover:text-[#8CCB55] transition-colors flex items-center gap-1.5"
                >
                  <span>🌾 Grains & Cereals</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?category=Herbal+Products"
                  className="hover:text-[#8CCB55] transition-colors flex items-center gap-1.5"
                >
                  <span>🌿 Herbal Products</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?category=Health+Mixes"
                  className="hover:text-[#8CCB55] transition-colors flex items-center gap-1.5"
                >
                  <span>🥣 Health Mixes</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?category=Natural+Foods"
                  className="hover:text-[#8CCB55] transition-colors flex items-center gap-1.5"
                >
                  <span>🍯 Natural Foods</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/shop?filter=bestseller"
                  className="hover:text-[#8CCB55] transition-colors text-amber-300 font-semibold"
                >
                  ⭐ Bestselling Items
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Links & Support */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#8CCB55]"></span>
              Customer Care
            </h3>
            <ul className="space-y-2.5 text-xs text-emerald-100/80">
              <li>
                <Link to="/about" className="hover:text-[#8CCB55] transition-colors">
                  Our Farmer Story
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-[#8CCB55] transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#8CCB55] transition-colors">
                  Contact & Store Visit
                </Link>
              </li>
              <li>
                <Link to="/account" className="hover:text-[#8CCB55] transition-colors">
                  My Account / Login
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-[#8CCB55] transition-colors">
                  View Cart
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/login"
                  className="text-emerald-300/80 hover:text-white font-medium"
                >
                  Admin Control Panel
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter & Contact */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#8CCB55]"></span>
              Natural Living Updates
            </h3>
            <p className="text-xs text-emerald-100/80 leading-relaxed">
              Subscribe for authentic seasonal harvest announcements and healthy traditional recipes.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-emerald-950/70 text-white placeholder-emerald-400/60 text-xs px-3.5 py-2.5 rounded-xl border border-emerald-700/60 focus:outline-none focus:border-[#8CCB55]"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#8CCB55] hover:bg-[#4D963C] text-[#06451F] hover:text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <span>Join Graminum Circle</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="pt-2 text-xs text-emerald-200 space-y-1">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#8CCB55]" />
                <span>{settings.whatsappNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#8CCB55]" />
                <span>support@graminum.in</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Payment badges */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-200/60">
          <div>
            © {new Date().getFullYear()} Graminum (గ్రామీణం) Organic Foods. All rights reserved.
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-center text-[11px] text-emerald-200/80">
            <span className="bg-emerald-900/60 px-2.5 py-1 rounded-md border border-emerald-800 font-bold text-white flex items-center gap-1">
              <QrCode className="w-3 h-3 text-[#8CCB55]" />
              <span>UPI Scanner Only</span>
            </span>
            <span className="bg-emerald-900/60 px-2.5 py-1 rounded-md border border-emerald-800">
              GPay / PhonePe / Paytm / BHIM
            </span>
            <span className="bg-emerald-900/60 px-2.5 py-1 rounded-md border border-emerald-800 flex items-center gap-1">
              <MessageCircle className="w-3 h-3 text-[#25D366]" />
              <span>WhatsApp Auto-Fill Receipt</span>
            </span>
            <span className="bg-emerald-900/60 px-2.5 py-1 rounded-md border border-emerald-800">
              Direct Farmer Sourced
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

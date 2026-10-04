import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Heart,
  CheckCircle2,
  Star,
  Leaf,
  Award,
  Truck,
  RefreshCw,
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { TESTIMONIALS_DATA } from '../data/testimonials';
import { ProductCard } from '../components/common/ProductCard';
import { WaveDivider } from '../components/common/WaveDivider';
import { LeafDecoration } from '../components/common/LeafDecoration';

export const HomePage: React.FC = () => {
  const { products } = useProducts();
  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 8);
  const bestsellers = products.filter((p) => p.isBestseller).slice(0, 4);

  const categories = [
    {
      title: 'Personal Care',
      telugu: 'వ్యక్తిగత సంరక్షణ',
      image: '/assets/products/sunnipendi-bath-powder.jpeg',
      description: 'Reetha shampoo, Sunnipendi herbal bath powder, Rose water & Apamarga tooth powder.',
      itemCount: '5+ Products',
      link: '/shop?category=Personal+Care',
    },
    {
      title: 'Herbal Oils',
      telugu: 'మూలికా తైలాలు',
      image: '/assets/products/kalachakra-thailam.jpeg',
      description: 'Orthocare Plus, Kalachakra thailam, Neem, Kanuga, Mahua & cold-pressed oils.',
      itemCount: '11+ Formulations',
      link: '/shop?category=Herbal+Oils',
    },
    {
      title: 'Natural Foods',
      telugu: 'సహజ ఆహారాలు',
      image: '/assets/products/honey.jpeg',
      description: 'Pure raw honey, 14 grains multigrain cere mix, Bhavana Jeera & digestive chips.',
      itemCount: '6+ Superfoods',
      link: '/shop?category=Natural+Foods',
    },
    {
      title: 'Herbal Wellness',
      telugu: 'ఆరోగ్య సంరక్షణ',
      image: '/assets/products/vamu-water.jpeg',
      description: 'Vamu water (Ajwain water), Madiphal Rasayanam & Nannari Sugandha sharbat.',
      itemCount: '3+ Elixirs',
      link: '/shop?category=Herbal+Wellness',
    },
    {
      title: 'Pooja Essentials',
      telugu: 'పూజా ద్రవ్యాలు',
      image: '/assets/products/pooja-oil.jpeg',
      description: 'Pooja deepam oil, pure edible Pacha Karpooram & sacred Mahua lamp oil.',
      itemCount: '3+ Sacred Items',
      link: '/shop?category=Pooja+Essentials',
    },
    {
      title: 'Fragrances',
      telugu: 'సుగంధ ద్రవ్యాలు',
      image: '/assets/products/natural-perfumes.jpeg',
      description: '100% alcohol-free traditional herbal attars and pure botanical roll-on fragrances.',
      itemCount: 'Pure Natural Attar',
      link: '/shop?category=Fragrances',
    },
  ];

  return (
    <div className="w-full bg-[#FBF8EF]">
      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-b from-[#EFF7E9] via-[#F4F9EF] to-[#FBF8EF] pt-8 sm:pt-14 pb-16 sm:pb-24 overflow-hidden">
        {/* Subtle Decorative Botanical SVGs */}
        <LeafDecoration
          size={120}
          className="absolute -top-6 -left-6 text-[#8CCB55] rotate-45"
        />
        <LeafDecoration
          size={160}
          className="absolute top-1/2 -right-10 text-[#4D963C] -rotate-12"
          variant="branch"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Organic Badge */}
              <div className="inline-flex items-center gap-2 bg-white/90 border border-[#8CCB55] px-3.5 py-1.5 rounded-full shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#4D963C] animate-ping"></span>
                <span className="text-xs font-extrabold text-[#075B2A] uppercase tracking-wider">
                  100% Certified Organic & Traditional
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#075B2A] font-serif-title leading-[1.12] tracking-tight">
                Nature's Goodness for a{' '}
                <span className="text-[#4D963C] underline decoration-[#8CCB55] decoration-wavy decoration-2">
                  Healthier Life
                </span>
              </h1>

              {/* Supporting Text */}
              <p className="text-base sm:text-lg text-[#18251B]/80 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Authentic Herbal, Ayurvedic & Natural Products from Graminum Store in Kashibugga, Warangal.
                Formulated following traditional Vedic methods without chemical fertilizers, synthetic preservatives, or artificial additives.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/shop"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#075B2A] hover:bg-[#06451F] text-white text-sm sm:text-base font-bold px-7 py-3.5 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
                >
                  <span>Shop Pure Products</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/about"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-[#EFF7E9] text-[#075B2A] border-2 border-[#075B2A] text-sm sm:text-base font-bold px-6 py-3.5 rounded-2xl transition-all duration-200"
                >
                  <span>About Our Store</span>
                </Link>
              </div>

              {/* Trust Badges under Hero */}
              <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs text-[#667267] font-semibold flex-wrap">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#4D963C]" />
                  <span>Lab Tested Purity</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#4D963C]" />
                  <span>Wood-Ghani Extracted</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#4D963C]" />
                  <span>Stone-Ground Nutrition</span>
                </div>
              </div>
            </div>

            {/* Right Hero Product & Packaging Visual Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Organic Backdrop Blob */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#8CCB55]/30 to-[#4D963C]/20 rounded-[40px] transform rotate-3 scale-105 filter blur-xl"></div>

                {/* Hero Showcase Card */}
                <div className="relative bg-white rounded-3xl p-4 sm:p-5 border border-[#E1E9DC] shadow-2xl overflow-hidden">
                  <div className="relative rounded-2xl overflow-hidden aspect-4/3 bg-[#EFF7E9]">
                    <img
                      src="https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=1000&q=80"
                      alt="Organic Sprouted Multigrain & Traditional Grains"
                      className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute bottom-3 left-3 bg-[#075B2A]/90 backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-[#8CCB55]" />
                      <span>Pure Telangana Harvest</span>
                    </div>
                  </div>

                  {/* Highlight Floating Pill */}
                  <div className="mt-4 flex items-center justify-between gap-3 p-3 bg-[#EFF7E9] rounded-xl border border-[#8CCB55]/40">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-[#075B2A] text-white flex items-center justify-center font-bold text-sm">
                        🌾
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#18251B]">
                          Graminum Sprouted Cere Mix
                        </p>
                        <p className="text-[11px] text-[#4D963C]">18 Traditional Native Grains</p>
                      </div>
                    </div>
                    <Link
                      to="/product/graminum-sprouted-multigrain-cere-mix"
                      className="text-xs font-extrabold text-[#075B2A] hover:underline"
                    >
                      View →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Organic Wave Divider */}
        <WaveDivider position="bottom" fillColor="#FFFFFF" className="mt-12 sm:mt-16" />
      </section>

      {/* 2. FOUR TRUST INDICATORS */}
      <section className="bg-white py-10 sm:py-14 border-b border-[#E1E9DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#EFF7E9]/60 border border-[#E1E9DC] hover:border-[#8CCB55] transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#075B2A] text-white flex items-center justify-center shrink-0 shadow-md">
                <Leaf className="w-6 h-6 text-[#8CCB55]" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-[#18251B]">100% Natural</h3>
                <p className="text-xs text-[#667267] mt-0.5 leading-relaxed">
                  No synthetic pesticides, chemical fertilizers, or urea.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#EFF7E9]/60 border border-[#E1E9DC] hover:border-[#8CCB55] transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#075B2A] text-white flex items-center justify-center shrink-0 shadow-md">
                <RefreshCw className="w-6 h-6 text-[#8CCB55]" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-[#18251B]">
                  Traditional Process
                </h3>
                <p className="text-xs text-[#667267] mt-0.5 leading-relaxed">
                  Wood-pressed oils, stone ground flours & bilona ghee.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#EFF7E9]/60 border border-[#E1E9DC] hover:border-[#8CCB55] transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#075B2A] text-white flex items-center justify-center shrink-0 shadow-md">
                <ShieldCheck className="w-6 h-6 text-[#8CCB55]" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-[#18251B]">No Preservatives</h3>
                <p className="text-xs text-[#667267] mt-0.5 leading-relaxed">
                  Zero artificial colors, synthetic flavors, or chemical wax.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-[#EFF7E9]/60 border border-[#E1E9DC] hover:border-[#8CCB55] transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#075B2A] text-white flex items-center justify-center shrink-0 shadow-md">
                <Award className="w-6 h-6 text-[#8CCB55]" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-[#18251B]">Rich Nutrition</h3>
                <p className="text-xs text-[#667267] mt-0.5 leading-relaxed">
                  Sprouted bioavailability, intact bran, and essential minerals.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SHOP BY CATEGORY */}
      <section className="py-16 sm:py-20 bg-[#FBF8EF] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-extrabold text-[#4D963C] uppercase tracking-wider block mb-1">
              Natural Harvest Catalog
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#075B2A] font-serif-title">
              Shop by Category
            </h2>
            <p className="text-sm text-[#667267] mt-2">
              Explore pure wholesome categories crafted for your family's daily vitality and wellness.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, idx) => (
              <Link
                key={idx}
                to={cat.link}
                className="group relative bg-white rounded-3xl border border-[#E1E9DC] overflow-hidden shadow-card-hover flex flex-col justify-between"
              >
                <div className="relative aspect-4/3 overflow-hidden bg-[#EFF7E9]">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[11px] font-telugu font-semibold text-[#8CCB55] block">
                      {cat.telugu}
                    </span>
                    <h3 className="text-lg font-bold font-serif-title">{cat.title}</h3>
                  </div>
                </div>

                <div className="p-4 flex flex-col justify-between flex-1">
                  <p className="text-xs text-[#667267] leading-relaxed mb-3">
                    {cat.description}
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-[#E1E9DC] text-xs font-bold text-[#075B2A]">
                    <span>{cat.itemCount}</span>
                    <span className="group-hover:translate-x-1 transition-transform">Explore →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURED PRODUCTS GRID */}
      <section className="py-16 sm:py-20 bg-white border-y border-[#E1E9DC] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-extrabold text-[#4D963C] uppercase tracking-wider block mb-1">
                Handpicked Farm Fresh
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#075B2A] font-serif-title">
                Featured Organic Products
              </h2>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#075B2A] hover:text-[#4D963C] hover:underline"
            >
              <span>View All Products ({products.length})</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. GOODNESS FROM NATURE (SPLIT STORY SECTION) */}
      <section className="py-16 sm:py-24 bg-[#EFF7E9] relative overflow-hidden">
        <LeafDecoration
          size={200}
          className="absolute -bottom-10 -left-10 text-[#4D963C] rotate-45"
          variant="branch"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Agricultural Image Collage */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl overflow-hidden border-4 border-white shadow-2xl aspect-4/3 sm:aspect-16/10">
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1000&q=80"
                  alt="Authentic Indian Traditional Farmer at Farm"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#06451F]/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="text-xs font-telugu text-[#8CCB55] font-bold">
                    గ్రామీణం మూలికా మరియు సహజ ఉత్పత్తుల కేంద్రం
                  </p>
                  <p className="text-base sm:text-lg font-bold font-serif-title">
                    Graminum Herbal & Natural Store — Kashibugga, Warangal
                  </p>
                </div>
              </div>
            </div>

            {/* Right Story Content */}
            <div className="lg:col-span-6 space-y-5 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white px-3.5 py-1 rounded-full border border-[#8CCB55] text-xs font-extrabold text-[#075B2A] uppercase tracking-wider">
                Goodness from Nature
              </div>

              <h2 className="text-2xl sm:text-4xl font-black text-[#075B2A] font-serif-title leading-tight">
                Rooted in Tradition, Prepared with Reverence
              </h2>

              <p className="text-xs sm:text-sm text-[#18251B]/80 leading-relaxed">
                At Graminum, we believe food is medicine (Ahara is Aushadha). We revive forgotten
                traditional food processing: slow wood-pressed oils that never cross room temperature,
                grain sprouting that naturally multiplies bioavailable enzymes, and ancient herbal
                bath powders that care for skin without synthetic detergents.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-white p-3.5 rounded-2xl border border-[#E1E9DC]">
                  <p className="text-xl font-extrabold text-[#075B2A] font-serif-title">18+</p>
                  <p className="text-xs text-[#667267] font-semibold">Sprouted Native Grains</p>
                </div>
                <div className="bg-white p-3.5 rounded-2xl border border-[#E1E9DC]">
                  <p className="text-xl font-extrabold text-[#075B2A] font-serif-title">0%</p>
                  <p className="text-xs text-[#667267] font-semibold">Chemical Residues</p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 bg-[#075B2A] hover:bg-[#06451F] text-white text-xs sm:text-sm font-bold px-6 py-3 rounded-2xl transition-all shadow-md"
                >
                  <span>Learn More About Our Heritage</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. BESTSELLERS HIGHLIGHT ROW */}
      <section className="py-16 bg-[#FBF8EF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-extrabold text-[#4D963C] uppercase tracking-wider block mb-1">
              Customer Favorites
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#075B2A] font-serif-title">
              Most Loved Traditional Staples
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestsellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 7. CUSTOMER TESTIMONIALS */}
      <section className="py-16 sm:py-20 bg-white border-t border-[#E1E9DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-extrabold text-[#4D963C] uppercase tracking-wider block mb-1">
              Voices of Trust
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#075B2A] font-serif-title">
              What Families Say About Graminum
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TESTIMONIALS_DATA.map((t) => (
              <div
                key={t.id}
                className="bg-[#FBF8EF] p-5 rounded-3xl border border-[#E1E9DC] flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-3">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-[#18251B] italic leading-relaxed mb-4">
                    "{t.comment}"
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E1E9DC]/80 flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-xs"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-[#18251B]">{t.name}</h4>
                    <p className="text-[11px] text-[#667267]">{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. PROMOTIONAL CTA BANNER */}
      <section className="py-14 bg-[#075B2A] text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-4">
          <span className="inline-block bg-[#8CCB55] text-[#06451F] text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
            Switch to Pure Organic Living
          </span>
          <h2 className="text-2xl sm:text-4xl font-black font-serif-title max-w-2xl mx-auto">
            Experience the Authentic Taste of Traditional Indian Farming
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-xl mx-auto">
            Order online today for fresh direct store pickup from our Graminum Warangal store counter.
          </p>
          <div className="pt-2">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-white hover:bg-[#EFF7E9] text-[#075B2A] font-extrabold text-sm px-8 py-3.5 rounded-2xl shadow-xl transition-all active:scale-95"
            >
              <span>Explore Full Store</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

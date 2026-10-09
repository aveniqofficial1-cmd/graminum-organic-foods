import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Heart,
  Users,
  Award,
  Sprout,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Leaf,
  Layers,
} from 'lucide-react';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { WaveDivider } from '../components/common/WaveDivider';
import { LeafDecoration } from '../components/common/LeafDecoration';

export const AboutPage: React.FC = () => {
  return (
    <div className="w-full bg-[#FBF8EF] min-h-screen">
      {/* ================= HERO SECTION ================= */}
      <section className="relative bg-[#075B2A] text-white pt-12 pb-20 overflow-hidden">
        <LeafDecoration
          size={180}
          className="opacity-15 rotate-45 absolute -top-10 -right-10"
        />
        <LeafDecoration
          size={140}
          className="opacity-10 -rotate-12 absolute -bottom-8 -left-8"
        />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 text-[#8CCB55] text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>మన నేల • మన ఆహారం • మన ఆరోగ్యం</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-serif-title leading-tight">
            Rooted in Telugu Heritage, <br />
            <span className="text-[#8CCB55]">Nourishing Pure Lives</span>
          </h1>

          <p className="text-sm sm:text-base text-[#EFF7E9]/90 max-w-2xl mx-auto leading-relaxed pt-2">
            Graminum (గ్రామీణం) Herbal & Natural Store in Kashibugga, Warangal is dedicated to reviving
            the timeless healing and nutritional wisdom of ancient Ayurveda — delivering authentic herbal oils,
            traditional wellness remedies, natural foods, and sacred pooja essentials to your family.
          </p>
        </div>

        <WaveDivider position="bottom" fillColor="#FBF8EF" />
      </section>

      {/* ================= OUR STORY & PURPOSE ================= */}
      <section className="py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Image Collage with Organic Badge */}
            <div className="lg:col-span-6 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <img
                  src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1000&q=80"
                  alt="Natural farming soil and sunrise"
                  className="rounded-3xl shadow-xl w-full h-[400px] object-cover border-4 border-white"
                />

                {/* Floating Trust Card */}
                <div className="absolute -bottom-6 -right-4 sm:right-6 bg-white p-5 rounded-2xl border border-[#E1E9DC] shadow-xl max-w-xs space-y-1">
                  <div className="flex items-center gap-2 text-[#075B2A]">
                    <ShieldCheck className="w-6 h-6 text-[#4D963C]" />
                    <span className="font-extrabold text-sm">100% Purity Tested</span>
                  </div>
                  <p className="text-[11px] text-[#667267] leading-snug">
                    Zero chemical preservatives, zero synthetic polishing, and zero artificial flavors.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Story Copy */}
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-extrabold text-[#4D963C] uppercase tracking-widest">
                  Our Genesis & Heritage
                </span>
                <h2 className="text-2xl sm:text-4xl font-black text-[#075B2A] font-serif-title">
                  Preserving Traditional Herbal Wisdom & Purity
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-[#18251B] leading-relaxed">
                Located opposite Sai Baba Temple in Kashibugga, Warangal, Graminum Herbal & Natural Store
                was established to provide families with unadulterated, time-honored Ayurvedic formulations,
                cold-pressed herbal oils (Tailams), digestive rasayanams, and chemical-free personal care essentials.
              </p>

              <p className="text-xs sm:text-sm text-[#667267] leading-relaxed">
                Every formulation in our catalog — from classical Kesavardhini and Maharshi Tailams to
                authentic Madiphal Rasayanam, Nannari Sharbat, and pure Pacha Karpooram — is prepared following
                revered traditional methods, keeping the healing essence of nature intact.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-white rounded-2xl border border-[#E1E9DC] shadow-xs">
                  <span className="text-2xl font-black text-[#075B2A]">28+</span>
                  <p className="text-xs font-bold text-[#18251B] mt-0.5">Authentic Products</p>
                  <p className="text-[10px] text-gray-500">6 Specialized categories</p>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-[#E1E9DC] shadow-xs">
                  <span className="text-2xl font-black text-[#075B2A]">100%</span>
                  <p className="text-xs font-bold text-[#18251B] mt-0.5">Purity Guaranteed</p>
                  <p className="text-[10px] text-gray-500">Zero synthetic adulterants</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 4 PILLARS OF GRAMINUM ================= */}
      <section className="py-14 bg-[#EFF7E9] border-y border-[#8CCB55]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-extrabold text-[#075B2A] uppercase tracking-widest">
              What Sets Us Apart
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#075B2A] font-serif-title">
              Our 4 Pillars of Uncompromising Purity
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1 */}
            <div className="bg-white p-6 rounded-3xl border border-[#E1E9DC] shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#EFF7E9] text-[#075B2A] flex items-center justify-center">
                <Sprout className="w-6 h-6 text-[#075B2A]" />
              </div>
              <h3 className="text-base font-bold text-[#18251B]">Zero Chemical Farming</h3>
              <p className="text-xs text-[#667267] leading-relaxed">
                Grown strictly with Jeevamrutham, Neem-based natural pest management, and natural compost.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-white p-6 rounded-3xl border border-[#E1E9DC] shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#EFF7E9] text-[#075B2A] flex items-center justify-center">
                <Layers className="w-6 h-6 text-[#075B2A]" />
              </div>
              <h3 className="text-base font-bold text-[#18251B]">Wood-Pressed Extraction</h3>
              <p className="text-xs text-[#667267] leading-relaxed">
                Traditional wooden cold-press (Gaana) presses keep oil temperatures low, retaining vital antioxidants.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white p-6 rounded-3xl border border-[#E1E9DC] shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#EFF7E9] text-[#075B2A] flex items-center justify-center">
                <Users className="w-6 h-6 text-[#075B2A]" />
              </div>
              <h3 className="text-base font-bold text-[#18251B]">Fair Farmer Dignity</h3>
              <p className="text-xs text-[#667267] leading-relaxed">
                Eliminating middlemen allows us to offer 20-30% above market rates directly to our farming families.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="bg-white p-6 rounded-3xl border border-[#E1E9DC] shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#EFF7E9] text-[#075B2A] flex items-center justify-center">
                <Award className="w-6 h-6 text-[#075B2A]" />
              </div>
              <h3 className="text-base font-bold text-[#18251B]">NABL Certified Testing</h3>
              <p className="text-xs text-[#667267] leading-relaxed">
                Every single harvest batch is independently analyzed for heavy metals, moisture levels, and pesticides.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= THE SEED TO PLATE JOURNEY ================= */}
      <section className="py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-extrabold text-[#4D963C] uppercase tracking-widest">
              Traceability & Care
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#075B2A] font-serif-title">
              From Sacred Seeds to Your Family Table
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-3xl border border-[#E1E9DC] text-center space-y-3 shadow-xs">
              <span className="inline-block w-8 h-8 rounded-full bg-[#075B2A] text-white font-extrabold text-sm leading-8 mx-auto">
                1
              </span>
              <h4 className="text-sm font-bold text-[#18251B]">Desi Seed Selection</h4>
              <p className="text-xs text-[#667267]">
                Preserving native, drought-resistant heirloom seeds adapted to Telugu soil.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 rounded-3xl border border-[#E1E9DC] text-center space-y-3 shadow-xs">
              <span className="inline-block w-8 h-8 rounded-full bg-[#075B2A] text-white font-extrabold text-sm leading-8 mx-auto">
                2
              </span>
              <h4 className="text-sm font-bold text-[#18251B]">Natural Cultivation</h4>
              <p className="text-xs text-[#667267]">
                Zero chemicals. Nourished by traditional cow dung formulations and herbal sprays.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 rounded-3xl border border-[#E1E9DC] text-center space-y-3 shadow-xs">
              <span className="inline-block w-8 h-8 rounded-full bg-[#075B2A] text-white font-extrabold text-sm leading-8 mx-auto">
                3
              </span>
              <h4 className="text-sm font-bold text-[#18251B]">Sun Drying & Milling</h4>
              <p className="text-xs text-[#667267]">
                Naturally sun-cured, slow wood-pressed or stone-ground to keep nutrients whole.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white p-6 rounded-3xl border border-[#E1E9DC] text-center space-y-3 shadow-xs">
              <span className="inline-block w-8 h-8 rounded-full bg-[#075B2A] text-white font-extrabold text-sm leading-8 mx-auto">
                4
              </span>
              <h4 className="text-sm font-bold text-[#18251B]">Fresh Doorstep Delivery</h4>
              <p className="text-xs text-[#667267]">
                Hygienically packed in moisture-barrier pouches and delivered fresh to your door.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CALL TO ACTION ================= */}
      <section className="bg-[#075B2A] text-white py-16 relative overflow-hidden">
        <LeafDecoration
          size={160}
          className="opacity-10 rotate-45 absolute -top-10 -right-10"
        />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <h2 className="text-2xl sm:text-4xl font-black font-serif-title">
            Make the Switch to Unprocessed Living
          </h2>
          <p className="text-xs sm:text-sm text-[#EFF7E9]/90 max-w-xl mx-auto leading-relaxed">
            Experience the authentic taste and vibrant vitality of traditional Telugu agricultural
            heritage.
          </p>
          <div className="pt-2">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-[#8CCB55] hover:bg-[#4D963C] text-[#06451F] hover:text-white font-extrabold px-8 py-3.5 rounded-2xl shadow-lg transition-all active:scale-95"
            >
              <span>Explore Farm Harvests</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

import React, { useState } from 'react';
import {
  Search,
  ChevronDown,
  HelpCircle,
  MessageCircle,
} from 'lucide-react';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { FAQ_DATA } from '../data/faqs';
import { FAQItem } from '../types';

export const FAQPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [openFaqId, setOpenFaqId] = useState<string | null>(FAQ_DATA[0]?.id || null);

  const categories = [
    'All',
    'Ordering',
    'Payment',
    'Delivery',
    'Products',
    'Returns & Support',
  ];

  const filteredFaqs = FAQ_DATA.filter((item: FAQItem) => {
    const matchesCategory =
      selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  return (
    <div className="w-full bg-[#FBF8EF] min-h-screen py-6 sm:py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb */}
        <Breadcrumb items={[{ label: 'Frequently Asked Questions' }]} />

        {/* Hero Banner Header */}
        <div className="bg-white rounded-3xl border border-[#E1E9DC] p-8 sm:p-12 text-center shadow-sm space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#EFF7E9] px-3.5 py-1 rounded-full text-xs font-bold text-[#075B2A] border border-[#8CCB55]">
            <HelpCircle className="w-3.5 h-3.5 text-[#4D963C]" />
            <span>Help Center & Knowledge Base</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-[#075B2A] font-serif-title">
            Frequently Asked Questions
          </h1>

          <p className="text-xs sm:text-sm text-[#667267] max-w-lg mx-auto leading-relaxed">
            Find immediate answers regarding our authentic natural products, order fulfillment, payment verification, and traditional shelf-life recommendations.
          </p>

          {/* Search Input Bar */}
          <div className="max-w-md mx-auto relative pt-2">
            <input
              type="text"
              placeholder="Search by keywords (e.g. wood pressed, delivery, millets)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FBF8EF] text-xs sm:text-sm pl-10 pr-4 py-3 rounded-2xl border border-[#E1E9DC] focus:outline-none focus:border-[#075B2A] shadow-inner"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-[23px] -translate-y-1/2" />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none justify-start sm:justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs font-bold px-4 py-2 rounded-2xl transition-all shrink-0 ${
                selectedCategory === cat
                  ? 'bg-[#075B2A] text-white shadow-md'
                  : 'bg-white text-gray-700 border border-[#E1E9DC] hover:bg-[#EFF7E9] hover:text-[#075B2A]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQs Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq: FAQItem) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="bg-white rounded-2xl border border-[#E1E9DC] overflow-hidden transition-all shadow-2xs hover:shadow-xs"
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full flex items-center justify-between p-5 text-left transition-colors cursor-pointer"
                  >
                    <span className="text-xs sm:text-sm font-bold text-[#18251B] pr-4">
                      {faq.question}
                    </span>
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform duration-200 shrink-0 ${
                        isOpen ? 'bg-[#075B2A] text-white rotate-180' : 'bg-[#EFF7E9] text-[#075B2A]'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs text-[#667267] leading-relaxed border-t border-gray-100 bg-[#FBF8EF]/50">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 bg-white rounded-3xl border border-[#E1E9DC] text-gray-400 space-y-2">
              <p className="text-2xl">🔍</p>
              <p className="text-xs font-bold text-[#18251B]">
                No matching questions found for "{searchQuery}"
              </p>
              <p className="text-xs text-gray-500">
                Try searching for broader keywords or contact our team directly.
              </p>
            </div>
          )}
        </div>

        {/* Still Have Questions Contact Box */}
        <div className="bg-[#EFF7E9] rounded-3xl border border-[#8CCB55] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-base font-bold text-[#075B2A] font-serif-title">
              Still have questions about our natural products?
            </h3>
            <p className="text-xs text-[#667267]">
              Our customer happiness team in Hyderabad is available Mon-Sat, 9:00 AM - 7:00 PM IST.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#075B2A] hover:bg-[#06451F] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition-all active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Support</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

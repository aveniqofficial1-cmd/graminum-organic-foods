import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Send,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { useToast } from '../context/ToastContext';

export const ContactPage: React.FC = () => {
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('General Inquiry');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      showToast('Please complete all required fields.', 'error');
      return;
    }

    setIsSubmitted(true);
    showToast('Thank you! Your message has been sent to our team.', 'success');
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <div className="w-full bg-[#FBF8EF] min-h-screen py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Breadcrumb items={[{ label: 'Contact Us' }]} />

        <div className="bg-white rounded-3xl border border-[#E1E9DC] p-8 sm:p-12 text-center shadow-sm space-y-3">
          <span className="inline-block text-xs font-extrabold text-[#4D963C] uppercase tracking-widest bg-[#EFF7E9] px-3.5 py-1 rounded-full">
            Connect with Graminum
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-[#075B2A] font-serif-title">
            We Would Love to Hear From You
          </h1>
          <p className="text-xs sm:text-sm text-[#667267] max-w-xl mx-auto leading-relaxed">
            Have questions about our native grain harvests, bulk corporate gifting, or zero-budget farming partnerships? Reach out to our team in Hyderabad.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl border border-[#E1E9DC] p-6 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-[#075B2A] font-serif-title uppercase tracking-wider pb-3 border-b border-[#E1E9DC]">
                Flagship Store & Dispatch
              </h2>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#EFF7E9] text-[#075B2A] flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-[#075B2A]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#18251B]">Graminum Experience Center</h3>
                    <p className="text-[#667267] mt-0.5 leading-relaxed">
                      Plot 42, Road No. 36, Jubilee Hills,
                      <br />
                      Hyderabad, Telangana — 500033, India
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#EFF7E9] text-[#075B2A] flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-4 h-4 text-[#075B2A]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#18251B]">Phone & Customer Desk</h3>
                    <p className="text-[#667267] mt-0.5">+91 98765 43210 (Direct Desk)</p>
                    <p className="text-[#667267]">+91 40 2345 6789 (Store Landline)</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#EFF7E9] text-[#075B2A] flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="w-4 h-4 text-[#075B2A]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#18251B]">Email Enquiries</h3>
                    <p className="text-[#667267] mt-0.5">care@graminum.com (Support)</p>
                    <p className="text-[#667267]">farmers@graminum.com (FPO Sourcing)</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#EFF7E9] text-[#075B2A] flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-4 h-4 text-[#075B2A]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#18251B]">Operating Hours</h3>
                    <p className="text-[#667267] mt-0.5">Monday – Saturday: 9:00 AM – 8:30 PM</p>
                    <p className="text-[#667267]">Sunday: 10:00 AM – 6:00 PM</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E1E9DC]">
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-[#4D963C] hover:bg-[#075B2A] text-white text-xs sm:text-sm font-bold py-3 rounded-2xl shadow-md transition-all active:scale-95"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Instant WhatsApp Chat</span>
                </a>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-[#E1E9DC] p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#075B2A] uppercase">Store Location Map</span>
                <span className="text-gray-400">Jubilee Hills, Hyd</span>
              </div>
              <div className="relative w-full h-44 rounded-2xl overflow-hidden bg-[#EFF7E9] border border-[#8CCB55]/40 flex items-center justify-center text-center p-4">
                <div className="space-y-1.5 z-10">
                  <div className="w-10 h-10 bg-[#075B2A] text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                    <Building className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-[#075B2A]">Graminum Store & Cafe</p>
                  <p className="text-[10px] text-[#667267]">Road 36, Jubilee Hills, Hyderabad</p>
                </div>
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#075B2A_1px,transparent_1px)] [background-size:16px_16px]"></div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E1E9DC] p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-bold text-[#075B2A] font-serif-title">
                Send Us a Message
              </h2>
              <p className="text-xs text-[#667267] mt-1">
                Fill in your details and our customer care team will respond within 2-4 business hours.
              </p>
            </div>

            {isSubmitted && (
              <div className="p-4 bg-[#EFF7E9] border border-[#8CCB55] rounded-2xl flex items-center gap-3 text-xs text-[#075B2A]">
                <CheckCircle2 className="w-5 h-5 text-[#4D963C] shrink-0" />
                <span>
                  Thank you! Your message has been received. Our team will contact you shortly.
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#18251B] mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Anand Rao"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#FBF8EF] text-xs px-3.5 py-2.5 rounded-xl border border-[#E1E9DC] focus:outline-none focus:border-[#075B2A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#18251B] mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="anand@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#FBF8EF] text-xs px-3.5 py-2.5 rounded-xl border border-[#E1E9DC] focus:outline-none focus:border-[#075B2A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#18251B] mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98490 00000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#FBF8EF] text-xs px-3.5 py-2.5 rounded-xl border border-[#E1E9DC] focus:outline-none focus:border-[#075B2A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#18251B] mb-1">
                    Inquiry Topic
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-[#FBF8EF] text-xs px-3.5 py-2.5 rounded-xl border border-[#E1E9DC] focus:outline-none focus:border-[#075B2A]"
                  >
                    <option value="General Inquiry">General Product Inquiry</option>
                    <option value="Order & Delivery">Order Status & Delivery</option>
                    <option value="Bulk & Corporate">Bulk / Corporate Gifting</option>
                    <option value="Farmer Partnership">Farmer / FPO Partnership</option>
                    <option value="Feedback & Quality">Quality Feedback</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#18251B] mb-1">
                  Your Message *
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="How can we assist you with our organic products?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-[#FBF8EF] text-xs p-3.5 rounded-xl border border-[#E1E9DC] focus:outline-none focus:border-[#075B2A]"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-[#075B2A] hover:bg-[#06451F] text-white text-xs sm:text-sm font-bold py-3.5 rounded-2xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

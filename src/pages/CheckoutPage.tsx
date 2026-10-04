import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Truck,
  Store,
  QrCode,
  Upload,
  CheckCircle2,
  Lock,
  Clock,
  ArrowRight,
  ArrowLeft,
  Info,
  MapPin,
  MessageCircle,
  FileCheck,
  Sparkles,
  X,
  User as UserIcon,
  Copy,
  Phone,
  AlertTriangle,
  AlertCircle,
  Check,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useStoreSettings } from '../context/StoreSettingsContext';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { DeliveryMethod, PaymentMethod, Address } from '../types';

export const CheckoutPage: React.FC = () => {
  const { items, subtotal, deliveryFee, grandTotal, clearCart } = useCart();
  const { createOrder } = useOrders();
  const { currentUser, isAuthenticated, loginWithGoogle } = useAuth();
  const { showToast } = useToast();
  const { settings, getEffectiveQrUrl, generateWhatsAppOrderUrl } = useStoreSettings();
  const navigate = useNavigate();

  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Checkout Step: 1 = Customer Details & Store Pickup, 2 = Payment & Place Order
  const [checkoutStep, setCheckoutStep] = useState<1 | 2>(1);

  // Delivery Method: 100% Direct Store Pickup
  const deliveryMethod: DeliveryMethod = 'Store Pickup';

  // Customer Contact Form Data
  const defaultAddress = currentUser?.addresses?.find((a) => a.isDefault) || currentUser?.addresses?.[0];

  const [fullName, setFullName] = useState(defaultAddress?.fullName || currentUser?.name || '');
  const [email, setEmail] = useState(defaultAddress?.email || currentUser?.email || '');
  const [phone, setPhone] = useState(defaultAddress?.phone || currentUser?.phone || '');
  const [pickupNote, setPickupNote] = useState('');

  useEffect(() => {
    if (currentUser) {
      const addr = currentUser.addresses?.find((a) => a.isDefault) || currentUser.addresses?.[0];
      if (addr) {
        setFullName(addr.fullName || currentUser.name || '');
        setEmail(addr.email || currentUser.email || '');
        setPhone(addr.phone || currentUser.phone || '');
      } else {
        setFullName(currentUser.name || '');
        setEmail(currentUser.email || '');
        setPhone(currentUser.phone || '');
      }
    }
  }, [currentUser]);

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      await loginWithGoogle();
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Payment Selection - Direct Phone Number Payment (9396723139)
  const [paymentMethod] = useState<PaymentMethod>('UPI / QR Code');
  const [paymentUtr, setPaymentUtr] = useState('');
  const [receiptImage, setReceiptImage] = useState<string>('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [copiedNumber, setCopiedNumber] = useState(false);

  const handleCopyPhone = () => {
    const num = settings.whatsappNumber || '9396723139';
    navigator.clipboard.writeText(num);
    setCopiedNumber(true);
    showToast(`Phone number copied to clipboard: ${num}`, 'success');
    setTimeout(() => setCopiedNumber(false), 2500);
  };

  const effectiveTotal = subtotal; // Store pickup is 100% free delivery
  const qrCodeUrl = getEffectiveQrUrl(effectiveTotal);

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Image file size must be below 5MB', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptImage(reader.result as string);
        showToast('Payment screenshot attached! It will be verified by our team.', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleContinueToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      showToast('Please fill all required personal contact fields.', 'error');
      return;
    }
    setCheckoutStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      showToast('Your cart is empty', 'error');
      navigate('/shop');
      return;
    }

    setIsPlacingOrder(true);

    const shippingAddress: Address = {
      id: `addr-${Date.now()}`,
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      addressLine:
        'Graminum Store Pickup: 11-18-356/3/A, Opp Sai Baba Temple, Beside Assisi School, O City, Kashibugga',
      city: 'Warangal',
      state: 'Telangana',
      pincode: '506002',
      isDefault: true,
      type: 'Work',
    };

    const newOrder = createOrder({
      customerName: fullName.trim(),
      customerEmail: email.trim(),
      customerPhone: phone.trim(),
      items: [...items],
      subtotal,
      deliveryFee: 0,
      discount: 0,
      grandTotal: effectiveTotal,
      deliveryMethod: 'Store Pickup',
      shippingAddress,
      paymentMethod: 'UPI / QR Code',
      paymentScreenshot: receiptImage || undefined,
      paymentUtr: paymentUtr.trim() || undefined,
    });

    clearCart();

    // Auto-open WhatsApp with complete pre-filled details
    const whatsappUrl = generateWhatsAppOrderUrl(newOrder);

    setTimeout(() => {
      setIsPlacingOrder(false);
      try {
        window.open(whatsappUrl, '_blank');
      } catch {
        // popup might be blocked
      }
      navigate(`/order-confirmation/${newOrder.orderNumber}`);
    }, 600);
  };

  // ================= UNAUTHENTICATED STATE: LOGIN / SIGNUP REQUIRED =================
  if (!isAuthenticated) {
    return (
      <div className="w-full bg-[#FBF8EF] min-h-[75vh] flex items-center justify-center py-10 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-[#E1E9DC] p-6 sm:p-8 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 bg-[#EFF7E9] text-[#075B2A] rounded-3xl flex items-center justify-center mx-auto border border-[#8CCB55] shadow-xs">
            <Lock className="w-8 h-8 text-[#075B2A]" />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-extrabold text-[#4D963C] uppercase tracking-wider bg-[#EFF7E9] px-3 py-1 rounded-full border border-[#8CCB55]">
              Customer Login Required
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-[#075B2A] font-serif-title">
              Sign In to Complete Checkout
            </h1>
            <p className="text-xs sm:text-sm text-[#667267] leading-relaxed">
              Please sign in or create a Graminum account to verify your delivery address, link your UPI payment receipt, and track live dispatch.
            </p>
          </div>

          {/* 1-Click Google Login */}
          <button
            type="button"
            disabled={isGoogleLoading}
            onClick={handleGoogleSignIn}
            className="w-full bg-white hover:bg-gray-50 text-gray-700 border-2 border-[#E1E9DC] hover:border-[#075B2A] py-3 px-4 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-3 shadow-xs active:scale-98 cursor-pointer disabled:opacity-60"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{isGoogleLoading ? 'Signing in with Google...' : 'Continue with Google'}</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-[#E1E9DC] w-full"></div>
            <span className="bg-white px-3 text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">
              Or with email
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              to="/login?redirect=/checkout"
              className="w-full bg-[#075B2A] hover:bg-[#06451F] text-white text-xs sm:text-sm font-bold py-3 px-4 rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
            >
              <UserIcon className="w-4 h-4" />
              <span>Sign In</span>
            </Link>
            <Link
              to="/signup?redirect=/checkout"
              className="w-full bg-[#EFF7E9] hover:bg-[#8CCB55]/30 text-[#075B2A] border border-[#8CCB55] text-xs sm:text-sm font-bold py-3 px-4 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-1.5"
            >
              <span>Create Account</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="w-full bg-[#FBF8EF] min-h-[70vh] flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-3xl border border-[#E1E9DC] text-center space-y-4 max-w-md shadow-sm">
          <p className="text-3xl">🧺</p>
          <h2 className="text-xl font-bold text-[#075B2A] font-serif-title">
            No Items to Checkout
          </h2>
          <p className="text-xs text-[#667267]">
            Please add items to your cart before proceeding to checkout.
          </p>
          <Link
            to="/shop"
            className="inline-block bg-[#075B2A] text-white text-xs font-bold px-6 py-2.5 rounded-xl"
          >
            Go to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#FBF8EF] min-h-screen py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* Breadcrumb */}
        <Breadcrumb items={[{ label: 'Cart', link: '/cart' }, { label: 'Secure Checkout' }]} />

        {/* 3-Step Progress Indicator */}
        <div className="bg-white p-3.5 sm:p-5 rounded-3xl border border-[#E1E9DC] shadow-xs">
          <div className="flex items-center justify-between max-w-xl mx-auto">
            {/* Step 1: Details */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div
                className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  checkoutStep >= 1
                    ? 'bg-[#075B2A] text-white shadow-sm'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                1
              </div>
              <span
                className={`text-[11px] sm:text-xs font-bold ${
                  checkoutStep >= 1 ? 'text-[#075B2A]' : 'text-gray-400'
                }`}
              >
                Store Pickup
              </span>
            </div>

            <div
              className={`flex-1 h-0.5 mx-1.5 sm:mx-4 ${
                checkoutStep >= 2 ? 'bg-[#075B2A]' : 'bg-[#E1E9DC]'
              }`}
            ></div>

            {/* Step 2: Payment */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div
                className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  checkoutStep >= 2
                    ? 'bg-[#075B2A] text-white shadow-sm'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                2
              </div>
              <span
                className={`text-[11px] sm:text-xs font-bold ${
                  checkoutStep >= 2 ? 'text-[#075B2A]' : 'text-gray-400'
                }`}
              >
                UPI Payment
              </span>
            </div>

            <div className="flex-1 h-0.5 mx-1.5 sm:mx-4 bg-[#E1E9DC]"></div>

            {/* Step 3: Confirmation */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center text-xs font-bold">
                3
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-gray-400">
                Confirm
              </span>
            </div>
          </div>
        </div>

        {/* Main 2-Column Checkout Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* ================= LEFT: STEP FORMS ================= */}
          <div className="lg:col-span-8 space-y-6">
            {/* STEP 1: DIRECT STORE PICKUP & CUSTOMER DETAILS */}
            {checkoutStep === 1 && (
              <form
                onSubmit={handleContinueToPayment}
                className="bg-white rounded-3xl border border-[#E1E9DC] p-5 sm:p-8 shadow-sm space-y-6"
              >
                {/* 1. Direct Store Pickup Location Banner */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xs sm:text-sm font-bold text-[#075B2A] uppercase tracking-wider flex items-center gap-2">
                      <Store className="w-4 h-4 text-[#075B2A]" />
                      <span>1. Direct Store Pickup Fulfillment</span>
                    </h2>
                    <span className="text-[10px] text-emerald-800 font-extrabold bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full">
                      100% Free Store Pickup
                    </span>
                  </div>

                  <div className="p-4 sm:p-5 rounded-2xl bg-[#EFF7E9] border-2 border-[#8CCB55] space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#075B2A] text-white flex items-center justify-center shrink-0 shadow-xs">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-[#075B2A] text-sm">
                            Graminum Herbal & Organic Store
                          </span>
                          <span className="text-[10px] bg-[#075B2A] text-white px-2 py-0.5 rounded font-bold">
                            Warangal
                          </span>
                        </div>
                        <p className="font-bold text-[#18251B]">
                          11-18-356/3/A, Opposite Sai Baba Temple, Beside Assisi School, O City
                        </p>
                        <p className="text-gray-600">
                          Kashibugga, Warangal, Telangana - 506002
                        </p>
                        <p className="text-[#075B2A] font-bold pt-1">
                          📞 Store Counter & Help: 9396723139
                        </p>
                      </div>
                    </div>

                    <div className="pt-2.5 border-t border-[#8CCB55]/50 flex items-center gap-2 text-[11px] text-gray-700">
                      <Clock className="w-4 h-4 text-[#075B2A] shrink-0" />
                      <span>
                        Pickup Hours: <strong>9:00 AM – 9:00 PM (Mon – Sun)</strong>. Order is prepared fresh at our store counter.
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Customer Contact Details */}
                <div className="pt-4 border-t border-[#E1E9DC] space-y-4">
                  <h2 className="text-xs sm:text-sm font-bold text-[#075B2A] uppercase tracking-wider">
                    2. Customer Contact Coordinates
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#18251B] mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Sravani Varma"
                        className="w-full bg-[#FBF8EF] text-xs px-3.5 py-2.5 rounded-xl border border-[#E1E9DC] focus:outline-none focus:border-[#075B2A]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#18251B] mb-1">
                        Mobile Number (for WhatsApp Receipt & Pickup Alerts) *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98490 12345"
                        className="w-full bg-[#FBF8EF] text-xs px-3.5 py-2.5 rounded-xl border border-[#E1E9DC] focus:outline-none focus:border-[#075B2A]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#18251B] mb-1">
                      Email Address (for Digital Invoice) *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="sravani.varma@example.com"
                      className="w-full bg-[#FBF8EF] text-xs px-3.5 py-2.5 rounded-xl border border-[#E1E9DC] focus:outline-none focus:border-[#075B2A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#18251B] mb-1">
                      Pickup Note / Special Requests (Optional)
                    </label>
                    <input
                      type="text"
                      value={pickupNote}
                      onChange={(e) => setPickupNote(e.target.value)}
                      placeholder="e.g. Will collect around 5 PM today"
                      className="w-full bg-[#FBF8EF] text-xs px-3.5 py-2.5 rounded-xl border border-[#E1E9DC] focus:outline-none focus:border-[#075B2A]"
                    />
                  </div>
                </div>

                {/* Continue to Payment Button */}
                <div className="pt-4 border-t border-[#E1E9DC] flex flex-col sm:flex-row items-center justify-between gap-3">
                  <Link
                    to="/cart"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-800 order-2 sm:order-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Cart</span>
                  </Link>

                  <button
                    type="submit"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#075B2A] hover:bg-[#06451F] text-white py-3 px-6 rounded-2xl text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95 cursor-pointer order-1 sm:order-2"
                  >
                    <span>Proceed to Phone Payment (9396723139)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: DIRECT PHONE NUMBER PAYMENT & WHATSAPP SHARING */}
            {checkoutStep === 2 && (
              <form
                onSubmit={handlePlaceOrder}
                className="bg-white rounded-3xl border border-[#E1E9DC] p-5 sm:p-8 shadow-sm space-y-6"
              >
                <div className="flex items-center justify-between pb-3 border-b border-[#E1E9DC]">
                  <div>
                    <span className="text-[10px] font-extrabold text-[#4D963C] uppercase tracking-wider">
                      Step 2 of 2
                    </span>
                    <h2 className="text-sm sm:text-lg font-bold text-[#075B2A] font-serif-title">
                      Pay via Mobile Number / UPI (9396723139)
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCheckoutStep(1)}
                    className="text-xs font-bold text-[#075B2A] hover:underline cursor-pointer"
                  >
                    Edit Info
                  </button>
                </div>

                {/* PRIMARY PAYMENT METHOD: DIRECT PHONE NUMBER BOX */}
                <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#EFF7E9] via-[#F4FAF0] to-[#E5F2DF] border-2 border-[#075B2A] space-y-5 shadow-md">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-[#075B2A] text-white flex items-center justify-center shadow-md shrink-0">
                        <Phone className="w-6 h-6 animate-pulse" />
                      </div>
                      <div>
                        <div className="inline-flex items-center gap-1 bg-[#075B2A] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-md mb-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Primary Active Payment Method</span>
                        </div>
                        <h3 className="text-base sm:text-lg font-black text-[#075B2A]">
                          Pay Directly via Phone Number
                        </h3>
                      </div>
                    </div>

                    <div className="bg-white px-4 py-2 rounded-2xl border border-[#8CCB55] shadow-xs text-right sm:text-right">
                      <span className="block text-[10px] font-bold text-gray-500 uppercase">Total Payable</span>
                      <span className="text-lg sm:text-xl font-black text-[#075B2A]">₹{effectiveTotal}</span>
                    </div>
                  </div>

                  {/* Highlighted Master Mobile Number with 1-Click Copy */}
                  <div className="bg-white p-4 sm:p-5 rounded-2xl border-2 border-[#8CCB55] shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="space-y-1 text-center md:text-left">
                      <span className="text-[11px] font-extrabold text-[#4D963C] uppercase tracking-wider block">
                        Official Store Master Mobile Number:
                      </span>
                      <div className="flex items-center justify-center md:justify-start gap-3">
                        <span className="text-2xl sm:text-3xl font-black text-[#18251B] font-mono tracking-wider">
                          9396723139
                        </span>
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-emerald-300">
                          Verified GPay / PhonePe / Paytm
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        Merchant: <strong>{settings.merchantName}</strong>
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleCopyPhone}
                      className={`w-full md:w-auto px-5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-95 ${
                        copiedNumber
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#075B2A] hover:bg-[#06451F] text-white'
                      }`}
                    >
                      {copiedNumber ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Copied Number!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy Mobile Number</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* 3-Step Clear Payment Instructions */}
                  <div className="bg-white/80 p-4 rounded-2xl border border-[#E1E9DC] space-y-2.5">
                    <span className="text-[11px] font-bold text-[#18251B] uppercase tracking-wider block">
                      How to Pay in 3 Quick Steps:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-gray-700">
                      <div className="bg-white p-3 rounded-xl border border-[#E1E9DC] flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-[#075B2A] text-white text-[11px] font-black flex items-center justify-center shrink-0">
                          1
                        </span>
                        <div>
                          <strong className="block text-[#18251B]">Open UPI App</strong>
                          <span>Open Google Pay, PhonePe, Paytm, or BHIM.</span>
                        </div>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-[#E1E9DC] flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-[#075B2A] text-white text-[11px] font-black flex items-center justify-center shrink-0">
                          2
                        </span>
                        <div>
                          <strong className="block text-[#18251B]">Pay to Mobile</strong>
                          <span>Enter number <strong>9396723139</strong> & pay <strong>₹{effectiveTotal}</strong>.</span>
                        </div>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-[#E1E9DC] flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-[#075B2A] text-white text-[11px] font-black flex items-center justify-center shrink-0">
                          3
                        </span>
                        <div>
                          <strong className="block text-[#18251B]">Confirm on WhatsApp</strong>
                          <span>Click the green button below to submit & share screenshot.</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SCANNER DISABLED WARNING & BLURRED QR SCANNER */}
                <div className="p-4 sm:p-5 rounded-3xl bg-amber-50/60 border-2 border-amber-300 space-y-4">
                  {/* Warning Notice Banner */}
                  <div className="flex items-start gap-3 bg-amber-100/90 p-3.5 rounded-2xl border border-amber-300 text-amber-900">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs sm:text-sm font-extrabold text-amber-950">
                        ⚠️ DO NOT USE QR SCANNER (Temporarily Disabled)
                      </h4>
                      <p className="text-[11px] sm:text-xs text-amber-900 mt-0.5 leading-relaxed">
                        Please <strong>do not scan the QR code</strong> below. Instead, please pay directly by transferring to the mobile number <strong>9396723139</strong> via Google Pay, PhonePe, or Paytm above.
                      </p>
                    </div>
                  </div>

                  {/* Blurred QR Code with Overlay */}
                  <div className="relative bg-white/70 p-4 rounded-2xl border border-amber-200 overflow-hidden">
                    <div className="filter blur-[5px] opacity-30 select-none pointer-events-none flex flex-col sm:flex-row items-center justify-center gap-4">
                      <div className="p-2 bg-gray-100 rounded-xl border border-gray-300">
                        <img
                          src={qrCodeUrl}
                          alt="QR Disabled"
                          className="w-28 h-28 object-contain"
                        />
                      </div>
                      <div className="text-xs text-gray-500 space-y-1 text-center sm:text-left">
                        <p className="font-bold">UPI ID: {settings.upiId}</p>
                        <p>Merchant: {settings.merchantName}</p>
                        <p>Amount: ₹{effectiveTotal}</p>
                      </div>
                    </div>

                    {/* Overlay Label */}
                    <div className="absolute inset-0 flex items-center justify-center bg-amber-900/10 backdrop-blur-[1px]">
                      <div className="bg-amber-600 text-white font-extrabold text-xs px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 border border-white/40">
                        <AlertCircle className="w-4 h-4" />
                        <span>Scanner Disabled — Use Phone No: 9396723139</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Optional Payment Receipt Attachment on Checkout */}
                <div className="bg-white p-4 rounded-2xl border border-[#E1E9DC] space-y-3 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="font-bold text-[#18251B] flex items-center gap-1.5">
                      <Upload className="w-4 h-4 text-[#075B2A]" />
                      <span>Payment Screenshot / UTR (Optional)</span>
                      </span>
                      <span className="text-[10px] text-gray-400 font-medium">
                        Speeds up admin approval
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                          Payment Screenshot:
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleReceiptUpload}
                          className="w-full text-xs text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#EFF7E9] file:text-[#075B2A] hover:file:bg-[#8CCB55]/30 cursor-pointer"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                          12-Digit Bank UTR / Ref Number:
                        </label>
                        <input
                          type="text"
                          value={paymentUtr}
                          onChange={(e) => setPaymentUtr(e.target.value)}
                          placeholder="e.g. 402849102948"
                          className="w-full bg-[#FBF8EF] text-xs px-3 py-2 rounded-xl border border-[#E1E9DC] focus:outline-none focus:border-[#075B2A]"
                        />
                      </div>
                    </div>

                    {receiptImage && (
                      <div className="flex items-center gap-3 bg-[#EFF7E9] p-2.5 rounded-xl border border-[#8CCB55]">
                        <img
                          src={receiptImage}
                          alt="Attached Receipt Preview"
                          className="w-12 h-12 object-cover rounded-lg border bg-white"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-[#075B2A] text-xs">Screenshot Attached</p>
                          <p className="text-[10px] text-gray-500">Ready to submit with order</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setReceiptImage('')}
                          className="text-red-500 hover:text-red-700 text-xs p-1 cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                {/* Submit & WhatsApp Sharing Info */}
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-start gap-3 text-xs text-amber-900">
                  <MessageCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                  <p className="leading-relaxed text-[11px] sm:text-xs">
                    <strong>Auto-Filled WhatsApp Sharing:</strong> When you place this order, we will automatically pre-fill your order summary, item list, address, and amount into WhatsApp to our support team (<strong>{settings.whatsappNumber}</strong>). Our admin will verify the receipt and confirm your order immediately!
                  </p>
                </div>

                {/* Place Order Button */}
                <div className="pt-4 border-t border-[#E1E9DC] flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setCheckoutStep(1)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-800 cursor-pointer order-2 sm:order-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Delivery Info</span>
                  </button>

                  <button
                    type="submit"
                    disabled={isPlacingOrder}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#075B2A] hover:bg-[#06451F] disabled:opacity-50 text-white py-3.5 px-7 rounded-2xl text-xs sm:text-sm font-black shadow-lg transition-all active:scale-95 cursor-pointer order-1 sm:order-2"
                  >
                    {isPlacingOrder ? (
                      <span>Placing Order...</span>
                    ) : (
                      <>
                        <MessageCircle className="w-4 h-4" />
                        <span>Place Order & Share on WhatsApp</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* ================= RIGHT: ORDER SUMMARY (4 Cols) ================= */}
          <div className="lg:col-span-4 bg-white p-5 sm:p-6 rounded-3xl border border-[#E1E9DC] shadow-sm lg:sticky lg:top-28 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#E1E9DC]">
              <h3 className="text-xs sm:text-sm font-bold text-[#075B2A] uppercase tracking-wider font-serif-title">
                Order Summary ({items.length} items)
              </h3>
              <Link to="/cart" className="text-xs font-bold text-[#075B2A] hover:underline">
                Edit Cart
              </Link>
            </div>

            {/* Cart Items List Preview */}
            <div className="divide-y divide-gray-100 max-h-56 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={`${item.productId}-${item.selectedPackSize}`} className="py-2.5 flex items-center gap-3">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-11 h-11 object-cover rounded-xl border bg-[#EFF7E9] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[#18251B] truncate">{item.product.name}</p>
                    <p className="text-[11px] text-[#667267]">
                      {item.selectedPackSize} × {item.quantity}
                    </p>
                  </div>
                  <span className="text-xs font-black text-[#075B2A] shrink-0">
                    ₹{item.unitPrice * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Financial Totals */}
            <div className="space-y-2 pt-3 border-t border-[#E1E9DC] text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-bold text-[#18251B]">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Charges</span>
                <span className="font-bold text-[#075B2A]">
                  {deliveryMethod === 'Store Pickup' || deliveryFee === 0 ? (
                    <span className="text-emerald-700 font-extrabold">FREE</span>
                  ) : (
                    `₹${deliveryFee}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm font-black text-[#075B2A] pt-2 border-t border-[#E1E9DC]">
                <span>Total Amount to Pay</span>
                <span className="text-base">₹{effectiveTotal}</span>
              </div>
            </div>

            {/* Security Guarantee */}
            <div className="p-3.5 bg-[#EFF7E9] rounded-2xl border border-[#8CCB55] flex items-center gap-2.5 text-xs text-[#075B2A]">
              <ShieldCheck className="w-5 h-5 shrink-0 text-[#4D963C]" />
              <span className="font-semibold text-[11px]">
                100% Direct Farm Guarantee • Zero Middlemen • Safe QR Payment
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

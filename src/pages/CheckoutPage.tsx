import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Truck,
  Store,
  QrCode,
  Upload,
  CheckCircle2,
  Lock,
  ArrowRight,
  ArrowLeft,
  Info,
  MapPin,
  MessageCircle,
  FileCheck,
  Sparkles,
  X,
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
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const { settings, getEffectiveQrUrl, generateWhatsAppOrderUrl } = useStoreSettings();
  const navigate = useNavigate();

  // Checkout Step: 1 = Details & Address, 2 = Payment & Place Order
  const [checkoutStep, setCheckoutStep] = useState<1 | 2>(1);

  // Delivery Method: Home Delivery vs Store Pickup
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('Home Delivery');

  // Customer & Shipping Form Data
  const defaultAddress = currentUser?.addresses?.find((a) => a.isDefault) || currentUser?.addresses?.[0];

  const [fullName, setFullName] = useState(defaultAddress?.fullName || currentUser?.name || '');
  const [email, setEmail] = useState(defaultAddress?.email || currentUser?.email || '');
  const [phone, setPhone] = useState(defaultAddress?.phone || currentUser?.phone || '');
  const [addressLine, setAddressLine] = useState(defaultAddress?.addressLine || '');
  const [city, setCity] = useState(defaultAddress?.city || 'Hyderabad');
  const [state, setState] = useState(defaultAddress?.state || 'Telangana');
  const [pincode, setPincode] = useState(defaultAddress?.pincode || '500033');

  // Payment Selection - Scanner Only
  const [paymentMethod] = useState<PaymentMethod>('UPI / QR Code');
  const [paymentUtr, setPaymentUtr] = useState('');
  const [receiptImage, setReceiptImage] = useState<string>('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const effectiveTotal = deliveryMethod === 'Store Pickup' ? subtotal : grandTotal;
  const qrCodeUrl = getEffectiveQrUrl(effectiveTotal);

  const indianStates = [
    'Telangana',
    'Andhra Pradesh',
    'Karnataka',
    'Tamil Nadu',
    'Maharashtra',
    'Kerala',
    'Delhi',
    'Gujarat',
    'Rajasthan',
    'Uttar Pradesh',
    'West Bengal',
  ];

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
    if (deliveryMethod === 'Home Delivery') {
      if (!addressLine.trim() || !city.trim() || !pincode.trim()) {
        showToast('Please complete the delivery address.', 'error');
        return;
      }
      if (!/^\d{6}$/.test(pincode.trim())) {
        showToast('Please enter a valid 6-digit Indian PIN code.', 'error');
        return;
      }
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
        deliveryMethod === 'Store Pickup'
          ? 'Graminum Flagship Store, Road No 36, Jubilee Hills'
          : addressLine.trim(),
      city: deliveryMethod === 'Store Pickup' ? 'Hyderabad' : city.trim(),
      state: deliveryMethod === 'Store Pickup' ? 'Telangana' : state,
      pincode: deliveryMethod === 'Store Pickup' ? '500033' : pincode.trim(),
      isDefault: true,
      type: deliveryMethod === 'Store Pickup' ? 'Work' : 'Home',
    };

    const newOrder = createOrder({
      customerName: fullName.trim(),
      customerEmail: email.trim(),
      customerPhone: phone.trim(),
      items: [...items],
      subtotal,
      deliveryFee: deliveryMethod === 'Store Pickup' ? 0 : deliveryFee,
      discount: 0,
      grandTotal: effectiveTotal,
      deliveryMethod,
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
      // Attempt opening WhatsApp in a new tab for instant convenience
      try {
        window.open(whatsappUrl, '_blank');
      } catch {
        // popup might be blocked, OrderConfirmationPage also has direct button
      }
      navigate(`/order-confirmation/${newOrder.orderNumber}`);
    }, 600);
  };

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb */}
        <Breadcrumb items={[{ label: 'Cart', link: '/cart' }, { label: 'Secure Checkout' }]} />

        {/* 3-Step Progress Indicator */}
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#E1E9DC] shadow-xs">
          <div className="flex items-center justify-between max-w-xl mx-auto">
            {/* Step 1: Details */}
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  checkoutStep >= 1
                    ? 'bg-[#075B2A] text-white shadow-sm'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                1
              </div>
              <span
                className={`text-xs font-bold ${
                  checkoutStep >= 1 ? 'text-[#075B2A]' : 'text-gray-400'
                }`}
              >
                Delivery Details
              </span>
            </div>

            <div
              className={`flex-1 h-0.5 mx-2 sm:mx-4 ${
                checkoutStep >= 2 ? 'bg-[#075B2A]' : 'bg-[#E1E9DC]'
              }`}
            ></div>

            {/* Step 2: Payment */}
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  checkoutStep >= 2
                    ? 'bg-[#075B2A] text-white shadow-sm'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                2
              </div>
              <span
                className={`text-xs font-bold ${
                  checkoutStep >= 2 ? 'text-[#075B2A]' : 'text-gray-400'
                }`}
              >
                QR Scanner Payment
              </span>
            </div>

            <div className="flex-1 h-0.5 mx-2 sm:mx-4 bg-[#E1E9DC]"></div>

            {/* Step 3: Confirmation */}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center text-xs font-bold">
                3
              </div>
              <span className="text-xs font-bold text-gray-400 hidden sm:inline">
                WhatsApp Approval
              </span>
            </div>
          </div>
        </div>

        {/* Main 2-Column Checkout Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ================= LEFT: STEP FORMS ================= */}
          <div className="lg:col-span-8 space-y-6">
            {/* STEP 1: CONTACT & DELIVERY ADDRESS */}
            {checkoutStep === 1 && (
              <form
                onSubmit={handleContinueToPayment}
                className="bg-white rounded-3xl border border-[#E1E9DC] p-6 sm:p-8 shadow-sm space-y-6"
              >
                {/* 1. Delivery Mode Selection */}
                <div>
                  <h2 className="text-sm font-bold text-[#075B2A] uppercase tracking-wider mb-3">
                    1. Choose Delivery Method
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('Home Delivery')}
                      className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                        deliveryMethod === 'Home Delivery'
                          ? 'border-[#075B2A] bg-[#EFF7E9] shadow-xs'
                          : 'border-[#E1E9DC] hover:border-[#8CCB55] bg-[#FBF8EF]/50'
                      }`}
                    >
                      <Truck
                        className={`w-5 h-5 mt-0.5 ${
                          deliveryMethod === 'Home Delivery' ? 'text-[#075B2A]' : 'text-gray-400'
                        }`}
                      />
                      <div>
                        <p className="text-xs sm:text-sm font-bold text-[#18251B]">
                          Doorstep Home Delivery
                        </p>
                        <p className="text-[11px] text-[#667267] mt-0.5">
                          Delivered in eco-friendly packaging within 24–48 hours across Telangana & AP.
                        </p>
                        <span className="inline-block text-[10px] text-[#075B2A] font-bold mt-1">
                          {deliveryFee === 0 ? 'FREE DELIVERY' : `₹${deliveryFee} Shipping`}
                        </span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('Store Pickup')}
                      className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                        deliveryMethod === 'Store Pickup'
                          ? 'border-[#075B2A] bg-[#EFF7E9] shadow-xs'
                          : 'border-[#E1E9DC] hover:border-[#8CCB55] bg-[#FBF8EF]/50'
                      }`}
                    >
                      <Store
                        className={`w-5 h-5 mt-0.5 ${
                          deliveryMethod === 'Store Pickup' ? 'text-[#075B2A]' : 'text-gray-400'
                        }`}
                      />
                      <div>
                        <p className="text-xs sm:text-sm font-bold text-[#18251B]">
                          Direct Store Pickup
                        </p>
                        <p className="text-[11px] text-[#667267] mt-0.5">
                          Collect directly from Graminum Flagship Store (Jubilee Hills, Hyd).
                        </p>
                        <span className="inline-block text-[10px] text-emerald-800 font-extrabold bg-emerald-100 px-2 py-0.5 rounded-full mt-1">
                          Zero Delivery Charge
                        </span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* 2. Customer Contact Details */}
                <div className="pt-4 border-t border-[#E1E9DC] space-y-4">
                  <h2 className="text-sm font-bold text-[#075B2A] uppercase tracking-wider">
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
                        Mobile Number (for WhatsApp Receipt & Dispatch) *
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
                </div>

                {/* 3. Shipping Address (If Home Delivery) */}
                {deliveryMethod === 'Home Delivery' && (
                  <div className="pt-4 border-t border-[#E1E9DC] space-y-4">
                    <h2 className="text-sm font-bold text-[#075B2A] uppercase tracking-wider">
                      3. Shipping Destination
                    </h2>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-[#18251B] mb-1">
                          House / Flat No, Apartment, Street & Area *
                        </label>
                        <input
                          type="text"
                          required
                          value={addressLine}
                          onChange={(e) => setAddressLine(e.target.value)}
                          placeholder="e.g. Flat 402, Sri Sai Residency, Jubilee Hills Road No 36"
                          className="w-full bg-[#FBF8EF] text-xs px-3.5 py-2.5 rounded-xl border border-[#E1E9DC] focus:outline-none focus:border-[#075B2A]"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-[#18251B] mb-1">
                            City / Town *
                          </label>
                          <input
                            type="text"
                            required
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="Hyderabad"
                            className="w-full bg-[#FBF8EF] text-xs px-3.5 py-2.5 rounded-xl border border-[#E1E9DC] focus:outline-none focus:border-[#075B2A]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#18251B] mb-1">
                            State *
                          </label>
                          <select
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            className="w-full bg-[#FBF8EF] text-xs px-3.5 py-2.5 rounded-xl border border-[#E1E9DC] focus:outline-none focus:border-[#075B2A]"
                          >
                            {indianStates.map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#18251B] mb-1">
                            PIN Code *
                          </label>
                          <input
                            type="text"
                            required
                            maxLength={6}
                            value={pincode}
                            onChange={(e) => setPincode(e.target.value)}
                            placeholder="500033"
                            className="w-full bg-[#FBF8EF] text-xs px-3.5 py-2.5 rounded-xl border border-[#E1E9DC] focus:outline-none focus:border-[#075B2A]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Continue to Payment Button */}
                <div className="pt-4 border-t border-[#E1E9DC] flex items-center justify-between">
                  <Link
                    to="/cart"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-800"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Cart</span>
                  </Link>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 bg-[#075B2A] hover:bg-[#06451F] text-white py-3 px-6 rounded-2xl text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    <span>Proceed to Scanner Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: SCANNER PAYMENT & WHATSAPP SHARING */}
            {checkoutStep === 2 && (
              <form
                onSubmit={handlePlaceOrder}
                className="bg-white rounded-3xl border border-[#E1E9DC] p-6 sm:p-8 shadow-sm space-y-6"
              >
                <div className="flex items-center justify-between pb-3 border-b border-[#E1E9DC]">
                  <div>
                    <span className="text-[10px] font-extrabold text-[#4D963C] uppercase tracking-wider">
                      Step 2 of 2
                    </span>
                    <h2 className="text-base sm:text-lg font-bold text-[#075B2A] font-serif-title">
                      Pay via UPI QR Scanner
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCheckoutStep(1)}
                    className="text-xs font-bold text-[#075B2A] hover:underline cursor-pointer"
                  >
                    Edit Delivery Info
                  </button>
                </div>

                {/* Scanner Payment Showcase Box */}
                <div className="p-5 sm:p-6 rounded-3xl bg-[#EFF7E9]/70 border-2 border-[#8CCB55] space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#075B2A] text-white flex items-center justify-center shadow-sm">
                      <QrCode className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-black text-[#075B2A]">
                        Scan QR Code & Pay ₹{effectiveTotal}
                      </h3>
                      <p className="text-xs text-[#667267]">
                        Google Pay • PhonePe • Paytm • BHIM • Any Bank UPI App
                      </p>
                    </div>
                  </div>

                  {/* QR Code & Merchant Coordinates */}
                  <div className="bg-white p-5 rounded-2xl border border-[#8CCB55] flex flex-col sm:flex-row items-center gap-6 shadow-xs">
                    {/* Live QR Image */}
                    <div className="p-3 bg-[#FBF8EF] rounded-2xl border-2 border-[#075B2A]/20 text-center shrink-0 shadow-xs">
                      <img
                        src={qrCodeUrl}
                        alt="Graminum UPI QR Scanner"
                        className="w-44 h-44 sm:w-48 sm:h-48 object-contain mx-auto rounded-lg"
                      />
                      <span className="inline-block text-[10px] font-bold text-[#075B2A] bg-white px-2 py-0.5 rounded-full mt-2 border border-[#E1E9DC]">
                        Amount: ₹{effectiveTotal}
                      </span>
                    </div>

                    {/* Step by Step Guide & UPI Details */}
                    <div className="space-y-3 flex-1 text-xs">
                      <div className="p-3 bg-[#FBF8EF] rounded-xl border border-[#E1E9DC] space-y-1">
                        <p className="text-[10px] text-gray-500 font-bold uppercase">Official Merchant</p>
                        <p className="font-extrabold text-[#18251B] text-sm">{settings.merchantName}</p>
                        <div className="flex items-center justify-between pt-1">
                          <span className="font-mono text-xs text-[#075B2A] font-bold bg-white px-2 py-1 rounded border border-[#E1E9DC]">
                            {settings.upiId}
                          </span>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                            Verified
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1.5 text-gray-600 leading-relaxed">
                        <div className="flex items-start gap-2">
                          <span className="w-4 h-4 rounded-full bg-[#075B2A] text-white text-[10px] flex items-center justify-center font-bold shrink-0 mt-0.5">
                            1
                          </span>
                          <span>Open your UPI app & scan the QR code above.</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="w-4 h-4 rounded-full bg-[#075B2A] text-white text-[10px] flex items-center justify-center font-bold shrink-0 mt-0.5">
                            2
                          </span>
                          <span>Pay the exact total amount: <strong>₹{effectiveTotal}</strong></span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="w-4 h-4 rounded-full bg-[#075B2A] text-white text-[10px] flex items-center justify-center font-bold shrink-0 mt-0.5">
                            3
                          </span>
                          <span>
                            Click <strong>"Place Order & Share on WhatsApp"</strong> below. All order details will be auto-filled to WhatsApp number <strong>{settings.whatsappNumber}</strong>.
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Optional Payment Receipt Attachment on Checkout */}
                  <div className="bg-white p-4 rounded-2xl border border-[#E1E9DC] space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#18251B] flex items-center gap-1.5">
                        <Upload className="w-4 h-4 text-[#075B2A]" />
                        <span>Attach Payment Screenshot / UTR Number (Optional)</span>
                      </span>
                      <span className="text-[10px] text-gray-400 font-medium">
                        Speeds up admin approval
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                          Payment Screenshot / Receipt:
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
                          className="text-red-500 hover:text-red-700 text-xs p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit & WhatsApp Sharing Info */}
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-start gap-3 text-xs text-amber-900">
                  <MessageCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong>Auto-Filled WhatsApp Sharing:</strong> When you place this order, we will automatically pre-fill your order summary, item list, address, and amount into WhatsApp to our support team (<strong>{settings.whatsappNumber}</strong>). Our admin will verify the receipt and confirm your order immediately!
                  </p>
                </div>

                {/* Place Order Button */}
                <div className="pt-4 border-t border-[#E1E9DC] flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCheckoutStep(1)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-800 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Delivery Info</span>
                  </button>

                  <button
                    type="submit"
                    disabled={isPlacingOrder}
                    className="inline-flex items-center gap-2 bg-[#075B2A] hover:bg-[#06451F] disabled:opacity-50 text-white py-3.5 px-7 rounded-2xl text-xs sm:text-sm font-black shadow-lg transition-all active:scale-95 cursor-pointer"
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
          <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-[#E1E9DC] shadow-sm sticky top-28 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#E1E9DC]">
              <h3 className="text-sm font-bold text-[#075B2A] uppercase tracking-wider font-serif-title">
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

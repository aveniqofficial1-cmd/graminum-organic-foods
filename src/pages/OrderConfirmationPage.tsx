import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Package,
  Truck,
  Store,
  Clock,
  MessageCircle,
  ArrowRight,
  Upload,
  ShieldCheck,
  CreditCard,
  MapPin,
  ExternalLink,
  QrCode,
  Sparkles,
  Banknote,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useOrders } from '../context/OrderContext';
import { useToast } from '../context/ToastContext';
import { useStoreSettings } from '../context/StoreSettingsContext';

export const OrderConfirmationPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { getOrderById, uploadPaymentReceipt } = useOrders();
  const { showToast } = useToast();
  const { settings, generateWhatsAppOrderUrl } = useStoreSettings();
  const navigate = useNavigate();

  const [receiptImage, setReceiptImage] = useState<string>('');
  const [utrInput, setUtrInput] = useState<string>('');

  const order = getOrderById(orderId || '');

  useEffect(() => {
    window.scrollTo(0, 0);
    // Fire celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#075B2A', '#4D963C', '#8CCB55', '#EFF7E9', '#E9A23B'],
      });
    } catch {
      // ignore
    }
  }, [orderId]);

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && order) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Image must be under 5MB', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setReceiptImage(dataUrl);
        uploadPaymentReceipt(order.id, dataUrl, utrInput || order.paymentUtr);
        showToast('Payment screenshot attached! Admin will verify soon.', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleWhatsAppShare = () => {
    if (!order) return;
    const whatsappUrl = generateWhatsAppOrderUrl(order);
    window.open(whatsappUrl, '_blank');
  };

  if (!order) {
    return (
      <div className="w-full bg-[#FBF8EF] min-h-[70vh] flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-3xl border border-[#E1E9DC] text-center space-y-4 max-w-md shadow-sm">
          <p className="text-3xl">🔍</p>
          <h2 className="text-xl font-bold text-[#075B2A] font-serif-title">
            Order Not Found
          </h2>
          <p className="text-xs text-[#667267]">
            We couldn't locate this order in our system.
          </p>
          <Link
            to="/shop"
            className="inline-block bg-[#075B2A] text-white text-xs font-bold px-6 py-2.5 rounded-xl"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const isCOD = order.paymentMethod === 'Cash on Delivery';
  const isPendingVerification = !isCOD && order.paymentStatus === 'Pending';
  const whatsappUrl = generateWhatsAppOrderUrl(order);

  return (
    <div className="w-full bg-[#FBF8EF] min-h-screen py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Success Header Card */}
        <div className="bg-white rounded-3xl border border-[#E1E9DC] p-8 sm:p-12 text-center shadow-sm relative overflow-hidden">
          <div className="w-20 h-20 bg-[#EFF7E9] text-[#075B2A] rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-[#8CCB55] shadow-sm">
            <CheckCircle2 className="w-10 h-10 text-[#075B2A]" />
          </div>

          <span className="inline-block text-xs font-extrabold text-[#4D963C] uppercase tracking-widest bg-[#EFF7E9] px-3.5 py-1 rounded-full mb-2">
            Order Registered
          </span>

          <h1 className="text-2xl sm:text-4xl font-black text-[#075B2A] font-serif-title mb-2">
            {isCOD
              ? 'Order Placed & Confirmed!'
              : isPendingVerification
              ? 'Order Received — Awaiting Admin Payment Approval'
              : 'Order Placed & Confirmed!'}
          </h1>

          <p className="text-xs sm:text-sm text-[#667267] max-w-lg mx-auto leading-relaxed">
            {isCOD
              ? `Thank you for choosing pure organic groceries from Graminum. Your Cash on Delivery order #${order.orderNumber} has been placed. Please pay in cash upon doorstep delivery.`
              : `Thank you for choosing pure organic groceries from Graminum. Your order #${order.orderNumber} has been registered.`}
          </p>

          {/* WhatsApp Direct Action Banner */}
          <div className="mt-6 p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-400 max-w-xl mx-auto text-left shadow-xs">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black text-emerald-950">
                    Auto-Filled WhatsApp Confirmation
                  </h3>
                  <span className="text-[10px] bg-emerald-200 text-emerald-900 font-extrabold px-2 py-0.5 rounded-full">
                    Instant
                  </span>
                </div>
                <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                  Click below to send your itemized receipt and order details to{' '}
                  <strong>{settings.whatsappNumber}</strong>. No manual typing required!
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-black px-5 py-2.5 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Send Receipt on WhatsApp Now</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-8 border-t border-[#E1E9DC] text-left">
            <div className="p-3 bg-[#FBF8EF] rounded-2xl border border-[#E1E9DC]">
              <p className="text-[10px] text-gray-400 font-bold uppercase">Order ID</p>
              <p className="text-xs sm:text-sm font-extrabold text-[#075B2A]">#{order.orderNumber}</p>
            </div>
            <div className="p-3 bg-[#FBF8EF] rounded-2xl border border-[#E1E9DC]">
              <p className="text-[10px] text-gray-400 font-bold uppercase">Total Amount</p>
              <p className="text-xs sm:text-sm font-extrabold text-[#075B2A]">₹{order.grandTotal}</p>
            </div>
            <div className="p-3 bg-[#FBF8EF] rounded-2xl border border-[#E1E9DC]">
              <p className="text-[10px] text-gray-400 font-bold uppercase">Delivery Type</p>
              <p className="text-xs sm:text-sm font-bold text-[#18251B] truncate">{order.deliveryMethod}</p>
            </div>
            <div className="p-3 bg-[#FBF8EF] rounded-2xl border border-[#E1E9DC]">
              <p className="text-[10px] text-gray-400 font-bold uppercase">Payment Status</p>
              <span
                className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  isCOD
                    ? order.paymentStatus === 'Verified'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-blue-100 text-blue-800'
                    : order.paymentStatus === 'Verified'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {isCOD
                  ? order.paymentStatus === 'Verified'
                    ? '✓ Cash Collected'
                    : '💵 Pay on Delivery'
                  : order.paymentStatus === 'Verified'
                  ? '✓ Admin Verified'
                  : '⏳ Review Pending'}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Details Box: Cash on Delivery vs Online UPI Screenshot */}
        {isCOD ? (
          <div className="bg-white rounded-3xl border border-[#8CCB55] p-6 sm:p-8 space-y-4 shadow-sm bg-[#EFF7E9]/30">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#EFF7E9] text-[#075B2A] flex items-center justify-center shrink-0 border border-[#8CCB55]">
                <Banknote className="w-6 h-6 text-[#075B2A]" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-[#075B2A] font-serif-title">
                  Cash on Delivery (Pay upon Doorstep Arrival)
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed mt-1">
                  Zero advance payment required! Please keep <strong className="text-[#075B2A] font-bold text-sm">₹{order.grandTotal}</strong> in cash ready to hand over to the delivery partner when your parcel arrives.
                </p>
              </div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-[#E1E9DC] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#4D963C]" />
                <span className="font-bold text-[#18251B]">Doorstep Cash Collection Total:</span>
              </div>
              <span className="text-base font-black text-[#075B2A]">₹{order.grandTotal}</span>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-[#E1E9DC] p-6 sm:p-8 space-y-4 shadow-sm">
            <div className="flex items-start gap-3">
              <QrCode className="w-6 h-6 text-[#075B2A] shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm sm:text-base font-bold text-[#075B2A] font-serif-title">
                  Payment Verification Screenshot & UTR
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed mt-1">
                  Store UPI ID: <strong className="text-[#075B2A] font-mono">{settings.upiId}</strong> ({settings.merchantName}). Upload your payment receipt screenshot or enter the 12-digit UTR reference number if you haven't done so already.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-[#FBF8EF] rounded-2xl border border-[#E1E9DC]">
                <label className="block text-xs font-bold text-[#18251B] mb-1">
                  Upload Payment Screenshot:
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleReceiptUpload}
                  className="w-full text-xs text-gray-700 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#075B2A] file:text-white cursor-pointer"
                />
              </div>

              <div className="p-4 bg-[#FBF8EF] rounded-2xl border border-[#E1E9DC]">
                <label className="block text-xs font-bold text-[#18251B] mb-1">
                  Bank UTR / Transaction Reference Number:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. 324908129845"
                    value={utrInput || order.paymentUtr || ''}
                    onChange={(e) => setUtrInput(e.target.value)}
                    className="flex-1 bg-white text-xs px-3 py-2 rounded-xl border border-[#E1E9DC]"
                  />
                  <button
                    onClick={() => {
                      if (utrInput.trim()) {
                        uploadPaymentReceipt(order.id, order.paymentScreenshot || '', utrInput.trim());
                        showToast('UTR reference updated successfully!', 'success');
                      }
                    }}
                    className="bg-[#075B2A] text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-[#06451F] cursor-pointer"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>

            {(order.paymentScreenshot || receiptImage) && (
              <div className="flex items-center gap-3 p-3 bg-[#EFF7E9] rounded-2xl border border-[#8CCB55]">
                <img
                  src={order.paymentScreenshot || receiptImage}
                  alt="Receipt Preview"
                  className="w-14 h-14 object-cover rounded-xl border border-[#8CCB55] bg-white shadow-xs"
                />
                <div className="flex-1 text-xs">
                  <span className="text-xs text-emerald-800 font-extrabold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Receipt Attached to Order #{order.orderNumber}
                  </span>
                  <p className="text-[11px] text-gray-600 mt-0.5">
                    Our admin will verify this receipt against our bank / WhatsApp ledger and approve your order.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Ordered Products Breakdown & Address Details */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Items Summary (8 Cols) */}
          <div className="md:col-span-8 bg-white rounded-3xl border border-[#E1E9DC] p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-[#075B2A] uppercase tracking-wider pb-3 border-b border-[#E1E9DC]">
              Purchased Items ({order.items.length})
            </h2>

            <div className="divide-y divide-[#E1E9DC]">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-12 h-12 object-cover rounded-xl border shrink-0 bg-[#EFF7E9]"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-[#18251B] truncate">{item.product.name}</p>
                      <p className="text-[11px] text-[#667267]">
                        Pack: <strong className="text-[#075B2A]">{item.selectedPackSize}</strong> × {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-extrabold text-[#075B2A] shrink-0">
                    ₹{item.unitPrice * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#E1E9DC] space-y-1.5 text-xs text-right">
              <p className="text-gray-500">
                Subtotal: <strong className="text-gray-800">₹{order.subtotal}</strong>
              </p>
              <p className="text-gray-500">
                Delivery:{' '}
                <strong className="text-gray-800">
                  {order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}
                </strong>
              </p>
              <p className="text-sm font-black text-[#075B2A] pt-1 border-t border-gray-100">
                Grand Total: ₹{order.grandTotal}
              </p>
            </div>
          </div>

          {/* Store Pickup Location & Customer Contact (4 Cols) */}
          <div className="md:col-span-4 bg-white rounded-3xl border border-[#E1E9DC] p-6 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-[#075B2A] uppercase tracking-wider pb-2 border-b border-[#E1E9DC] flex items-center gap-1.5">
                {order.deliveryMethod === 'Home Delivery' ? (
                  <>
                    <Truck className="w-4 h-4 text-[#075B2A]" />
                    <span>Doorstep Delivery Address</span>
                  </>
                ) : (
                  <>
                    <Store className="w-4 h-4 text-[#075B2A]" />
                    <span>Store Pickup Details</span>
                  </>
                )}
              </h3>

              {order.deliveryMethod === 'Home Delivery' ? (
                <div className="p-3 bg-[#EFF7E9] rounded-2xl border border-[#8CCB55] space-y-1 text-xs">
                  <p className="font-black text-[#075B2A]">{order.shippingAddress.fullName}</p>
                  <p className="text-gray-700">{order.shippingAddress.addressLine}</p>
                  <p className="text-gray-700">
                    {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                  </p>
                  <p className="text-[#075B2A] font-bold pt-1">📞 Contact: {order.shippingAddress.phone}</p>
                </div>
              ) : (
                <div className="p-3 bg-[#EFF7E9] rounded-2xl border border-[#8CCB55] space-y-1 text-xs">
                  <p className="font-black text-[#075B2A]">Graminum Store (Warangal)</p>
                  <p className="text-gray-700">11-18-356/3/A, Opp Sai Baba Temple,</p>
                  <p className="text-gray-700">Beside Assisi School, O City,</p>
                  <p className="text-gray-700">Kashibugga, Warangal - 506002</p>
                  <p className="text-[#075B2A] font-bold pt-1">📞 Counter: 9396723139</p>
                </div>
              )}

              <div className="text-xs text-[#18251B] space-y-1 pt-1">
                <p className="font-bold text-gray-500 uppercase text-[10px]">Customer Details:</p>
                <p className="font-bold">{order.customerName}</p>
                <p className="text-gray-600">📞 {order.customerPhone}</p>
                <p className="text-gray-600">✉️ {order.customerEmail}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E1E9DC] text-xs text-[#667267] space-y-1">
              <p className="font-bold text-[#075B2A]">Payment Method</p>
              <p className="font-semibold text-gray-800">{order.paymentMethod}</p>
            </div>
          </div>
        </div>

        {/* Next Actions Row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            to={`/track-order/${order.orderNumber}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#075B2A] hover:bg-[#06451F] text-white text-xs sm:text-sm font-bold px-7 py-3.5 rounded-2xl shadow-md transition-all active:scale-95"
          >
            <Package className="w-4 h-4" />
            <span>Track Live Order Status</span>
          </Link>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs sm:text-sm font-bold px-6 py-3.5 rounded-2xl transition-all active:scale-95 shadow-sm"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Share on WhatsApp</span>
          </a>

          <Link
            to="/shop"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-[#EFF7E9] text-[#075B2A] border border-[#075B2A] text-xs sm:text-sm font-bold px-6 py-3.5 rounded-2xl transition-all"
          >
            <span>Continue Shopping</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

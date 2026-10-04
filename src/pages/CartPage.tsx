import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  Store,
  ShieldCheck,
  Tag,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { useToast } from '../context/ToastContext';

export const CartPage: React.FC = () => {
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    deliveryFee,
    grandTotal,
    itemCount,
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState<number>(0);

  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = couponCode.trim().toUpperCase();
    if (!clean) return;

    if (clean === 'GRAMINUM10' || clean === 'ORGANIC10') {
      const disc = Math.round(subtotal * 0.1);
      setAppliedCoupon(clean);
      setCouponDiscount(disc);
      showToast(`Coupon "${clean}" applied! You saved ₹${disc}`, 'success');
      setCouponCode('');
    } else if (clean === 'WELCOME50') {
      setAppliedCoupon(clean);
      setCouponDiscount(50);
      showToast('Coupon "WELCOME50" applied! You saved ₹50', 'success');
      setCouponCode('');
    } else {
      showToast('Invalid coupon code. Try GRAMINUM10 or WELCOME50', 'error');
    }
  };

  const finalTotal = Math.max(0, grandTotal - couponDiscount);

  if (items.length === 0) {
    return (
      <div className="w-full bg-[#FBF8EF] min-h-[75vh] flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-[#E1E9DC] p-8 sm:p-10 text-center space-y-5 shadow-sm">
          <div className="w-20 h-20 bg-[#EFF7E9] text-[#075B2A] rounded-full flex items-center justify-center mx-auto text-4xl shadow-inner">
            🛒
          </div>
          <h2 className="text-2xl font-black text-[#075B2A] font-serif-title">
            Your Cart is Empty
          </h2>
          <p className="text-xs sm:text-sm text-[#667267] leading-relaxed">
            Looks like you haven't added any pure organic grains, oils, or traditional mixes yet.
            Explore our harvest catalog and nurture your family's health!
          </p>
          <div className="pt-2">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-[#075B2A] hover:bg-[#06451F] text-white text-xs sm:text-sm font-bold px-7 py-3 rounded-2xl shadow-md transition-all active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Explore Organic Products</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#FBF8EF] min-h-screen py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Breadcrumb & Heading */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <Breadcrumb items={[{ label: 'Shopping Cart' }]} />
          <button
            onClick={clearCart}
            className="text-xs text-red-600 hover:text-red-700 font-semibold self-start sm:self-auto flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Cart</span>
          </button>
        </div>

        {/* Store Pickup Warangal Banner */}
        <div className="bg-[#EFF7E9] border border-[#8CCB55] p-3.5 sm:p-4 rounded-2xl shadow-xs flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-[#075B2A]">
          <div className="flex items-center gap-2.5">
            <Store className="w-5 h-5 text-[#4D963C] shrink-0" />
            <span>📍 Direct Store Pickup from Graminum Kashibugga Warangal Store! Collect with your Order ID.</span>
          </div>
          <span className="bg-[#8CCB55] text-[#06451F] text-[10px] font-black px-2.5 py-1 rounded-full shrink-0">
            FREE STORE PICKUP
          </span>
        </div>

        {/* Main Cart Grid: Left Items List & Right Order Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ================= LEFT: ITEMS LIST ================= */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-[#E1E9DC] p-5 sm:p-7 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E1E9DC]">
              <h1 className="text-base sm:text-lg font-bold text-[#075B2A] font-serif-title">
                Cart Items ({itemCount})
              </h1>
              <span className="text-xs text-[#667267] font-semibold">Standard Harvest Packaging</span>
            </div>

            <div className="divide-y divide-[#E1E9DC]">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.selectedPackSize}`}
                  className="py-4 sm:py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  {/* Thumbnail & Name */}
                  <div className="flex items-center gap-4 min-w-0">
                    <Link
                      to={`/product/${item.product.slug}`}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-[#EFF7E9] border border-gray-100 shrink-0"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </Link>

                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-[#4D963C] uppercase tracking-wider block">
                        {item.product.category}
                      </span>
                      <Link
                        to={`/product/${item.product.slug}`}
                        className="text-xs sm:text-sm font-bold text-[#18251B] hover:text-[#075B2A] transition-colors line-clamp-1"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-[11px] text-[#667267] font-medium mt-0.5">
                        Pack Size: <strong className="text-[#075B2A]">{item.selectedPackSize}</strong> • ₹{item.unitPrice} each
                      </p>
                    </div>
                  </div>

                  {/* Quantity Counter & Subtotal */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 w-full sm:w-auto pt-2 sm:pt-0">
                    {/* Quantity Buttons */}
                    <div className="flex items-center bg-[#FBF8EF] border border-[#E1E9DC] rounded-xl p-0.5">
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.selectedPackSize, item.quantity - 1)
                        }
                        className="w-7 h-7 flex items-center justify-center text-[#18251B] hover:bg-white rounded-lg transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-[#075B2A]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.selectedPackSize, item.quantity + 1)
                        }
                        className="w-7 h-7 flex items-center justify-center text-[#18251B] hover:bg-white rounded-lg transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Line Item Total */}
                    <div className="text-right min-w-[70px]">
                      <span className="text-sm sm:text-base font-black text-[#075B2A]">
                        ₹{item.unitPrice * item.quantity}
                      </span>
                    </div>

                    {/* Delete Item Button */}
                    <button
                      onClick={() => removeFromCart(item.productId, item.selectedPackSize)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Back to Shop Link */}
            <div className="pt-4 border-t border-[#E1E9DC] flex items-center justify-between">
              <Link
                to="/shop"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#075B2A] hover:underline"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Continue Shopping</span>
              </Link>
            </div>
          </div>

          {/* ================= RIGHT: ORDER SUMMARY ================= */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl border border-[#E1E9DC] p-6 shadow-sm space-y-5">
              <h2 className="text-base font-bold text-[#075B2A] font-serif-title uppercase tracking-wider pb-3 border-b border-[#E1E9DC]">
                Order Summary
              </h2>

              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <label className="block text-[11px] font-bold text-[#18251B] uppercase tracking-wider">
                  Promo / Harvest Coupon
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. GRAMINUM10"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 bg-[#FBF8EF] text-xs px-3 py-2 rounded-xl border border-[#E1E9DC] uppercase font-semibold focus:outline-none focus:border-[#075B2A]"
                  />
                  <button
                    type="submit"
                    className="bg-[#EFF7E9] hover:bg-[#8CCB55] text-[#075B2A] text-xs font-bold px-3.5 py-2 rounded-xl border border-[#8CCB55] transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {appliedCoupon && (
                  <div className="flex items-center justify-between text-[11px] text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    <span className="flex items-center gap-1 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#4D963C]" />
                      Applied: {appliedCoupon}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setAppliedCoupon(null);
                        setCouponDiscount(0);
                      }}
                      className="text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </form>

              {/* Subtotal Calculations */}
              <div className="space-y-2.5 text-xs pt-2 border-t border-[#E1E9DC]">
                <div className="flex items-center justify-between text-[#667267]">
                  <span>Items Subtotal ({itemCount} items)</span>
                  <span className="font-bold text-[#18251B]">₹{subtotal}</span>
                </div>

                <div className="flex items-center justify-between text-[#667267]">
                  <span>Store Pickup (Warangal)</span>
                  <span className="font-bold">
                    <span className="text-[#4D963C] font-extrabold uppercase">FREE</span>
                  </span>
                </div>

                {couponDiscount > 0 && (
                  <div className="flex items-center justify-between text-emerald-700 font-bold">
                    <span>Coupon Discount</span>
                    <span>-₹{couponDiscount}</span>
                  </div>
                )}

                <div className="pt-3 border-t border-[#E1E9DC] flex items-baseline justify-between text-sm sm:text-base font-extrabold text-[#075B2A]">
                  <span>Grand Total</span>
                  <span className="text-xl font-black">₹{finalTotal}</span>
                </div>
                <p className="text-[10px] text-gray-400 text-right">Includes all applicable GST</p>
              </div>

              {/* Proceed to Checkout Action Button */}
              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-[#075B2A] hover:bg-[#06451F] text-white py-3.5 px-6 rounded-2xl text-xs sm:text-sm font-extrabold shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Guarantee badges */}
              <div className="pt-2 text-center text-[11px] text-[#667267] space-y-1">
                <p className="flex items-center justify-center gap-1.5 font-semibold text-[#075B2A]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#4D963C]" />
                  <span>100% Secure Checkout & Native Farm Guarantee</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

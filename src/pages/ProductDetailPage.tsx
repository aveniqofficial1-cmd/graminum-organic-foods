import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  ShoppingBag,
  Heart,
  Share2,
  CheckCircle2,
  ShieldCheck,
  Store,
  RotateCcw,
  Sparkles,
  Plus,
  Minus,
  MessageSquare,
  Zap,
  Leaf,
  Check,
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { Product, Review } from '../types';
import { ProductCard } from '../components/common/ProductCard';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { products, getProductBySlug } = useProducts();
  const { addToCart, getItemQuantity } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { userReviews, addCustomerReview, currentUser } = useAuth();
  const { showToast } = useToast();

  const product = getProductBySlug(slug || '') || products[0];

  const [selectedImage, setSelectedImage] = useState(product?.image || '');
  const [selectedPack, setSelectedPack] = useState(product?.packSize || '500g');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'ingredients' | 'nutrition' | 'reviews'>('desc');

  // Review Form State
  const [newRating, setNewRating] = useState(5);
  const [reviewerName, setReviewerName] = useState(currentUser?.name || '');
  const [reviewerLocation, setReviewerLocation] = useState('Hyderabad');
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Sync state when product slug changes
  useEffect(() => {
    window.scrollTo(0, 0);
    if (product) {
      setSelectedImage(product.image);
      setSelectedPack(product.packSize);
      setQuantity(1);
    }
  }, [slug, product]);

  if (!product) {
    return (
      <div className="w-full bg-[#FBF8EF] min-h-[60vh] flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <p className="text-lg font-bold text-[#075B2A]">Product Not Found</p>
          <Link to="/shop" className="text-xs text-[#4D963C] hover:underline font-bold">
            ← Back to Shop Catalog
          </Link>
        </div>
      </div>
    );
  }

  const isFavorited = isInWishlist(product.id);
  const inCartQty = getItemQuantity(product.id, selectedPack);

  // Selected pack price
  const packOption = product.packSizeOptions?.find((opt) => opt.size === selectedPack);
  const currentPrice = packOption ? packOption.price : product.price;
  const currentStock = packOption ? packOption.stock : product.stock;

  const handleAddToCart = () => {
    addToCart(product, selectedPack, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedPack, quantity);
    navigate('/checkout');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: product.name,
          text: `Check out ${product.name} on Graminum Natural Products!`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Product link copied to clipboard!', 'info');
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewComment.trim()) {
      showToast('Please provide your name and a comment.', 'error');
      return;
    }
    setIsSubmittingReview(true);
    setTimeout(() => {
      addCustomerReview({
        productId: product.id,
        userName: reviewerName.trim(),
        userLocation: reviewerLocation.trim(),
        rating: newRating,
        comment: reviewComment.trim(),
        verifiedPurchase: true,
      });
      setReviewComment('');
      setIsSubmittingReview(false);
      setActiveTab('reviews');
    }, 400);
  };

  // Related products from same category
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  // Combine initial demo reviews + user submitted reviews for this product
  const productReviews = userReviews.filter((r) => r.productId === product.id);

  return (
    <div className="w-full bg-[#FBF8EF] min-h-screen py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Breadcrumb Navigation */}
        <Breadcrumb
          items={[
            { label: 'Shop', link: '/shop' },
            { label: product.category, link: `/shop?category=${encodeURIComponent(product.category)}` },
            { label: product.name },
          ]}
        />

        {/* Top Product Hero Section */}
        <div className="bg-white rounded-3xl border border-[#E1E9DC] p-6 sm:p-8 lg:p-10 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-6 space-y-4">
            {/* Main Featured Image with Zoom View */}
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-[#EFF7E9] border border-[#E1E9DC] group">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 cursor-crosshair"
              />

              {/* Badges Overlay */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5 pointer-events-none">
                {product.isOrganic && (
                  <span className="bg-[#EFF7E9] text-[#075B2A] text-xs font-bold px-3 py-1 rounded-full border border-[#8CCB55] shadow-sm flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#4D963C]"></span>
                    100% Natural Product
                  </span>
                )}
              </div>

              {/* Wishlist & Share buttons */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <button
                  onClick={() => toggleWishlist(product.id, product.name)}
                  className={`p-2.5 rounded-full backdrop-blur-md transition-all ${
                    isFavorited
                      ? 'bg-red-50 text-red-500 shadow-md scale-105'
                      : 'bg-white/90 text-gray-600 hover:text-red-500 shadow-sm'
                  }`}
                  aria-label="Toggle Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isFavorited ? 'fill-red-500' : ''}`} />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2.5 rounded-full bg-white/90 text-gray-600 hover:text-[#075B2A] shadow-sm backdrop-blur-md"
                  aria-label="Share Product"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Thumbnail Gallery Row */}
            {product.gallery && product.gallery.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-1 no-scrollbar">
                {product.gallery.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(imgUrl)}
                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 shrink-0 transition-all ${
                      selectedImage === imgUrl
                        ? 'border-[#075B2A] ring-2 ring-[#8CCB55]/50 scale-102'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`${product.name} thumb ${idx}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Info & Purchase Actions */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Category & Telugu Subtitle */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-[#4D963C] uppercase tracking-widest bg-[#EFF7E9] px-3 py-1 rounded-full">
                  {product.category}
                </span>
                <span className="text-xs text-gray-400 font-medium">SKU: {product.sku}</span>
              </div>

              {/* Telugu Name */}
              {product.teluguName && (
                <p className="text-base text-[#4D963C] font-telugu font-bold -mb-2">
                  {product.teluguName}
                </p>
              )}

              {/* Product Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#075B2A] font-serif-title leading-tight">
                {product.name}
              </h1>

              {/* Rating & Review Counter */}
              <div className="flex items-center gap-3 text-xs sm:text-sm">
                <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-xl text-amber-900 font-bold">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{product.rating}</span>
                </div>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className="text-[#667267] hover:text-[#075B2A] font-semibold underline"
                >
                  {product.reviewCount + productReviews.length} Verified Customer Ratings
                </button>
              </div>

              {/* Price Row */}
              <div className="flex items-baseline gap-3 pt-2">
                <span className="text-3xl sm:text-4xl font-black text-[#075B2A]">
                  ₹{currentPrice}
                </span>
                <span className="text-xs text-[#4D963C] font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                  Inclusive of all taxes
                </span>
              </div>

              {/* Short Description */}
              <p className="text-xs sm:text-sm text-[#18251B]/80 leading-relaxed">
                {product.shortDescription}
              </p>

              {/* Pack Size Selector */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-[#18251B] uppercase tracking-wider mb-2">
                  Select Pack Size: <span className="text-[#075B2A] font-extrabold">{selectedPack}</span>
                </label>
                <div className="flex items-center gap-2.5 flex-wrap">
                  {product.packSizeOptions?.map((opt) => (
                    <button
                      key={opt.size}
                      onClick={() => setSelectedPack(opt.size)}
                      className={`px-4 py-2 rounded-2xl text-xs font-bold border transition-all ${
                        selectedPack === opt.size
                          ? 'bg-[#075B2A] text-white border-[#075B2A] shadow-md scale-102'
                          : 'bg-[#FBF8EF] text-gray-700 border-[#E1E9DC] hover:border-[#4D963C]'
                      }`}
                    >
                      <span>{opt.size}</span>
                      <span className="ml-1.5 opacity-80 font-normal">₹{opt.price}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Stock Status Indicator */}
              <div className="flex items-center gap-2 text-xs font-bold">
                {currentStock > 0 ? (
                  <div className="flex items-center gap-1.5 text-emerald-700">
                    <CheckCircle2 className="w-4 h-4 text-[#4D963C]" />
                    <span>In Stock ({currentStock} units ready for immediate harvest dispatch)</span>
                  </div>
                ) : (
                  <div className="text-red-600">Currently Out of Stock</div>
                )}
              </div>
            </div>

            {/* Quantity Selector & Primary Actions */}
            <div className="pt-4 border-t border-[#E1E9DC] space-y-4">
              <div className="flex items-center gap-4">
                {/* Quantity Buttons */}
                <div className="flex items-center bg-[#FBF8EF] border border-[#E1E9DC] rounded-2xl p-1">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="w-9 h-9 flex items-center justify-center text-[#18251B] hover:bg-white rounded-xl disabled:opacity-40 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-extrabold text-sm text-[#075B2A]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(currentStock, q + 1))}
                    disabled={quantity >= currentStock}
                    className="w-9 h-9 flex items-center justify-center text-[#18251B] hover:bg-white rounded-xl disabled:opacity-40 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Subtotal Preview */}
                <div className="text-xs text-[#667267]">
                  Total: <strong className="text-sm text-[#075B2A]">₹{currentPrice * quantity}</strong>
                </div>
              </div>

              {/* Action Buttons: Add to Cart & Buy Now */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={currentStock <= 0}
                  className="flex items-center justify-center gap-2 bg-[#EFF7E9] hover:bg-[#8CCB55] text-[#075B2A] hover:text-[#06451F] border-2 border-[#8CCB55] py-3.5 px-6 rounded-2xl text-sm font-extrabold transition-all duration-200 active:scale-95 disabled:opacity-50"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart {inCartQty > 0 ? `(${inCartQty} in cart)` : ''}</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={currentStock <= 0}
                  className="flex items-center justify-center gap-2 bg-[#075B2A] hover:bg-[#06451F] text-white py-3.5 px-6 rounded-2xl text-sm font-extrabold shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 disabled:opacity-50"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>Buy Now Directly</span>
                </button>
              </div>

              {/* Safe Store Pickup & Guarantees */}
              <div className="grid grid-cols-3 gap-2 pt-3 text-[11px] text-[#667267] font-semibold text-center border-t border-gray-100">
                <div className="p-2 bg-[#FBF8EF] rounded-xl flex flex-col items-center gap-1">
                  <Store className="w-4 h-4 text-[#4D963C]" />
                  <span>Store Pickup (Warangal)</span>
                </div>
                <div className="p-2 bg-[#FBF8EF] rounded-xl flex flex-col items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-[#4D963C]" />
                  <span>100% Pure Guarantee</span>
                </div>
                <div className="p-2 bg-[#FBF8EF] rounded-xl flex flex-col items-center gap-1">
                  <RotateCcw className="w-4 h-4 text-[#4D963C]" />
                  <span>7 Days Return</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Information Tabs Section */}
        <div className="bg-white rounded-3xl border border-[#E1E9DC] p-6 sm:p-8 shadow-sm">
          {/* Tab Navigation Header */}
          <div className="flex items-center gap-2 sm:gap-4 border-b border-[#E1E9DC] pb-4 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('desc')}
              className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === 'desc'
                  ? 'bg-[#075B2A] text-white shadow-sm'
                  : 'text-[#667267] hover:bg-[#EFF7E9] hover:text-[#075B2A]'
              }`}
            >
              Description & Benefits
            </button>
            <button
              onClick={() => setActiveTab('ingredients')}
              className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === 'ingredients'
                  ? 'bg-[#075B2A] text-white shadow-sm'
                  : 'text-[#667267] hover:bg-[#EFF7E9] hover:text-[#075B2A]'
              }`}
            >
              Natural Ingredients
            </button>
            <button
              onClick={() => setActiveTab('nutrition')}
              className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === 'nutrition'
                  ? 'bg-[#075B2A] text-white shadow-sm'
                  : 'text-[#667267] hover:bg-[#EFF7E9] hover:text-[#075B2A]'
              }`}
            >
              Nutritional Facts
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === 'reviews'
                  ? 'bg-[#075B2A] text-white shadow-sm'
                  : 'text-[#667267] hover:bg-[#EFF7E9] hover:text-[#075B2A]'
              }`}
            >
              Customer Reviews ({productReviews.length + 2})
            </button>
          </div>

          {/* Tab 1: Full Description & Benefits */}
          {activeTab === 'desc' && (
            <div className="pt-6 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-[#075B2A] font-serif-title mb-2">
                  About {product.name}
                </h3>
                <p className="text-xs sm:text-sm text-[#18251B]/80 leading-relaxed">
                  {product.fullDescription}
                </p>
              </div>

              {/* Key Benefits Bullet points */}
              <div>
                <h4 className="text-xs font-bold text-[#18251B] uppercase tracking-wider mb-3">
                  Key Health & Wellness Benefits:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.benefits?.map((benefit, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-3 rounded-2xl bg-[#EFF7E9]/70 border border-[#8CCB55]/30"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#4D963C] shrink-0 mt-0.5" />
                      <span className="text-xs font-medium text-[#18251B]">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Storage & Shelf Life Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-[#FBF8EF] rounded-2xl border border-[#E1E9DC]">
                  <h5 className="text-xs font-bold text-[#075B2A] uppercase mb-1">
                    Storage Instructions
                  </h5>
                  <p className="text-xs text-[#667267]">{product.storageInfo}</p>
                </div>
                <div className="p-4 bg-[#FBF8EF] rounded-2xl border border-[#E1E9DC]">
                  <h5 className="text-xs font-bold text-[#075B2A] uppercase mb-1">Shelf Life</h5>
                  <p className="text-xs text-[#667267]">{product.shelfLife}</p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Ingredients */}
          {activeTab === 'ingredients' && (
            <div className="pt-6 space-y-4">
              <h3 className="text-lg font-bold text-[#075B2A] font-serif-title">
                100% Traditional Native Ingredients
              </h3>
              <p className="text-xs sm:text-sm text-[#667267]">
                We publish all ingredients transparently. No hidden chemical additives, anti-caking agents, or artificial aromas.
              </p>
              <div className="flex flex-wrap gap-2.5 pt-2">
                {product.ingredients?.map((ing, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-2 bg-[#EFF7E9] text-[#075B2A] font-bold text-xs px-3.5 py-2 rounded-2xl border border-[#8CCB55]/40"
                  >
                    <Leaf className="w-3.5 h-3.5 text-[#4D963C]" />
                    <span>{ing}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Nutritional Facts */}
          {activeTab === 'nutrition' && (
            <div className="pt-6 space-y-4">
              <h3 className="text-lg font-bold text-[#075B2A] font-serif-title">
                Nutritional Profile (Per 100g serving)
              </h3>
              <div className="max-w-md overflow-hidden rounded-2xl border border-[#E1E9DC]">
                <table className="w-full text-xs sm:text-sm text-left">
                  <thead className="bg-[#EFF7E9] text-[#075B2A] font-bold">
                    <tr>
                      <th className="p-3">Nutrient / Parameter</th>
                      <th className="p-3 text-right">Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E1E9DC]">
                    {product.nutritionalInfo?.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="p-3 font-medium text-[#18251B]">{item.label}</td>
                        <td className="p-3 font-bold text-[#075B2A] text-right">{item.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 4: Customer Reviews & Submission */}
          {activeTab === 'reviews' && (
            <div className="pt-6 space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left: Existing Reviews List */}
                <div className="lg:col-span-7 space-y-4">
                  <h3 className="text-lg font-bold text-[#075B2A] font-serif-title">
                    Customer Feedback & Experience
                  </h3>

                  {/* Sample Static Verified Review */}
                  <div className="p-4 rounded-2xl bg-[#FBF8EF] border border-[#E1E9DC] space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#075B2A] text-white flex items-center justify-center font-bold text-xs">
                          S
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#18251B]">Sravani Varma</p>
                          <p className="text-[10px] text-[#4D963C] font-semibold">
                            ✓ Verified Buyer • Hyderabad
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-[#18251B]/80 leading-relaxed">
                      "Extremely fresh and authentic packaging. The natural aroma upon opening is unmistakable. Will definitely order on a monthly recurring basis!"
                    </p>
                  </div>

                  {/* Dynamically Submitted Reviews */}
                  {productReviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-4 rounded-2xl bg-[#FBF8EF] border border-[#E1E9DC] space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-[#4D963C] text-white flex items-center justify-center font-bold text-xs">
                            {rev.userName[0]}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-[#18251B]">{rev.userName}</p>
                            <p className="text-[10px] text-[#4D963C] font-semibold">
                              ✓ Verified Buyer • {rev.userLocation || 'India'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center text-amber-400">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-[#18251B]/80 leading-relaxed">{rev.comment}</p>
                      <span className="text-[10px] text-gray-400 block">{rev.date}</span>
                    </div>
                  ))}
                </div>

                {/* Right: Write a Review Form */}
                <div className="lg:col-span-5 bg-[#EFF7E9] p-5 rounded-3xl border border-[#8CCB55]/40 space-y-4">
                  <h4 className="text-sm font-bold text-[#075B2A] font-serif-title uppercase tracking-wider">
                    Write a Product Review
                  </h4>
                  <form onSubmit={handleReviewSubmit} className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-[#18251B] mb-1">
                        Your Rating
                      </label>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setNewRating(star)}
                            className="p-1 hover:scale-110 transition-transform"
                          >
                            <Star
                              className={`w-6 h-6 ${
                                star <= newRating
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#18251B] mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={reviewerName}
                        onChange={(e) => setReviewerName(e.target.value)}
                        placeholder="e.g. Ananya Reddy"
                        className="w-full bg-white text-xs px-3.5 py-2 rounded-xl border border-[#E1E9DC] focus:outline-none focus:border-[#075B2A]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#18251B] mb-1">
                        City / Location
                      </label>
                      <input
                        type="text"
                        value={reviewerLocation}
                        onChange={(e) => setReviewerLocation(e.target.value)}
                        placeholder="e.g. Hyderabad"
                        className="w-full bg-white text-xs px-3.5 py-2 rounded-xl border border-[#E1E9DC] focus:outline-none focus:border-[#075B2A]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#18251B] mb-1">
                        Your Review Comment *
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Share your experience with this natural product..."
                        className="w-full bg-white text-xs p-3 rounded-xl border border-[#E1E9DC] focus:outline-none focus:border-[#075B2A]"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmittingReview}
                      className="w-full bg-[#075B2A] hover:bg-[#06451F] text-white text-xs font-bold py-2.5 rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50"
                    >
                      {isSubmittingReview ? 'Submitting...' : 'Submit Verified Review'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="space-y-6 pt-6">
            <h2 className="text-xl sm:text-2xl font-bold text-[#075B2A] font-serif-title">
              Frequently Bought Together in {product.category}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

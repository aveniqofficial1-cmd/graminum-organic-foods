import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star, Plus, Minus, Check } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, className = '' }) => {
  const { addToCart, updateQuantity, getItemQuantity } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [selectedPack, setSelectedPack] = useState(product.packSize);
  const [imageLoaded, setImageLoaded] = useState(false);

  const isFavorited = isInWishlist(product.id);
  const currentQuantity = getItemQuantity(product.id, selectedPack);

  // Selected pack price
  const packOption = product.packSizeOptions?.find((opt) => opt.size === selectedPack);
  const currentPrice = packOption ? packOption.price : product.price;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, selectedPack, 1);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    updateQuantity(product.id, selectedPack, currentQuantity + 1);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    updateQuantity(product.id, selectedPack, currentQuantity - 1);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id, product.name);
  };

  return (
    <div
      className={`group relative bg-white rounded-2xl border border-[#E1E9DC] overflow-hidden flex flex-col justify-between shadow-card-hover ${className}`}
    >
      {/* Top Badges & Wishlist */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex flex-col gap-1">
          {product.isOrganic && (
            <span className="inline-flex items-center gap-1 bg-[#EFF7E9] text-[#075B2A] text-[11px] font-bold px-2 py-0.5 rounded-full border border-[#8CCB55] shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4D963C]"></span>
              100% Organic
            </span>
          )}
          {product.isBestseller && (
            <span className="bg-[#E9A23B] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm w-max">
              Bestseller
            </span>
          )}
        </div>

        <button
          onClick={handleWishlist}
          className={`pointer-events-auto p-2 rounded-full backdrop-blur-md transition-all duration-200 ${
            isFavorited
              ? 'bg-red-50 text-red-500 shadow-md scale-105'
              : 'bg-white/80 text-gray-500 hover:text-red-500 hover:bg-white shadow-sm'
          }`}
          aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-red-500' : ''}`} />
        </button>
      </div>

      {/* Image Container */}
      <Link
        to={`/product/${product.slug}`}
        className="block relative bg-[#FBF8EF] aspect-4/3 sm:aspect-square overflow-hidden"
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500 ease-out ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
        {!imageLoaded && (
          <div className="absolute inset-0 bg-[#EFF7E9] flex items-center justify-center animate-pulse">
            <span className="text-3xl">🌾</span>
          </div>
        )}
      </Link>

      {/* Product Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Telugu Subtitle */}
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className="text-[11px] font-semibold text-[#4D963C] uppercase tracking-wider">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-xs text-amber-500 font-medium">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-gray-700 font-bold">{product.rating}</span>
              <span className="text-gray-400 text-[10px]">({product.reviewCount})</span>
            </div>
          </div>

          {/* Telugu Name if available */}
          {product.teluguName && (
            <p className="text-[12px] text-[#4D963C] font-telugu font-semibold line-clamp-1 mb-0.5">
              {product.teluguName}
            </p>
          )}

          {/* Product Name */}
          <Link
            to={`/product/${product.slug}`}
            className="block text-sm sm:text-base font-bold text-[#18251B] hover:text-[#075B2A] transition-colors line-clamp-2 leading-snug"
          >
            {product.name}
          </Link>
        </div>

        {/* Pack Size Selector & Price */}
        <div className="mt-3 pt-3 border-t border-[#E1E9DC]">
          {/* Pack options pill */}
          {product.packSizeOptions && product.packSizeOptions.length > 1 ? (
            <div className="flex items-center gap-1.5 mb-2.5 overflow-x-auto pb-1 no-scrollbar">
              {product.packSizeOptions.map((opt) => (
                <button
                  key={opt.size}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedPack(opt.size);
                  }}
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border transition-all ${
                    selectedPack === opt.size
                      ? 'bg-[#075B2A] text-white border-[#075B2A] shadow-xs'
                      : 'bg-[#FBF8EF] text-[#667267] border-[#E1E9DC] hover:border-[#4D963C]'
                  }`}
                >
                  {opt.size}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-[11px] text-[#667267] mb-2 font-medium">
              Pack size: <span className="text-[#18251B] font-semibold">{product.packSize}</span>
            </div>
          )}

          {/* Price and Add to Cart Row */}
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg sm:text-xl font-extrabold text-[#075B2A]">
                  ₹{currentPrice}
                </span>
              </div>
            </div>

            {/* Cart Button or Counter */}
            {currentQuantity > 0 ? (
              <div className="flex items-center bg-[#EFF7E9] border border-[#8CCB55] rounded-xl p-0.5 shadow-sm">
                <button
                  onClick={handleDecrement}
                  className="w-7 h-7 flex items-center justify-center text-[#075B2A] hover:bg-[#8CCB55] hover:text-white rounded-lg transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-7 text-center text-xs font-bold text-[#075B2A]">
                  {currentQuantity}
                </span>
                <button
                  onClick={handleIncrement}
                  className="w-7 h-7 flex items-center justify-center text-[#075B2A] hover:bg-[#8CCB55] hover:text-white rounded-lg transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleAddToCart}
                className="flex items-center gap-1.5 bg-[#075B2A] hover:bg-[#06451F] text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all duration-200 active:scale-95 shadow-sm"
                aria-label={`Add ${product.name} to cart`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

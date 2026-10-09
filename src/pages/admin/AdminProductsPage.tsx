import React, { useState, useRef } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Eye,
  Filter,
  Package,
  Layers,
  Sparkles,
  X,
  Upload,
  FileText,
  Download,
  Image as ImageIcon,
  RotateCcw,
  Check,
  ArrowUpDown,
  AlertCircle,
} from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { useToast } from '../../context/ToastContext';
import { Product, ProductCategory, ProductPackOption } from '../../types';

export const AdminProductsPage: React.FC = () => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    bulkUploadProducts,
    resetToDefaultCatalog,
    categories,
  } = useProducts();

  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [stockFilter, setStockFilter] = useState<'All' | 'InStock' | 'Low' | 'Out'>('All');

  // Single Product Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Single Product Form Fields
  const [formName, setFormName] = useState('');
  const [formTeluguName, setFormTeluguName] = useState('');
  const [formCategory, setFormCategory] = useState<ProductCategory>('Personal Care');
  const [formDescription, setFormDescription] = useState('');
  const [formShortDescription, setFormShortDescription] = useState('');
  const [formIngredients, setFormIngredients] = useState('');
  const [formImage, setFormImage] = useState('');
  const [imageUploadType, setImageUploadType] = useState<'file' | 'url'>('file');
  const [formPrice, setFormPrice] = useState('180');
  const [formOriginalPrice, setFormOriginalPrice] = useState('220');
  const [formStock, setFormStock] = useState('50');
  const [formIsFeatured, setFormIsFeatured] = useState(false);
  const [formIsBestseller, setFormIsBestseller] = useState(false);
  const [formPackSizes, setFormPackSizes] = useState('500g, 1kg, 2kg');
  const [formShelfLife, setFormShelfLife] = useState('9 Months');
  const [formStorageInfo, setFormStorageInfo] = useState('Store in an airtight container in a cool dry place.');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Bulk Upload Modal State
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkParsedProducts, setBulkParsedProducts] = useState<Product[]>([]);
  const [bulkFileName, setBulkFileName] = useState('');
  const [bulkReplaceMode, setBulkReplaceMode] = useState(false);
  const [isDraggingBulk, setIsDraggingBulk] = useState(false);
  const bulkFileInputRef = useRef<HTMLInputElement>(null);

  // Preset Image Options for Convenience
  const PRESET_IMAGES = [
    { label: 'Millets / Grains', url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80' },
    { label: 'Wood Pressed Oil', url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80' },
    { label: 'Sprouted Cere Mix', url: 'https://images.unsplash.com/photo-1546554137-f86b9593a222?auto=format&fit=crop&w=800&q=80' },
    { label: 'Raw Wild Honey', url: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80' },
    { label: 'Herbal Sunnipindi', url: 'https://images.unsplash.com/photo-1608248597359-009772a08f5d?auto=format&fit=crop&w=800&q=80' },
  ];

  // Filtering logic
  const filteredProducts = products.filter((p: Product) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(q) ||
      (p.teluguName && p.teluguName.toLowerCase().includes(q)) ||
      p.category.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q);

    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;

    const matchesStock =
      stockFilter === 'All' ||
      (stockFilter === 'InStock' && p.stock >= 15) ||
      (stockFilter === 'Low' && p.stock > 0 && p.stock < 15) ||
      (stockFilter === 'Out' && p.stock === 0);

    return matchesSearch && matchesCategory && matchesStock;
  });

  // Handle Image File Upload using FileReader (Base64)
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (JPG, PNG, WebP).', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setFormImage(event.target.result as string);
        showToast('Image uploaded and preview generated!', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleOpenAddModal = () => {
    setEditingProductId(null);
    setFormName('');
    setFormTeluguName('');
    setFormCategory('Personal Care');
    setFormDescription('');
    setFormShortDescription('');
    setFormIngredients('');
    setFormImage(PRESET_IMAGES[0].url);
    setImageUploadType('file');
    setFormPrice('180');
    setFormOriginalPrice('220');
    setFormStock('50');
    setFormIsFeatured(true);
    setFormIsBestseller(false);
    setFormPackSizes('500g, 1kg, 2kg');
    setFormShelfLife('9 Months');
    setFormStorageInfo('Store in an airtight container in a cool dry place.');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p: Product) => {
    setEditingProductId(p.id);
    setFormName(p.name);
    setFormTeluguName(p.teluguName || '');
    setFormCategory(p.category);
    setFormDescription(p.fullDescription);
    setFormShortDescription(p.shortDescription);
    setFormIngredients(p.ingredients?.join(', ') || '');
    setFormImage(p.image);
    setImageUploadType(p.image.startsWith('data:') ? 'file' : 'url');
    setFormPrice(p.price.toString());
    setFormOriginalPrice(p.originalPrice?.toString() || '');
    setFormStock(p.stock.toString());
    setFormIsFeatured(p.isFeatured || false);
    setFormIsBestseller(p.isBestseller || false);
    setFormPackSizes(p.packSizeOptions?.map((ps) => ps.size).join(', ') || '500g, 1kg');
    setFormShelfLife(p.shelfLife || '9 Months');
    setFormStorageInfo(p.storageInfo || 'Store in an airtight container in a cool dry place.');
    setIsModalOpen(true);
  };

  const handleDeleteProduct = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from the active product catalog?`)) {
      deleteProduct(id);
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formCategory || !formPrice) {
      showToast('Please fill all mandatory fields.', 'error');
      return;
    }

    const priceNum = Number(formPrice);
    const stockNum = Number(formStock) || 0;

    const sizesArr: ProductPackOption[] = formPackSizes
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((size, idx) => ({
        size,
        price: Math.round(priceNum * (idx === 0 ? 1 : idx === 1 ? 1.9 : 3.6)),
        stock: Math.round(stockNum * (idx === 0 ? 0.6 : 0.4)),
      }));

    const finalPackOptions =
      sizesArr.length > 0
        ? sizesArr
        : [{ size: '500g', price: priceNum, stock: stockNum }];

    const ingredientsArr = formIngredients
      .split(',')
      .map((i) => i.trim())
      .filter(Boolean);

    if (editingProductId) {
      updateProduct(editingProductId, {
        name: formName.trim(),
        teluguName: formTeluguName.trim() || undefined,
        category: formCategory,
        fullDescription: formDescription || 'Authentic traditional farm produce from Telugu soil.',
        shortDescription: formShortDescription || '100% pure farm produce.',
        ingredients: ingredientsArr.length > 0 ? ingredientsArr : ['100% Pure Farm Ingredients'],
        image: formImage || PRESET_IMAGES[0].url,
        price: priceNum,
        originalPrice: Number(formOriginalPrice) || undefined,
        stock: stockNum,
        packSize: finalPackOptions[0]?.size || '500g',
        packSizeOptions: finalPackOptions,
        isFeatured: formIsFeatured,
        isBestseller: formIsBestseller,
        shelfLife: formShelfLife,
        storageInfo: formStorageInfo,
      });
    } else {
      addProduct({
        name: formName.trim(),
        teluguName: formTeluguName.trim() || undefined,
        slug: formName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, ''),
        category: formCategory,
        fullDescription: formDescription || 'Authentic traditional farm produce from Telugu soil.',
        shortDescription: formShortDescription || '100% pure farm produce.',
        price: priceNum,
        originalPrice: Number(formOriginalPrice) || undefined,
        packSize: finalPackOptions[0]?.size || '500g',
        image: formImage || PRESET_IMAGES[0].url,
        gallery: [formImage || PRESET_IMAGES[0].url],
        packSizeOptions: finalPackOptions,
        stock: stockNum,
        sku: `GRM-SKU-${Date.now().toString().slice(-4)}`,
        rating: 4.9,
        reviewCount: 1,
        isFeatured: formIsFeatured,
        isBestseller: formIsBestseller,
        isOrganic: true,
        published: true,
        ingredients: ingredientsArr.length > 0 ? ingredientsArr : ['100% Pure Farm Produce'],
        nutritionalInfo: [
          { label: 'Energy', value: '340 kcal / 100g' },
          { label: 'Protein', value: '11 g' },
        ],
        benefits: ['100% pure farm nourishment', 'Zero chemical additives', 'Farm direct'],
        storageInfo: formStorageInfo,
        shelfLife: formShelfLife,
      });
    }

    setIsModalOpen(false);
  };

  // ================= BULK CSV & JSON UPLOAD HANDLERS =================
  const handleBulkFileSelected = (file: File) => {
    setBulkFileName(file.name);
    const reader = new FileReader();

    if (file.name.endsWith('.json')) {
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const parsed = JSON.parse(content);
          if (Array.isArray(parsed)) {
            const sanitized: Product[] = parsed.map((item, idx) => ({
              id: item.id || `grm-json-${Date.now()}-${idx}`,
              name: item.name || `Farm Harvest ${idx + 1}`,
              teluguName: item.teluguName || '',
              slug: item.slug || (item.name || `harvest-${idx}`).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
              category: (item.category as ProductCategory) || 'Personal Care',
              price: Number(item.price) || 150,
              originalPrice: item.originalPrice ? Number(item.originalPrice) : undefined,
              packSize: item.packSize || '500g',
              packSizeOptions: Array.isArray(item.packSizeOptions) && item.packSizeOptions.length > 0
                ? item.packSizeOptions
                : [{ size: '500g', price: Number(item.price) || 150, stock: Number(item.stock) || 50 }],
              stock: Number(item.stock) || 50,
              sku: item.sku || `GRM-${Date.now().toString().slice(-4)}-${idx}`,
              rating: Number(item.rating) || 4.8,
              reviewCount: Number(item.reviewCount) || 1,
              image: item.image || PRESET_IMAGES[0].url,
              gallery: Array.isArray(item.gallery) ? item.gallery : [item.image || PRESET_IMAGES[0].url],
              shortDescription: item.shortDescription || '100% Natural Farm Produce',
              fullDescription: item.fullDescription || 'Traditional chemical-free farm produce.',
              ingredients: Array.isArray(item.ingredients) ? item.ingredients : ['100% Pure Farm Produce'],
              nutritionalInfo: Array.isArray(item.nutritionalInfo)
                ? item.nutritionalInfo
                : [{ label: 'Energy', value: '350 kcal' }],
              benefits: Array.isArray(item.benefits) ? item.benefits : ['Pure farm wellness'],
              storageInfo: item.storageInfo || 'Store in a cool dry place.',
              shelfLife: item.shelfLife || '9 Months',
              isOrganic: true,
              isFeatured: !!item.isFeatured,
              isBestseller: !!item.isBestseller,
              published: true,
              createdAt: item.createdAt || new Date().toISOString(),
            }));
            setBulkParsedProducts(sanitized);
            showToast(`Parsed ${sanitized.length} products from JSON file!`, 'success');
          } else {
            showToast('JSON must contain an array of product objects.', 'error');
          }
        } catch (err) {
          showToast('Failed to parse JSON file. Please check syntax.', 'error');
        }
      };
      reader.readAsText(file);
    } else {
      // Parse CSV File
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const lines = text.split(/\r\n|\n/).filter((l) => l.trim().length > 0);
          if (lines.length < 2) {
            showToast('CSV must include a header row and at least one product row.', 'error');
            return;
          }

          const headers = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/[^a-z0-9]/g, ''));
          const parsedProducts: Product[] = [];

          for (let i = 1; i < lines.length; i++) {
            // Split CSV respecting quoted values
            const rowValues = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map((v) =>
              v.trim().replace(/^"|"$/g, '')
            );

            if (rowValues.length < 2 || !rowValues[0]) continue;

            const name = rowValues[headers.indexOf('name')] || rowValues[0];
            const teluguName = headers.indexOf('teluguname') !== -1 ? rowValues[headers.indexOf('teluguname')] : '';
            const categoryRaw = headers.indexOf('category') !== -1 ? rowValues[headers.indexOf('category')] : 'Personal Care';
            const price = Number(rowValues[headers.indexOf('price')] || rowValues[1]) || 180;
            const origPrice = headers.indexOf('originalprice') !== -1 ? Number(rowValues[headers.indexOf('originalprice')]) : undefined;
            const stock = headers.indexOf('stock') !== -1 ? Number(rowValues[headers.indexOf('stock')]) : 50;
            const packSizes = headers.indexOf('packsizes') !== -1 ? rowValues[headers.indexOf('packsizes')] : '500g, 1kg';
            const image = headers.indexOf('image') !== -1 && rowValues[headers.indexOf('image')] ? rowValues[headers.indexOf('image')] : PRESET_IMAGES[0].url;
            const shortDesc = headers.indexOf('shortdescription') !== -1 ? rowValues[headers.indexOf('shortdescription')] : '100% natural farm harvest';
            const fullDesc = headers.indexOf('fulldescription') !== -1 ? rowValues[headers.indexOf('fulldescription')] : 'Sourced directly from native traditional farmers.';
            const isFeatured = headers.indexOf('isfeatured') !== -1 ? rowValues[headers.indexOf('isfeatured')].toLowerCase() === 'true' : true;
            const isBestseller = headers.indexOf('isbestseller') !== -1 ? rowValues[headers.indexOf('isbestseller')].toLowerCase() === 'true' : false;

            const sizesArr = packSizes.split(';').join(',').split(',').map((s) => s.trim()).filter(Boolean);
            const packSizeOptions = sizesArr.map((sz, sIdx) => ({
              size: sz,
              price: Math.round(price * (sIdx === 0 ? 1 : sIdx === 1 ? 1.9 : 3.6)),
              stock: Math.round(stock * (sIdx === 0 ? 0.6 : 0.4)),
            }));

            parsedProducts.push({
              id: `grm-csv-${Date.now()}-${i}`,
              name,
              teluguName: teluguName || undefined,
              slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
              category: (categoryRaw as ProductCategory) || 'Grains & Cereals',
              price,
              originalPrice: origPrice,
              packSize: sizesArr[0] || '500g',
              packSizeOptions: packSizeOptions.length > 0 ? packSizeOptions : [{ size: '500g', price, stock }],
              stock,
              sku: `GRM-CSV-${Date.now().toString().slice(-4)}-${i}`,
              rating: 4.8,
              reviewCount: 1,
              image,
              gallery: [image],
              shortDescription: shortDesc,
              fullDescription: fullDesc,
              ingredients: ['100% Natural Farm Harvest'],
              nutritionalInfo: [
                { label: 'Energy', value: '350 kcal' },
                { label: 'Fiber', value: '8.5 g' },
              ],
              benefits: ['100% chemical-free', 'Rich in natural micronutrients'],
              storageInfo: 'Store in an airtight container.',
              shelfLife: '9 Months',
              isOrganic: true,
              isFeatured,
              isBestseller,
              published: true,
              createdAt: new Date().toISOString(),
            });
          }

          setBulkParsedProducts(parsedProducts);
          showToast(`Successfully parsed ${parsedProducts.length} rows from CSV!`, 'success');
        } catch (err) {
          showToast('Failed to process CSV file. Ensure valid comma separation.', 'error');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleConfirmBulkUpload = () => {
    if (bulkParsedProducts.length === 0) {
      showToast('No products ready for upload.', 'error');
      return;
    }

    bulkUploadProducts(bulkParsedProducts, bulkReplaceMode);
    setIsBulkModalOpen(false);
    setBulkParsedProducts([]);
    setBulkFileName('');
  };

  // Download Sample CSV Template
  const handleDownloadCsvTemplate = () => {
    const csvContent =
      'Name,TeluguName,Category,Price,OriginalPrice,Stock,PackSizes,Image,ShortDescription,FullDescription,IsFeatured,IsBestseller\n' +
      '"Reetha Shampoo","కుంకుడుకాయల షాంపూ","Personal Care",80,100,60,"450 ml","/assets/products/reetha-shampoo.jpeg","100% natural chemical-free hair cleanser","Herbal soapnut shampoo for silky strong hair.",true,true\n' +
      '"Orthocare Plus Oil","ఆర్థోకేర్ ప్లస్ ఆయిల్","Herbal Oils",50,70,50,"60 ml","/assets/products/orthocare-plus-oil.jpeg","Targeted herbal joint and knee pain relief","Ayurvedic therapeutic joint oil.",true,true\n' +
      '"Pure Natural Honey","స్వచ్ఛమైన తేనె","Natural Foods",250,300,60,"500 g","/assets/products/honey.jpeg","Raw unfiltered forest honey","Pure natural immunity booster.",true,true\n';

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'graminum_products_sample_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Sample CSV template downloaded!', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-extrabold text-[#4D963C] uppercase tracking-wider">
            Inventory & Catalog Controls
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#075B2A] font-serif-title">
            Product Catalog Management
          </h1>
          <p className="text-xs text-[#667267] mt-0.5">
            Add new harvests with image file upload, manage stock, or import inventory in bulk via CSV/JSON.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsBulkModalOpen(true)}
            className="inline-flex items-center gap-2 bg-[#EFF7E9] hover:bg-[#8CCB55]/30 text-[#075B2A] border border-[#8CCB55] text-xs sm:text-sm font-bold px-4 py-2.5 rounded-2xl shadow-2xs transition-all active:scale-95 cursor-pointer"
          >
            <Upload className="w-4 h-4 text-[#4D963C]" />
            <span>Bulk Upload (CSV / JSON)</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 bg-[#075B2A] hover:bg-[#06451F] text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-2xl shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Single Product</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white rounded-3xl border border-[#E1E9DC] p-4 sm:p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search Box */}
          <div className="sm:col-span-5 relative">
            <input
              type="text"
              placeholder="Search products by title, Telugu name, or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FBF8EF] text-xs px-3.5 pl-9 py-2.5 rounded-xl border border-[#E1E9DC] focus:outline-none focus:border-[#075B2A]"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Dropdown */}
          <div className="sm:col-span-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-[#FBF8EF] text-xs px-3.5 py-2.5 rounded-xl border border-[#E1E9DC] focus:outline-none focus:border-[#075B2A] font-semibold text-gray-700"
            >
              <option value="All">All Categories ({products.length})</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Stock Filter Pills */}
          <div className="sm:col-span-4 flex gap-1.5 overflow-x-auto pb-1">
            <button
              onClick={() => setStockFilter('All')}
              className={`flex-1 text-[11px] font-bold py-2 px-2 rounded-xl border transition-all whitespace-nowrap ${
                stockFilter === 'All'
                  ? 'bg-[#075B2A] text-white border-[#075B2A]'
                  : 'bg-[#FBF8EF] text-gray-600 border-[#E1E9DC]'
              }`}
            >
              All ({products.length})
            </button>
            <button
              onClick={() => setStockFilter('InStock')}
              className={`flex-1 text-[11px] font-bold py-2 px-2 rounded-xl border transition-all whitespace-nowrap ${
                stockFilter === 'InStock'
                  ? 'bg-emerald-700 text-white border-emerald-700'
                  : 'bg-[#FBF8EF] text-emerald-800 border-[#E1E9DC]'
              }`}
            >
              In Stock
            </button>
            <button
              onClick={() => setStockFilter('Low')}
              className={`flex-1 text-[11px] font-bold py-2 px-2 rounded-xl border transition-all whitespace-nowrap ${
                stockFilter === 'Low'
                  ? 'bg-amber-600 text-white border-amber-600'
                  : 'bg-[#FBF8EF] text-amber-800 border-[#E1E9DC]'
              }`}
            >
              Low Stock
            </button>
            <button
              onClick={() => setStockFilter('Out')}
              className={`flex-1 text-[11px] font-bold py-2 px-2 rounded-xl border transition-all whitespace-nowrap ${
                stockFilter === 'Out'
                  ? 'bg-red-600 text-white border-red-600'
                  : 'bg-[#FBF8EF] text-red-800 border-[#E1E9DC]'
              }`}
            >
              Out
            </button>
          </div>
        </div>

        {/* Reset Catalog Helper Notice */}
        <div className="flex items-center justify-between pt-2 border-t border-[#E1E9DC] text-xs">
          <span className="text-gray-500">
            Showing <strong>{filteredProducts.length}</strong> of <strong>{products.length}</strong> items in live catalog
          </span>
          <button
            onClick={() => {
              if (window.confirm('Reset catalog back to initial default items? This will restore initial Telugu harvests.')) {
                resetToDefaultCatalog();
              }
            }}
            className="text-gray-500 hover:text-[#075B2A] font-semibold inline-flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Default Catalog</span>
          </button>
        </div>
      </div>

      {/* ================= PRODUCTS TABLE ================= */}
      <div className="bg-white rounded-3xl border border-[#E1E9DC] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E1E9DC] bg-[#EFF7E9]/40 text-[#075B2A] font-extrabold uppercase text-[10px]">
                <th className="py-3.5 px-4">Product Details</th>
                <th className="py-3.5 px-3">Category</th>
                <th className="py-3.5 px-3">Price</th>
                <th className="py-3.5 px-3">Pack Sizes</th>
                <th className="py-3.5 px-3">Stock Units</th>
                <th className="py-3.5 px-3">Badges</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E1E9DC]">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((prod: Product) => (
                  <tr key={prod.id} className="hover:bg-[#FBF8EF]/60 transition-colors">
                    {/* Thumbnail & Title */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-12 h-12 object-cover rounded-xl border shrink-0 bg-[#EFF7E9]"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-[#18251B] truncate max-w-[240px]">{prod.name}</p>
                          {prod.teluguName && (
                            <p className="text-[11px] text-[#4D963C] font-semibold">{prod.teluguName}</p>
                          )}
                          <p className="text-[10px] text-gray-400">SKU: {prod.sku}</p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-3 text-gray-600 font-medium">
                      {prod.category}
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-3">
                      <span className="font-extrabold text-[#075B2A] text-sm">₹{prod.price}</span>
                    </td>

                    {/* Pack Variants */}
                    <td className="py-3.5 px-3">
                      <div className="flex gap-1 flex-wrap max-w-[160px]">
                        {prod.packSizeOptions?.map((ps: ProductPackOption, idx: number) => (
                          <span
                            key={idx}
                            className="bg-[#EFF7E9] text-[#075B2A] text-[10px] font-bold px-1.5 py-0.5 rounded-md border border-[#8CCB55]/50"
                          >
                            {ps.size}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Stock Status */}
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-block font-extrabold px-2.5 py-0.5 rounded-full text-[11px] ${
                          prod.stock === 0
                            ? 'bg-red-100 text-red-700'
                            : prod.stock < 15
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {prod.stock} units
                      </span>
                    </td>

                    {/* Badges */}
                    <td className="py-3.5 px-3">
                      <div className="flex gap-1 flex-wrap">
                        {prod.isBestseller && (
                          <span className="bg-[#E9A23B]/20 text-[#B56B0E] text-[10px] font-black px-1.5 py-0.5 rounded">
                            Bestseller
                          </span>
                        )}
                        {prod.isFeatured && (
                          <span className="bg-[#075B2A]/10 text-[#075B2A] text-[10px] font-bold px-1.5 py-0.5 rounded">
                            Featured
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right space-x-1.5">
                      <button
                        onClick={() => handleOpenEditModal(prod)}
                        className="p-1.5 text-gray-500 hover:text-[#075B2A] hover:bg-[#EFF7E9] rounded-lg transition-colors cursor-pointer"
                        title="Edit Product"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(prod.id, prod.name)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    <Package className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                    <p className="font-bold text-[#18251B]">No matching products found</p>
                    <p className="text-[11px] text-gray-400 mt-1">Try resetting search filters or upload new inventory items.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODAL 1: SINGLE PRODUCT CREATE / EDIT ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setIsModalOpen(false)}
          ></div>

          <div className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full z-10 shadow-2xl space-y-5 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E1E9DC]">
              <div>
                <h2 className="text-lg font-bold text-[#075B2A] font-serif-title">
                  {editingProductId ? 'Edit Product Details' : 'Upload New Harvest SKU'}
                </h2>
                <p className="text-xs text-[#667267]">
                  Publish single product items with image upload & Telugu localization.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              {/* Product Titles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#18251B] mb-1">
                    Product Title (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Unpolished Foxtail Millet (కొర్రలు)"
                    className="w-full bg-[#FBF8EF] text-xs px-3.5 py-2.5 rounded-xl border border-[#E1E9DC] focus:outline-none focus:border-[#075B2A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#18251B] mb-1">
                    Telugu Title (గ్రామీణ నామం)
                  </label>
                  <input
                    type="text"
                    value={formTeluguName}
                    onChange={(e) => setFormTeluguName(e.target.value)}
                    placeholder="e.g. సహజ కొర్రల ధాన్యం"
                    className="w-full bg-[#FBF8EF] text-xs px-3.5 py-2.5 rounded-xl border border-[#E1E9DC] focus:outline-none focus:border-[#075B2A]"
                  />
                </div>
              </div>

              {/* Category & Base Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#18251B] mb-1">Category *</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as ProductCategory)}
                    className="w-full bg-[#FBF8EF] text-xs px-3.5 py-2.5 rounded-xl border border-[#E1E9DC] focus:outline-none focus:border-[#075B2A]"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#18251B] mb-1">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full bg-[#FBF8EF] text-xs px-3.5 py-2.5 rounded-xl border border-[#E1E9DC] focus:outline-none focus:border-[#075B2A]"
                  />
                </div>
              </div>

              {/* Stock and Pack Sizes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#18251B] mb-1">
                    Initial Available Stock (Units) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formStock}
                    onChange={(e) => setFormStock(e.target.value)}
                    className="w-full bg-[#FBF8EF] text-xs px-3.5 py-2.5 rounded-xl border border-[#E1E9DC] focus:outline-none focus:border-[#075B2A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#18251B] mb-1">
                    Pack Variants (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={formPackSizes}
                    onChange={(e) => setFormPackSizes(e.target.value)}
                    placeholder="e.g. 500g, 1kg, 2kg"
                    className="w-full bg-[#FBF8EF] text-xs px-3.5 py-2.5 rounded-xl border border-[#E1E9DC] focus:outline-none focus:border-[#075B2A]"
                  />
                </div>
              </div>

              {/* ================= IMAGE UPLOAD SECTION ================= */}
              <div className="p-4 bg-[#FBF8EF] rounded-2xl border border-[#E1E9DC] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#18251B] flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-[#075B2A]" />
                    <span>Product Image Upload *</span>
                  </label>
                  <div className="flex rounded-xl bg-white p-0.5 border border-[#E1E9DC] text-[11px]">
                    <button
                      type="button"
                      onClick={() => setImageUploadType('file')}
                      className={`px-3 py-1 rounded-lg font-bold transition-all ${
                        imageUploadType === 'file'
                          ? 'bg-[#075B2A] text-white'
                          : 'text-gray-600 hover:text-[#075B2A]'
                      }`}
                    >
                      File Upload
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageUploadType('url')}
                      className={`px-3 py-1 rounded-lg font-bold transition-all ${
                        imageUploadType === 'url'
                          ? 'bg-[#075B2A] text-white'
                          : 'text-gray-600 hover:text-[#075B2A]'
                      }`}
                    >
                      Image URL
                    </button>
                  </div>
                </div>

                {imageUploadType === 'file' ? (
                  <div className="space-y-3">
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-[#8CCB55] hover:border-[#075B2A] bg-white p-4 rounded-2xl text-center cursor-pointer transition-colors"
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        className="hidden"
                      />
                      <Upload className="w-6 h-6 text-[#075B2A] mx-auto mb-1.5" />
                      <p className="text-xs font-bold text-[#075B2A]">
                        Click to select or drop product image
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        Supports PNG, JPG, JPEG, WebP (Converted to Base64)
                      </p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/photo-..."
                      value={formImage}
                      onChange={(e) => setFormImage(e.target.value)}
                      className="w-full bg-white text-xs px-3.5 py-2.5 rounded-xl border border-[#E1E9DC] focus:outline-none focus:border-[#075B2A]"
                    />
                  </div>
                )}

                {/* Quick Presets Picker */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  <span className="text-[10px] text-gray-500 font-bold uppercase">Presets:</span>
                  {PRESET_IMAGES.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setFormImage(preset.url)}
                      className="text-[10px] bg-white hover:bg-[#EFF7E9] text-[#075B2A] border border-[#E1E9DC] px-2 py-0.5 rounded-md font-semibold"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                {/* Live Image Preview Thumbnail */}
                {formImage && (
                  <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-[#E1E9DC]">
                    <img
                      src={formImage}
                      alt="Preview"
                      className="w-14 h-14 object-cover rounded-lg border bg-gray-50 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[#18251B]">Image Ready</p>
                      <p className="text-[10px] text-gray-400 truncate max-w-xs">{formImage.slice(0, 40)}...</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormImage('')}
                      className="text-red-500 hover:text-red-700 text-xs p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-xs font-bold text-[#18251B] mb-1">
                  Short One-Line Summary
                </label>
                <input
                  type="text"
                  value={formShortDescription}
                  onChange={(e) => setFormShortDescription(e.target.value)}
                  placeholder="e.g. 100% unpolished desi foxtail millets from traditional farm soil."
                  className="w-full bg-[#FBF8EF] text-xs px-3.5 py-2.5 rounded-xl border border-[#E1E9DC] focus:outline-none focus:border-[#075B2A]"
                />
              </div>

              {/* Full Description */}
              <div>
                <label className="block text-xs font-bold text-[#18251B] mb-1">
                  Full Description & Nutritional Story
                </label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Elaborate on the farm origins, processing techniques, and health benefits..."
                  className="w-full bg-[#FBF8EF] text-xs p-3.5 rounded-xl border border-[#E1E9DC] focus:outline-none focus:border-[#075B2A]"
                ></textarea>
              </div>

              {/* Ingredients & Shelf Life */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#18251B] mb-1">
                    Ingredients (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={formIngredients}
                    onChange={(e) => setFormIngredients(e.target.value)}
                    placeholder="e.g. 100% Raw Foxtail Millet, Zero Additives"
                    className="w-full bg-[#FBF8EF] text-xs px-3.5 py-2.5 rounded-xl border border-[#E1E9DC] focus:outline-none focus:border-[#075B2A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#18251B] mb-1">
                    Shelf Life Duration
                  </label>
                  <input
                    type="text"
                    value={formShelfLife}
                    onChange={(e) => setFormShelfLife(e.target.value)}
                    placeholder="e.g. 9 Months"
                    className="w-full bg-[#FBF8EF] text-xs px-3.5 py-2.5 rounded-xl border border-[#E1E9DC] focus:outline-none focus:border-[#075B2A]"
                  />
                </div>
              </div>

              {/* Feature Toggles */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#18251B]">
                  <input
                    type="checkbox"
                    checked={formIsFeatured}
                    onChange={(e) => setFormIsFeatured(e.target.checked)}
                    className="w-4 h-4 rounded text-[#075B2A]"
                  />
                  <span>Mark as Featured Harvest</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#18251B]">
                  <input
                    type="checkbox"
                    checked={formIsBestseller}
                    onChange={(e) => setFormIsBestseller(e.target.checked)}
                    className="w-4 h-4 rounded text-[#075B2A]"
                  />
                  <span>Mark as Bestseller</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E1E9DC]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#075B2A] hover:bg-[#06451F] text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-md cursor-pointer transition-all active:scale-95"
                >
                  {editingProductId ? 'Save Changes' : 'Publish Product to Store'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: BULK CSV & JSON UPLOAD MODAL ================= */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setIsBulkModalOpen(false)}
          ></div>

          <div className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-3xl w-full z-10 shadow-2xl space-y-5 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E1E9DC]">
              <div>
                <h2 className="text-lg font-bold text-[#075B2A] font-serif-title flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  <span>Bulk Product Upload (CSV & JSON)</span>
                </h2>
                <p className="text-xs text-[#667267]">
                  Import multiple products in one click using CSV spreadsheets or JSON data.
                </p>
              </div>
              <button
                onClick={() => setIsBulkModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Template Download Notice Banner */}
            <div className="bg-[#EFF7E9] rounded-2xl p-4 border border-[#8CCB55] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-[#075B2A] shrink-0" />
                <div className="text-xs">
                  <p className="font-bold text-[#075B2A]">Need a structured CSV format?</p>
                  <p className="text-gray-600">
                    Download our ready-to-use template with sample millets, oils & herbal items.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDownloadCsvTemplate}
                className="inline-flex items-center gap-1.5 bg-[#075B2A] hover:bg-[#06451F] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs shrink-0 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Sample CSV</span>
              </button>
            </div>

            {/* File Drag and Drop / Selector */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDraggingBulk(true);
              }}
              onDragLeave={() => setIsDraggingBulk(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDraggingBulk(false);
                const file = e.dataTransfer.files[0];
                if (file) handleBulkFileSelected(file);
              }}
              onClick={() => bulkFileInputRef.current?.click()}
              className={`border-2 border-dashed p-8 rounded-3xl text-center cursor-pointer transition-all ${
                isDraggingBulk
                  ? 'border-[#075B2A] bg-[#EFF7E9]'
                  : 'border-[#8CCB55] hover:border-[#075B2A] bg-[#FBF8EF]'
              }`}
            >
              <input
                ref={bulkFileInputRef}
                type="file"
                accept=".csv, .json"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleBulkFileSelected(f);
                }}
                className="hidden"
              />
              <Upload className="w-10 h-10 text-[#075B2A] mx-auto mb-2" />
              <p className="text-sm font-bold text-[#075B2A]">
                {bulkFileName ? `Selected: ${bulkFileName}` : 'Click to browse or drop CSV / JSON file'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Supports standard comma-separated .csv and structured .json catalogs.
              </p>
            </div>

            {/* Parsed Preview Table */}
            {bulkParsedProducts.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-[#075B2A] uppercase tracking-wider">
                    Parsed Products Preview ({bulkParsedProducts.length} items)
                  </h3>
                  <span className="text-[11px] text-emerald-700 font-bold bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    Ready to Import
                  </span>
                </div>

                <div className="max-h-48 overflow-y-auto border border-[#E1E9DC] rounded-2xl bg-[#FBF8EF]/40">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#EFF7E9] text-[#075B2A] font-bold text-[10px] uppercase sticky top-0">
                      <tr>
                        <th className="p-2.5">Title</th>
                        <th className="p-2.5">Category</th>
                        <th className="p-2.5">Price</th>
                        <th className="p-2.5">Stock</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E1E9DC]">
                      {bulkParsedProducts.map((p, idx) => (
                        <tr key={idx} className="hover:bg-white">
                          <td className="p-2.5 font-bold text-[#18251B]">
                            {p.name}
                            {p.teluguName && (
                              <span className="block text-[10px] text-[#4D963C] font-normal">
                                {p.teluguName}
                              </span>
                            )}
                          </td>
                          <td className="p-2.5 text-gray-600">{p.category}</td>
                          <td className="p-2.5 font-bold text-[#075B2A]">₹{p.price}</td>
                          <td className="p-2.5 text-gray-600">{p.stock}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Replace vs Append Mode */}
                <div className="p-3 bg-[#FBF8EF] rounded-xl border border-[#E1E9DC] flex items-center justify-between text-xs">
                  <div>
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-[#18251B]">
                      <input
                        type="checkbox"
                        checked={bulkReplaceMode}
                        onChange={(e) => setBulkReplaceMode(e.target.checked)}
                        className="w-4 h-4 rounded text-[#075B2A]"
                      />
                      <span>Replace entire catalog with this file</span>
                    </label>
                    <p className="text-[11px] text-gray-500 pl-6">
                      (Unchecked: Merges new products into your current inventory)
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E1E9DC]">
              <button
                type="button"
                onClick={() => {
                  setIsBulkModalOpen(false);
                  setBulkParsedProducts([]);
                  setBulkFileName('');
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-100 cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={bulkParsedProducts.length === 0}
                onClick={handleConfirmBulkUpload}
                className="bg-[#075B2A] hover:bg-[#06451F] disabled:opacity-50 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-md cursor-pointer transition-all active:scale-95 flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm & Ingest {bulkParsedProducts.length} Products</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, ProductCategory } from '../types';
import { INITIAL_PRODUCTS } from '../data/products';
import { useToast } from './ToastContext';

interface ProductContextType {
  products: Product[];
  addProduct: (productData: Omit<Product, 'id' | 'createdAt'> & { id?: string; createdAt?: string }) => void;
  updateProduct: (productId: string, updatedData: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;
  bulkUploadProducts: (newProducts: Product[], replaceAll?: boolean) => void;
  resetToDefaultCatalog: () => void;
  getProductById: (id: string) => Product | undefined;
  getProductBySlug: (slug: string) => Product | undefined;
  categories: ProductCategory[];
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const PRODUCTS_STORAGE_KEY = 'graminum_catalog_products_v4';

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { showToast } = useToast();

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
      // Migrate from v3 if exists
      const legacyV3 = localStorage.getItem('graminum_catalog_products_v3');
      if (legacyV3) {
        const parsedV3 = JSON.parse(legacyV3);
        if (Array.isArray(parsedV3) && parsedV3.length > 0) {
          localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(parsedV3));
          return parsedV3;
        }
      }
    } catch (e) {
      console.error('Error loading products from localStorage', e);
    }
    // Default initial authentic catalog
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
    } catch {
      // ignore
    }
    return INITIAL_PRODUCTS;
  });

  // Helper to persist immediately to localStorage
  const saveToStorage = (updatedProducts: Product[]) => {
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(updatedProducts));
    } catch (e) {
      console.error('Error persisting products to localStorage', e);
    }
  };

  // Save to localStorage whenever product catalog changes
  useEffect(() => {
    saveToStorage(products);
  }, [products]);

  // Sync products across multiple browser tabs / windows in real time
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === PRODUCTS_STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setProducts(parsed);
          }
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const categories: ProductCategory[] = [
    'Personal Care',
    'Herbal Oils',
    'Natural Foods',
    'Herbal Wellness',
    'Pooja Essentials',
    'Fragrances',
  ];

  const getProductById = (id: string): Product | undefined => {
    return products.find((p) => p.id === id);
  };

  const getProductBySlug = (slug: string): Product | undefined => {
    return products.find((p) => p.slug === slug || p.id === slug);
  };

  const addProduct = (productData: Omit<Product, 'id' | 'createdAt'> & { id?: string; createdAt?: string }) => {
    const newProduct: Product = {
      ...productData,
      id: productData.id || `grm-custom-${Date.now()}`,
      createdAt: productData.createdAt || new Date().toISOString(),
      slug:
        productData.slug ||
        productData.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, ''),
    };

    setProducts((prev) => {
      const updated = [newProduct, ...prev];
      saveToStorage(updated);
      return updated;
    });
    showToast(`Added "${newProduct.name}" to catalog successfully!`, 'success');
  };

  const updateProduct = (productId: string, updatedData: Partial<Product>) => {
    setProducts((prev) => {
      const updated = prev.map((p) => {
        if (p.id === productId) {
          return {
            ...p,
            ...updatedData,
            slug:
              updatedData.slug ||
              (updatedData.name
                ? updatedData.name
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)/g, '')
                : p.slug),
          };
        }
        return p;
      });
      saveToStorage(updated);
      return updated;
    });
    showToast('Product updated successfully!', 'success');
  };

  const deleteProduct = (productId: string) => {
    const target = products.find((p) => p.id === productId);
    setProducts((prev) => {
      const updated = prev.filter((p) => p.id !== productId);
      saveToStorage(updated);
      return updated;
    });
    showToast(`Deleted "${target?.name || 'Product'}" from catalog.`, 'info');
  };

  const bulkUploadProducts = (newProducts: Product[], replaceAll: boolean = false) => {
    if (replaceAll) {
      setProducts(newProducts);
      saveToStorage(newProducts);
      showToast(`Replaced entire catalog with ${newProducts.length} products!`, 'success');
    } else {
      setProducts((prev) => {
        const updated = [...newProducts, ...prev];
        saveToStorage(updated);
        return updated;
      });
      showToast(`Successfully imported ${newProducts.length} new products!`, 'success');
    }
  };

  const resetToDefaultCatalog = () => {
    setProducts(INITIAL_PRODUCTS);
    saveToStorage(INITIAL_PRODUCTS);
    showToast('Catalog restored to default Graminum farm products!', 'success');
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        bulkUploadProducts,
        resetToDefaultCatalog,
        getProductById,
        getProductBySlug,
        categories,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = (): ProductContextType => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

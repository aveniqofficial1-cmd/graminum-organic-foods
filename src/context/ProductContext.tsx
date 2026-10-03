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

const PRODUCTS_STORAGE_KEY = 'graminum_catalog_products_v3';

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { showToast } = useToast();

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading products from localStorage', e);
    }
    return INITIAL_PRODUCTS;
  });

  // Save to localStorage whenever product catalog changes
  useEffect(() => {
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    } catch (e) {
      console.error('Error saving products to localStorage', e);
    }
  }, [products]);

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

    setProducts((prev) => [newProduct, ...prev]);
    showToast(`Added "${newProduct.name}" to catalog successfully!`, 'success');
  };

  const updateProduct = (productId: string, updatedData: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => {
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
      })
    );
    showToast('Product updated successfully!', 'success');
  };

  const deleteProduct = (productId: string) => {
    const target = products.find((p) => p.id === productId);
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    showToast(`Deleted "${target?.name || 'Product'}" from catalog.`, 'info');
  };

  const bulkUploadProducts = (newProducts: Product[], replaceAll: boolean = false) => {
    if (replaceAll) {
      setProducts(newProducts);
      showToast(`Replaced entire catalog with ${newProducts.length} products!`, 'success');
    } else {
      setProducts((prev) => [...newProducts, ...prev]);
      showToast(`Successfully imported ${newProducts.length} new products!`, 'success');
    }
  };

  const resetToDefaultCatalog = () => {
    setProducts(INITIAL_PRODUCTS);
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
    showToast('Catalog restored to default Graminum organic products!', 'success');
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

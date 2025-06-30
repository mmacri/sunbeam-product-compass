
import { useState } from 'react';

export const useAdminProducts = () => {
  const [realProducts, setRealProducts] = useState<any[]>([]);

  const loadAdminProducts = () => {
    const adminProducts = localStorage.getItem('sunbeam-products');
    if (adminProducts) {
      try {
        const parsed = JSON.parse(adminProducts);
        setRealProducts(parsed);
        return parsed;
      } catch (error) {
        console.error('Failed to load real products:', error);
      }
    }
    return [];
  };

  return {
    realProducts,
    setRealProducts,
    loadAdminProducts
  };
};

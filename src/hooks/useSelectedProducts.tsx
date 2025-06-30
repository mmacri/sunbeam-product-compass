
import { useState, useEffect } from 'react';

export const useSelectedProducts = () => {
  const [selectedRapidApiProducts, setSelectedRapidApiProducts] = useState<any[]>([]);

  const loadSelectedProducts = () => {
    try {
      const stored = localStorage.getItem('sunbeam-selected-rapidapi-products');
      if (stored) {
        const selectedProducts = JSON.parse(stored);
        console.log('Loaded selected products:', selectedProducts.length);
        setSelectedRapidApiProducts(selectedProducts);
        return selectedProducts;
      }
    } catch (error) {
      console.error('Failed to load selected products:', error);
    }
    return null;
  };

  const saveSelectedProducts = (rapidApiProducts: any[]) => {
    console.log('Saving selected products:', rapidApiProducts.length);
    localStorage.setItem('sunbeam-selected-rapidapi-products', JSON.stringify(rapidApiProducts));
    setSelectedRapidApiProducts(rapidApiProducts);
  };

  useEffect(() => {
    loadSelectedProducts();
  }, []);

  return {
    selectedRapidApiProducts,
    loadSelectedProducts,
    saveSelectedProducts
  };
};

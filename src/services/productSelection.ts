
interface SelectedProduct {
  asin: string;
  selected: boolean;
  addedAt: string;
}

export class ProductSelectionService {
  private static STORAGE_KEY = 'sunbeam-selected-products';

  static getSelectedProducts(): SelectedProduct[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  static setSelectedProducts(products: SelectedProduct[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(products));
  }

  static toggleProduct(asin: string): void {
    const selected = this.getSelectedProducts();
    const existing = selected.find(p => p.asin === asin);
    
    if (existing) {
      existing.selected = !existing.selected;
    } else {
      selected.push({
        asin,
        selected: true,
        addedAt: new Date().toISOString()
      });
    }
    
    this.setSelectedProducts(selected);
  }

  static isProductSelected(asin: string): boolean {
    const selected = this.getSelectedProducts();
    const product = selected.find(p => p.asin === asin);
    return product?.selected || false;
  }

  static getSelectedAsins(): string[] {
    return this.getSelectedProducts()
      .filter(p => p.selected)
      .map(p => p.asin);
  }

  static selectAll(asins: string[]): void {
    const selected = this.getSelectedProducts();
    
    asins.forEach(asin => {
      const existing = selected.find(p => p.asin === asin);
      if (existing) {
        existing.selected = true;
      } else {
        selected.push({
          asin,
          selected: true,
          addedAt: new Date().toISOString()
        });
      }
    });
    
    this.setSelectedProducts(selected);
  }

  static clearAll(): void {
    const selected = this.getSelectedProducts();
    selected.forEach(p => p.selected = false);
    this.setSelectedProducts(selected);
  }
}

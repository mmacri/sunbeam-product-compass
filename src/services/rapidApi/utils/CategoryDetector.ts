
export class CategoryDetector {
  static detectFromText(title: string, description: string): string {
    const text = (title + ' ' + description).toLowerCase();
    
    if (text.includes('massage') || text.includes('massager')) return 'Health & Personal Care';
    if (text.includes('phone') || text.includes('mobile')) return 'Electronics';
    if (text.includes('laptop') || text.includes('computer')) return 'Computers';
    if (text.includes('headphone') || text.includes('audio')) return 'Audio';
    if (text.includes('camera') || text.includes('photo')) return 'Photography';
    if (text.includes('watch') || text.includes('fitness')) return 'Wearables';
    if (text.includes('home') || text.includes('kitchen')) return 'Home & Garden';
    if (text.includes('clothes') || text.includes('fashion')) return 'Clothing';
    if (text.includes('book') || text.includes('read')) return 'Books';
    if (text.includes('game') || text.includes('toy')) return 'Games & Toys';
    if (text.includes('health') || text.includes('beauty')) return 'Health & Beauty';
    
    return 'General';
  }
}

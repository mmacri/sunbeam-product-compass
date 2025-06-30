
export class MetaDataGenerator {
  static generateMetaTags(title: string, description: string, category: string): string[] {
    const text = (title + ' ' + description + ' ' + category).toLowerCase();
    const tags = [];
    
    // Technology tags
    if (text.includes('wireless') || text.includes('bluetooth')) tags.push('wireless');
    if (text.includes('smart') || text.includes('ai')) tags.push('smart');
    if (text.includes('pro') || text.includes('professional')) tags.push('professional');
    if (text.includes('portable') || text.includes('handheld')) tags.push('portable');
    if (text.includes('electric') || text.includes('battery')) tags.push('electric');
    
    // Quality tags
    if (text.includes('premium') || text.includes('luxury')) tags.push('premium');
    if (text.includes('budget') || text.includes('affordable')) tags.push('budget');
    if (text.includes('best seller')) tags.push('popular');
    if (text.includes('climate pledge')) tags.push('eco-friendly');
    
    // Health & wellness specific
    if (text.includes('massage') || text.includes('therapy')) tags.push('wellness');
    if (text.includes('pain relief') || text.includes('muscle')) tags.push('therapeutic');
    
    return [...new Set(tags)]; // Remove duplicates
  }

  static generateSearchTerms(title: string, description: string): string[] {
    const text = (title + ' ' + description).toLowerCase();
    const words = text.split(/\s+/).filter(word => 
      word.length > 2 && 
      !['the', 'and', 'for', 'with', 'this', 'that', 'from', 'are', 'you', 'all', 'can', 'her', 'him'].includes(word)
    );
    
    return [...new Set(words)]; // Remove duplicates
  }
}

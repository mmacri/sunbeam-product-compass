
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Save, Eye, Code } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TemplateEditorProps {
  productData?: any;
}

export const TemplateEditor = ({ productData }: TemplateEditorProps) => {
  const [template, setTemplate] = useState(() => {
    return localStorage.getItem('sunbeam-template') || `# {{title}} Review

**Current Price**: {{currentPrice}}
**Original Price**: {{originalPrice}}
**Rating**: ⭐ {{rating}}/5 ({{reviews}} reviews)

## Product Overview
{{description}}

## Key Features
{{#each keyFeatures}}
- {{this}}
{{/each}}

## Technical Specifications
{{#each specs}}
**{{@key}}**: {{this}}
{{/each}}

## Price History
Current price represents excellent value. Monitor for future price drops.

## Where to Buy
Available at multiple retailers for comparison shopping.`;
  });

  const [previewMode, setPreviewMode] = useState(false);
  const { toast } = useToast();

  const saveTemplate = () => {
    localStorage.setItem('sunbeam-template', template);
    toast({
      title: "Template Saved",
      description: "Your blog template has been saved successfully.",
    });
  };

  const renderPreview = () => {
    if (!productData) return template;

    let rendered = template;
    
    // Simple template variable replacement
    rendered = rendered.replace(/\{\{title\}\}/g, productData.title || 'Sample Product');
    rendered = rendered.replace(/\{\{currentPrice\}\}/g, productData.currentPrice || '$299');
    rendered = rendered.replace(/\{\{originalPrice\}\}/g, productData.originalPrice || '$399');
    rendered = rendered.replace(/\{\{rating\}\}/g, productData.rating?.toString() || '4.5');
    rendered = rendered.replace(/\{\{reviews\}\}/g, productData.reviews?.toString() || '1,234');
    rendered = rendered.replace(/\{\{description\}\}/g, productData.description || 'High-quality product with excellent features.');

    // Handle key features array
    if (productData.keyFeatures) {
      const featuresHtml = productData.keyFeatures.map((feature: string) => `- ${feature}`).join('\n');
      rendered = rendered.replace(/\{\{#each keyFeatures\}\}[\s\S]*?\{\{\/each\}\}/g, featuresHtml);
    }

    // Handle specs object
    if (productData.specs) {
      const specsHtml = Object.entries(productData.specs)
        .map(([key, value]) => `**${key}**: ${value}`)
        .join('\n');
      rendered = rendered.replace(/\{\{#each specs\}\}[\s\S]*?\{\{\/each\}\}/g, specsHtml);
    }

    return rendered;
  };

  const availableVariables = [
    'title', 'currentPrice', 'originalPrice', 'rating', 'reviews', 
    'description', 'keyFeatures', 'specs', 'category'
  ];

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center justify-between dark:text-gray-100">
            <div className="flex items-center space-x-2">
              <Code className="w-5 h-5" />
              <span>Template Editor</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setPreviewMode(!previewMode)}
                className="dark:border-gray-600 dark:text-gray-300"
              >
                <Eye className="w-4 h-4 mr-2" />
                {previewMode ? 'Edit' : 'Preview'}
              </Button>
              <Button 
                size="sm" 
                onClick={saveTemplate}
                className="bg-green-600 hover:bg-green-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium dark:text-gray-300">Available Variables:</span>
              {availableVariables.map(variable => (
                <Badge 
                  key={variable}
                  variant="secondary"
                  className="cursor-pointer dark:bg-gray-600 dark:text-gray-200"
                  onClick={() => setTemplate(prev => prev + `{{${variable}}}`)}
                >
                  {`{{${variable}}}`}
                </Badge>
              ))}
            </div>
            
            {!previewMode ? (
              <Textarea
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
                rows={20}
                className="font-mono text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                placeholder="Enter your blog template here..."
              />
            ) : (
              <div className="border rounded-md p-4 min-h-96 dark:border-gray-600 dark:bg-gray-700">
                <pre className="whitespace-pre-wrap text-sm dark:text-gray-200">
                  {renderPreview()}
                </pre>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="dark:text-gray-100">Live Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose dark:prose-invert max-w-none">
            <div 
              className="text-sm leading-relaxed dark:text-gray-200"
              dangerouslySetInnerHTML={{
                __html: renderPreview().replace(/\n/g, '<br/>')
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mb-4 dark:text-gray-100">$1</h1>')
                  .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mb-3 mt-6 dark:text-gray-100">$1</h2>')
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

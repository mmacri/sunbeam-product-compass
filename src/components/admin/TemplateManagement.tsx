
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface Product {
  id: string;
  title: string;
  url: string;
  threshold: number;
  tags: string[];
  price: string;
  lastUpdated: string;
}

interface TemplateManagementProps {
  products: Product[];
  onLogAction: (action: string, details: any) => void;
  onShowMessage: (message: string, type?: 'success' | 'error') => void;
}

export const TemplateManagement: React.FC<TemplateManagementProps> = ({
  products,
  onLogAction,
  onShowMessage
}) => {
  const [template, setTemplate] = useState(`# {{title}} Review

**Price**: {{price}}
**Last Updated**: {{lastUpdated}}

## Product Overview
{{description}}

## Key Features
{{#each features}}
- {{this}}
{{/each}}

## Specifications
{{#each specs}}
**{{@key}}**: {{this}}
{{/each}}

---
*Review generated on {{timestamp}}*`);
  const [previewHtml, setPreviewHtml] = useState('');

  useEffect(() => {
    loadTemplate();
  }, []);

  const loadTemplate = () => {
    const saved = localStorage.getItem('sunbeam-template');
    if (saved) {
      setTemplate(saved);
    }
  };

  const saveTemplate = () => {
    localStorage.setItem('sunbeam-template', template);
    onLogAction('template_saved', {});
    onShowMessage('Template saved');
  };

  const renderPreview = () => {
    if (products.length === 0) {
      setPreviewHtml('<p>No products available for preview</p>');
      return;
    }

    const sampleProduct = products[0];
    let html = template
      .replace(/\{\{title\}\}/g, sampleProduct.title)
      .replace(/\{\{price\}\}/g, sampleProduct.price)
      .replace(/\{\{lastUpdated\}\}/g, new Date(sampleProduct.lastUpdated).toLocaleDateString())
      .replace(/\{\{timestamp\}\}/g, new Date().toLocaleDateString());

    setPreviewHtml(html);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Template Editor</CardTitle>
          <p className="text-sm text-gray-600">
            Use template variables like {`{{title}}`}, {`{{price}}`}, {`{{description}}`}, etc.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            placeholder="Enter your blog template using {{variable}} syntax..."
            className="min-h-64 font-mono text-sm"
          />
          <div className="flex gap-2">
            <Button onClick={saveTemplate}>
              Save Template
            </Button>
            <Button variant="outline" onClick={renderPreview}>
              Render Preview
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Live Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            className="min-h-32 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: previewHtml }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

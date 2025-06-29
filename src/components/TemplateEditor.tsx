
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Save, Eye, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TemplateEditorProps {
  productData?: any;
}

export const TemplateEditor = ({ productData }: TemplateEditorProps) => {
  const [template, setTemplate] = useState(`# {{title}} Review

**Current Price**: {{currentPrice}}
**Original Price**: {{originalPrice}}
**Rating**: {{rating}}/5 ({{reviews}} reviews)
**Category**: {{category}}

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

## Where to Buy
{{#each stores}}
- [{{name}}]({{url}})
{{/each}}

---

*Last updated: {{timestamp}}*`);

  const [preview, setPreview] = useState('');
  const { toast } = useToast();

  const processTemplate = (templateStr: string, data: any) => {
    if (!data) return 'No product data available for preview';

    let processed = templateStr;
    
    // Simple variable replacement
    processed = processed.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return data[key] || match;
    });

    // Handle arrays (simplified Handlebars-like syntax)
    processed = processed.replace(/\{\{#each (\w+)\}\}([\s\S]*?)\{\{\/each\}\}/g, (match, arrayName, itemTemplate) => {
      const array = data[arrayName];
      if (!Array.isArray(array)) return '';
      
      return array.map(item => {
        if (typeof item === 'string') {
          return itemTemplate.replace(/\{\{this\}\}/g, item);
        } else if (typeof item === 'object') {
          let itemHtml = itemTemplate;
          Object.keys(item).forEach(key => {
            itemHtml = itemHtml.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), item[key]);
          });
          return itemHtml;
        }
        return '';
      }).join('');
    });

    // Handle object iteration
    processed = processed.replace(/\{\{#each (\w+)\}\}([\s\S]*?)\{\{\/each\}\}/g, (match, objName, itemTemplate) => {
      const obj = data[objName];
      if (typeof obj !== 'object' || Array.isArray(obj)) return '';
      
      return Object.entries(obj).map(([key, value]) => {
        return itemTemplate
          .replace(/\{\{@key\}\}/g, key)
          .replace(/\{\{this\}\}/g, value as string);
      }).join('');
    });

    // Add timestamp
    processed = processed.replace(/\{\{timestamp\}\}/g, new Date().toLocaleDateString());

    return processed;
  };

  useEffect(() => {
    setPreview(processTemplate(template, productData));
  }, [template, productData]);

  const saveTemplate = () => {
    localStorage.setItem('sunbeam-blog-template', template);
    toast({
      title: "Template Saved",
      description: "Your blog template has been saved successfully.",
    });
  };

  const loadDefaultTemplate = () => {
    const saved = localStorage.getItem('sunbeam-blog-template');
    if (saved) {
      setTemplate(saved);
    }
  };

  useEffect(() => {
    loadDefaultTemplate();
  }, []);

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 dark:text-gray-100">
            <FileText className="w-5 h-5 text-blue-500" />
            <span>Template Editor</span>
          </CardTitle>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{"{{title}}"}</Badge>
            <Badge variant="secondary">{"{{currentPrice}}"}</Badge>
            <Badge variant="secondary">{"{{rating}}"}</Badge>
            <Badge variant="secondary">{"{{category}}"}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            placeholder="Enter your blog template using {{variable}} syntax..."
            className="min-h-96 font-mono text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
          />
          <div className="flex space-x-2">
            <Button onClick={saveTemplate} className="flex items-center space-x-2">
              <Save className="w-4 h-4" />
              <span>Save Template</span>
            </Button>
            <Button variant="outline" onClick={loadDefaultTemplate}>
              Load Saved
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 dark:text-gray-100">
            <Eye className="w-5 h-5 text-green-500" />
            <span>Live Preview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="min-h-96 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border dark:border-gray-600">
            <pre className="whitespace-pre-wrap text-sm dark:text-gray-300 font-sans">
              {preview}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

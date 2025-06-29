
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings } from 'lucide-react';

interface AdminSettingsProps {
  onShowMessage: (message: string, type?: 'success' | 'error') => void;
  onLogAction: (action: string, details: any) => void;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({
  onShowMessage,
  onLogAction
}) => {
  const saveSettings = () => {
    onLogAction('settings_saved', {});
    onShowMessage('Settings saved');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          System Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label>Default Alert Threshold</Label>
            <Input type="number" placeholder="50" />
          </div>
          <div>
            <Label>WordPress API Endpoint</Label>
            <Input placeholder="https://your-site.com/wp-json/wp/v2/posts" />
          </div>
          <div>
            <Label>Email Alert Endpoint</Label>
            <Input placeholder="https://your-email-service.com/send" />
          </div>
          <Button onClick={saveSettings}>Save Settings</Button>
        </div>
      </CardContent>
    </Card>
  );
};

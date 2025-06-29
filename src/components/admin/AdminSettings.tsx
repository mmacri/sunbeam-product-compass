
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ApiConfiguration } from './ApiConfiguration';
import { Settings } from 'lucide-react';

interface AdminSettingsProps {
  onShowMessage: (message: string, type?: 'success' | 'error') => void;
  onLogAction: (action: string, details: any) => void;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({
  onShowMessage,
  onLogAction
}) => {
  return (
    <div className="space-y-6">
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 dark:text-gray-100">
            <Settings className="w-5 h-5 text-blue-500" />
            Admin Settings
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Configure system settings and integrations
          </p>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your admin panel settings and API integrations below.
          </p>
        </CardContent>
      </Card>

      <ApiConfiguration
        onShowMessage={onShowMessage}
        onLogAction={onLogAction}
      />
    </div>
  );
};

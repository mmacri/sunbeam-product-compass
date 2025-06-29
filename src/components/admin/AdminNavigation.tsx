
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  LayoutDashboard, 
  Link2, 
  Settings, 
  BarChart3,
  FileText,
  Activity
} from 'lucide-react';

interface AdminNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  productCount: number;
  pendingActions: number;
}

export const AdminNavigation: React.FC<AdminNavigationProps> = ({
  activeTab,
  onTabChange,
  productCount,
  pendingActions
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
      <div className="container mx-auto px-6">
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-transparent gap-1 h-auto p-1">
            <TabsTrigger 
              value="dashboard" 
              className="flex items-center gap-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-900 dark:data-[state=active]:text-blue-300"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
              {productCount > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {productCount}
                </Badge>
              )}
            </TabsTrigger>
            
            <TabsTrigger 
              value="url-processor" 
              className="flex items-center gap-2 data-[state=active]:bg-green-100 data-[state=active]:text-green-700 dark:data-[state=active]:bg-green-900 dark:data-[state=active]:text-green-300"
            >
              <Link2 className="w-4 h-4" />
              <span className="hidden sm:inline">URL Input</span>
            </TabsTrigger>

            <TabsTrigger 
              value="template" 
              className="flex items-center gap-2 data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 dark:data-[state=active]:bg-purple-900 dark:data-[state=active]:text-purple-300"
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Templates</span>
            </TabsTrigger>

            <TabsTrigger 
              value="reports" 
              className="flex items-center gap-2 data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700 dark:data-[state=active]:bg-orange-900 dark:data-[state=active]:text-orange-300"
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>

            <TabsTrigger 
              value="audit" 
              className="flex items-center gap-2 data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700 dark:data-[state=active]:bg-indigo-900 dark:data-[state=active]:text-indigo-300"
            >
              <Activity className="w-4 h-4" />
              <span className="hidden sm:inline">Activity</span>
              {pendingActions > 0 && (
                <Badge variant="destructive" className="ml-1 text-xs">
                  {pendingActions}
                </Badge>
              )}
            </TabsTrigger>

            <TabsTrigger 
              value="settings" 
              className="flex items-center gap-2 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-700 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-gray-300"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};

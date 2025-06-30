
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LayoutDashboard, 
  Link, 
  Search,
  FileText, 
  BarChart3, 
  Activity, 
  Settings,
  Badge as BadgeIcon
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
    <div className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80 dark:border-gray-700 sticky top-0 z-40">
      <div className="container mx-auto px-6">
        <TabsList className="grid w-full grid-cols-7 h-14 bg-transparent">
          <TabsTrigger 
            value="dashboard" 
            className="flex items-center gap-2 data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700 dark:data-[state=active]:bg-indigo-900 dark:data-[state=active]:text-indigo-300"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="url-processor" 
            className="flex items-center gap-2 data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700 dark:data-[state=active]:bg-indigo-900 dark:data-[state=active]:text-indigo-300"
          >
            <Link className="w-4 h-4" />
            <span className="hidden sm:inline">Products</span>
            {productCount > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs">
                {productCount}
              </Badge>
            )}
          </TabsTrigger>

          <TabsTrigger 
            value="browser" 
            className="flex items-center gap-2 data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700 dark:data-[state=active]:bg-indigo-900 dark:data-[state=active]:text-indigo-300"
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">Browse</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="template" 
            className="flex items-center gap-2 data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700 dark:data-[state=active]:bg-indigo-900 dark:data-[state=active]:text-indigo-300"
          >
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Template</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="reports" 
            className="flex items-center gap-2 data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700 dark:data-[state=active]:bg-indigo-900 dark:data-[state=active]:text-indigo-300"
          >
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">Reports</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="audit" 
            className="flex items-center gap-2 data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700 dark:data-[state=active]:bg-indigo-900 dark:data-[state=active]:text-indigo-300"
          >
            <Activity className="w-4 h-4" />
            <span className="hidden sm:inline">Audit</span>
            {pendingActions > 0 && (
              <Badge variant="destructive" className="ml-1 text-xs">
                {pendingActions}
              </Badge>
            )}
          </TabsTrigger>
          
          <TabsTrigger 
            value="settings" 
            className="flex items-center gap-2 data-[state=active]:bg-indigo-100 data-[state=active]:text-indigo-700 dark:data-[state=active]:bg-indigo-900 dark:data-[state=active]:text-indigo-300"
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Settings</span>
          </TabsTrigger>
        </TabsList>
      </div>
    </div>
  );
};

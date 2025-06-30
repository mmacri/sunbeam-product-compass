
import React from 'react';
import { 
  LayoutDashboard, 
  Link, 
  Search,
  FileText, 
  BarChart3, 
  Activity, 
  Settings,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'url-processor', label: 'Products', icon: Link, badge: productCount },
    { id: 'browser', label: 'Browse', icon: Search },
    { id: 'template', label: 'Template', icon: FileText },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'audit', label: 'Audit', icon: Activity, badge: pendingActions, badgeVariant: 'destructive' as const },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80 dark:border-gray-700 sticky top-0 z-40">
      <div className="container mx-auto px-6">
        <div className="flex items-center h-14 gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <Button
                key={tab.id}
                variant={isActive ? "default" : "ghost"}
                size="sm"
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 ${
                  isActive 
                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                {tab.badge && tab.badge > 0 && (
                  <Badge 
                    variant={tab.badgeVariant || "secondary"} 
                    className="ml-1 text-xs"
                  >
                    {tab.badge}
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

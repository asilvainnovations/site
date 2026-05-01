import React from 'react';
import { LayoutDashboard, ChartBar as BarChart3, Settings, MessageSquare, FileText, Users } from 'lucide-react';
import { UserRole } from '../../types';

interface SidebarProps {
  activeView: string;
  onNavigate: (view: string) => void;
  userRole: UserRole;
  isOpen?: boolean;
  theme: 'light' | 'dark';
}

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'officer', 'coordinator', 'viewer'] },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, roles: ['admin', 'officer', 'coordinator'] },
  { id: 'surveys', label: 'Surveys', icon: FileText, roles: ['admin', 'officer', 'coordinator'] },
  { id: 'team', label: 'Team', icon: Users, roles: ['admin', 'coordinator'] },
  { id: 'ai-assistant', label: 'Elektra AI', icon: MessageSquare, roles: ['admin', 'officer', 'coordinator', 'viewer'] },
  { id: 'settings', label: 'Settings', icon: Settings, roles: ['admin', 'officer', 'coordinator', 'viewer'] },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onNavigate,
  userRole,
  isOpen = true,
  theme,
}) => {
  const filteredItems = navigationItems.filter((item) => item.roles.includes(userRole));

  return (
    <aside
      className={`${
        theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
      } border-r transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-20'
      }`}
    >
      <nav className="p-4 space-y-2">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : theme === 'dark'
                    ? 'text-gray-300 hover:bg-gray-800'
                    : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon size={20} />
              {isOpen && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

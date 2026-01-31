import { useState } from 'react';
import { 
  Home,
  FolderOpen,
  Plus,
  Settings,
  User,
  CreditCard,
  BarChart3,
  FileText,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Calendar,
  Star,
  Award,
  Clock,
  DollarSign,
  Users,
  Building,
  Gavel
} from 'lucide-react';
import Button from '@/components/ui/Button';

interface ClientSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onPostProject: () => void;
}

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
  submenu?: SidebarItem[];
}

const sidebarItems: SidebarItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <Home className="h-5 w-5" />,
  },
  {
    id: 'projects',
    label: 'My Projects',
    icon: <FolderOpen className="h-5 w-5" />,
    badge: 12,
    submenu: [
      { id: 'projects-active', label: 'Active Projects', icon: <Clock className="h-4 w-4" />, badge: 5 },
      { id: 'projects-draft', label: 'Draft Projects', icon: <FileText className="h-4 w-4" />, badge: 2 },
      { id: 'projects-completed', label: 'Completed', icon: <Award className="h-4 w-4" />, badge: 8 },
      { id: 'projects-archived', label: 'Archived', icon: <FolderOpen className="h-4 w-4" /> },
    ]
  },
  {
    id: 'auctions',
    label: 'Auctions',
    icon: <Gavel className="h-5 w-5" />,
    badge: 3,
    submenu: [
      { id: 'auctions-live', label: 'Live Auctions', icon: <Gavel className="h-4 w-4" />, badge: 2 },
      { id: 'auctions-scheduled', label: 'Scheduled', icon: <Calendar className="h-4 w-4" />, badge: 1 },
      { id: 'auctions-ended', label: 'Ended', icon: <Clock className="h-4 w-4" /> },
    ]
  },
  {
    id: 'bids',
    label: 'Bids & Proposals',
    icon: <Users className="h-5 w-5" />,
    badge: 23,
    submenu: [
      { id: 'bids-received', label: 'Received Bids', icon: <Users className="h-4 w-4" />, badge: 15 },
      { id: 'bids-shortlisted', label: 'Shortlisted', icon: <Star className="h-4 w-4" />, badge: 8 },
      { id: 'bids-awarded', label: 'Awarded', icon: <Award className="h-4 w-4" /> },
    ]
  },
  {
    id: 'contracts',
    label: 'Contracts',
    icon: <FileText className="h-5 w-5" />,
    submenu: [
      { id: 'contracts-active', label: 'Active Contracts', icon: <FileText className="h-4 w-4" />, badge: 3 },
      { id: 'contracts-pending', label: 'Pending Signature', icon: <Clock className="h-4 w-4" />, badge: 1 },
      { id: 'contracts-completed', label: 'Completed', icon: <Award className="h-4 w-4" /> },
    ]
  },
  {
    id: 'payments',
    label: 'Payments',
    icon: <CreditCard className="h-5 w-5" />,
    submenu: [
      { id: 'payments-overview', label: 'Payment Overview', icon: <BarChart3 className="h-4 w-4" /> },
      { id: 'payments-pending', label: 'Pending Payments', icon: <Clock className="h-4 w-4" />, badge: 2 },
      { id: 'payments-history', label: 'Payment History', icon: <FileText className="h-4 w-4" /> },
      { id: 'payments-methods', label: 'Payment Methods', icon: <CreditCard className="h-4 w-4" /> },
    ]
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: <BarChart3 className="h-5 w-5" />,
    submenu: [
      { id: 'analytics-overview', label: 'Overview', icon: <BarChart3 className="h-4 w-4" /> },
      { id: 'analytics-projects', label: 'Project Analytics', icon: <FolderOpen className="h-4 w-4" /> },
      { id: 'analytics-spending', label: 'Spending Analysis', icon: <DollarSign className="h-4 w-4" /> },
      { id: 'analytics-performance', label: 'Performance', icon: <Award className="h-4 w-4" /> },
    ]
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: <User className="h-5 w-5" />,
    submenu: [
      { id: 'profile-view', label: 'View Profile', icon: <User className="h-4 w-4" /> },
      { id: 'profile-edit', label: 'Edit Profile', icon: <Settings className="h-4 w-4" /> },
      { id: 'profile-company', label: 'Company Info', icon: <Building className="h-4 w-4" /> },
      { id: 'profile-verification', label: 'Verification', icon: <Award className="h-4 w-4" /> },
    ]
  },
];

const quickActions = [
  { id: 'post-project', label: 'Post New Project', icon: <Plus className="h-4 w-4" />, primary: true },
  { id: 'search-organizations', label: 'Search Organizations', icon: <Search className="h-4 w-4" /> },
  { id: 'browse-categories', label: 'Browse Categories', icon: <Filter className="h-4 w-4" /> },
  { id: 'schedule-meeting', label: 'Schedule Meeting', icon: <Calendar className="h-4 w-4" /> },
];

export default function ClientSidebar({ activeSection, onSectionChange, onPostProject }: ClientSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>(['projects', 'auctions', 'bids']);

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleItemClick = (itemId: string, hasSubmenu: boolean) => {
    if (hasSubmenu) {
      toggleExpanded(itemId);
    } else {
      onSectionChange(itemId);
    }
  };

  const handleQuickAction = (actionId: string) => {
    switch (actionId) {
      case 'post-project':
        onPostProject();
        break;
      default:
        console.log('Quick action:', actionId);
        // TODO: Implement other quick actions
    }
  };

  return (
    <div className={`min-h-screen bg-[var(--bg-card)] border-r border-[var(--border-light)] transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    } flex flex-col`}>
      {/* Header */}
      <div className="p-4 border-b border-[var(--border-light)]">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">Client Panel</h2>
              <p className="text-sm text-[var(--text-secondary)]">Manage your projects</p>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-[var(--bg-secondary)] rounded-lg transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4 text-[var(--text-secondary)]" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-[var(--text-secondary)]" />
            )}
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      {!isCollapsed && (
        <div className="p-4 border-b border-[var(--border-light)]">
          <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-3">Quick Actions</h3>
          <div className="space-y-2">
            {quickActions.map((action) => (
              <Button
                key={action.id}
                variant={action.primary ? 'primary' : 'outline'}
                size="sm"
                fullWidth
                onClick={() => handleQuickAction(action.id)}
                className="justify-start"
              >
                {action.icon}
                <span className="ml-2">{action.label}</span>
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4">
        <nav className="space-y-1">
          {sidebarItems.map((item) => (
            <div key={item.id}>
              <button
                onClick={() => handleItemClick(item.id, !!item.submenu)}
                className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === item.id
                    ? 'bg-[var(--accent-blue)] text-white'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
                }`}
              >
                <div className={`flex items-center ${isCollapsed ? 'justify-center' : ''}`}>
                  {item.icon}
                  {!isCollapsed && <span className="ml-3">{item.label}</span>}
                </div>
                {!isCollapsed && (
                  <div className="flex items-center gap-2">
                    {item.badge && (
                      <span className="px-2 py-1 text-xs bg-[var(--accent-blue)] text-white rounded-full">
                        {item.badge}
                      </span>
                    )}
                    {item.submenu && (
                      <ChevronRight
                        className={`h-4 w-4 transition-transform ${
                          expandedItems.includes(item.id) ? 'rotate-90' : ''
                        }`}
                      />
                    )}
                  </div>
                )}
              </button>

              {/* Submenu */}
              {item.submenu && expandedItems.includes(item.id) && !isCollapsed && (
                <div className="ml-6 mt-1 space-y-1">
                  {item.submenu.map((subItem) => (
                    <button
                      key={subItem.id}
                      onClick={() => onSectionChange(subItem.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                        activeSection === subItem.id
                          ? 'bg-[var(--accent-blue)]/20 text-[var(--accent-blue)]'
                          : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
                      }`}
                    >
                      <div className="flex items-center">
                        {subItem.icon}
                        <span className="ml-2">{subItem.label}</span>
                      </div>
                      {subItem.badge && (
                        <span className="px-2 py-1 text-xs bg-[var(--accent-blue)] text-white rounded-full">
                          {subItem.badge}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-[var(--border-light)]">
        {!isCollapsed && (
          <div className="space-y-2">
            <button className="w-full flex items-center px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-lg transition-colors">
              <Settings className="h-4 w-4" />
              <span className="ml-3">Settings</span>
            </button>
            <button className="w-full flex items-center px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-lg transition-colors">
              <HelpCircle className="h-4 w-4" />
              <span className="ml-3">Help & Support</span>
            </button>
            <button className="w-full flex items-center px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors">
              <LogOut className="h-4 w-4" />
              <span className="ml-3">Logout</span>
            </button>
          </div>
        )}
        {isCollapsed && (
          <div className="space-y-2">
            <button className="w-full flex items-center justify-center p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-lg transition-colors">
              <Settings className="h-5 w-5" />
            </button>
            <button className="w-full flex items-center justify-center p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-lg transition-colors">
              <HelpCircle className="h-5 w-5" />
            </button>
            <button className="w-full flex items-center justify-center p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

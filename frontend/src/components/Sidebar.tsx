import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Link, useLocation } from "react-router-dom"
import { useState } from "react"
import { useItemCounts } from "@/hooks/useItemCounts"
import { Badge } from "@/components/ui/badge"
import {
  ChevronRight,
  LayoutDashboard,
  Code,
  Database,
  Server,
  Network,
  MessageSquare,
  Cloud,
  Shield,
  LineChart,
  PanelLeftClose,
  PanelLeftOpen,
  CheckSquare,
  ClipboardCheck,
  Settings,
  BookOpen,
} from "lucide-react"

interface NavItem {
  label: string
  icon?: any
  href: string
  subItems?: NavItem[]
}

interface NavGroup {
  label: string
  items: NavItem[]
}

export function Sidebar({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const location = useLocation()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['Platform'])
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const { counts, isLoading } = useItemCounts()

  const toggleGroup = (group: string) => {
    setExpandedGroups(current =>
      current.includes(group)
        ? current.filter(item => item !== group)
        : [...current, group]
    )
  }

  const toggleItem = (item: string) => {
    setExpandedItems(current =>
      current.includes(item)
        ? current.filter(i => i !== item)
        : [...current, item]
    )
  }

  const renderBadge = (label: string) => {
    if (isLoading) return null;
    
    let count = 0;
    switch (label) {
      case 'Tasks':
        count = counts.tasks;
        break;
      case 'Lessons':
        count = counts.lessons;
        break;
      case 'Courses':
        count = counts.courses;
        break;
      default:
        return null;
    }

    if (count === 0) return null;

    return (
      <Badge variant="secondary" className="ml-auto">
        {count}
      </Badge>
    );
  };

  const navigationGroups: NavGroup[] = [
    {
      label: "System Architecture",
      items: [
        {
          label: "Dashboard",
          icon: LayoutDashboard,
          href: "/"
        },
        {
          label: "Frontend",
          icon: Code,
          href: "/frontend",
          subItems: [
            { label: "Runtime Environments", href: "/frontend/runtime" },
            { label: "Build & Compiler Tools", href: "/frontend/build-tools" },
            { label: "UI Frameworks", href: "/frontend/ui-frameworks" },
            { label: "JS Libraries", href: "/frontend/libraries" },
            { label: "Testing & QA", href: "/frontend/testing" }
          ]
        },
        {
          label: "Middleware",
          icon: Network,
          href: "/middleware",
          subItems: [
            { label: "API Gateway", href: "/middleware/api-gateway" },
            { label: "API Layer", href: "/middleware/api-layer" }
          ]
        },
        {
          label: "Backend",
          icon: Server,
          href: "/backend",
          subItems: [
            { label: "Languages", href: "/backend/languages" },
            { label: "Runtime Environments", href: "/backend/runtime" },
            { label: "Web Frameworks", href: "/backend/web-frameworks" },
            { label: "API Frameworks", href: "/backend/api-frameworks" },
            { label: "Testing & QA", href: "/backend/testing" }
          ]
        },
        {
          label: "Database",
          icon: Database,
          href: "/database",
          subItems: [
            { label: "SQL Databases", href: "/database/sql" },
            { label: "NoSQL Databases", href: "/database/nosql" },
            { label: "Object Storage", href: "/database/object-storage" },
            { label: "In-Memory Caches", href: "/database/cache" },
            { label: "Search & Analytics", href: "/database/search" }
          ]
        },
        {
          label: "Messaging",
          icon: MessageSquare,
          href: "/messaging",
          subItems: [
            { label: "Message Brokers", href: "/messaging/brokers" },
            { label: "Message Queues", href: "/messaging/queues" },
            { label: "Task Queues", href: "/messaging/tasks" }
          ]
        },
        {
          label: "DevOps",
          icon: Cloud,
          href: "/devops",
          subItems: [
            { label: "Version Control", href: "/devops/version-control" },
            { label: "CDN", href: "/devops/cdn" },
            { label: "Containerization", href: "/devops/containers" },
            { label: "Orchestration", href: "/devops/orchestration" },
            { label: "Infrastructure as Code", href: "/devops/iac" },
            { label: "CI/CD Pipeline", href: "/devops/cicd" }
          ]
        },
        {
          label: "Security",
          icon: Shield,
          href: "/security",
          subItems: [
            { label: "Authentication", href: "/security/auth" },
            { label: "Authorization", href: "/security/authz" }
          ]
        },
        {
          label: "Monitoring",
          icon: LineChart,
          href: "/monitoring",
          subItems: [
            { label: "Logging", href: "/monitoring/logging" },
            { label: "Tracing", href: "/monitoring/tracing" },
            { label: "Alerting", href: "/monitoring/alerting" }
          ]
        }
      ]
    },
    {
      label: "Administration",
      items: [
        {
          label: "Tasks",
          icon: CheckSquare,
          href: "/tasks",
        },
        {
          label: "Lessons",
          icon: BookOpen,
          href: "/lessons"
        },
        {
          label: "Courses",
          icon: BookOpen,
          href: "/courses"
        },
        {
          label: "Assessments",
          icon: ClipboardCheck,
          href: "/assessments"
        },
        {
          label: "Settings",
          icon: Settings,
          href: "/settings"
        }
      ]
    }
  ]

  return (
    <div className={cn("relative flex flex-col bg-[#232e43] text-gray-300", isCollapsed ? "w-16" : "w-64", className)}>
      <div className="flex h-14 items-center justify-between px-4 border-b border-gray-700">
        {!isCollapsed && <span className="font-medium text-gray-200">Tech Dashboard</span>}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(x => !x)}
          className="ml-auto text-gray-400 hover:text-gray-200 hover:bg-gray-700/50"
        >
          {isCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-4 py-4">
          {navigationGroups.map((group) => (
            <div key={group.label} className="px-3 py-2">
              <div className="px-4 mb-2">
                {!isCollapsed && (
                  <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
                    {group.label}
                  </span>
                )}
              </div>
              <div className="space-y-1">
                {(!isCollapsed || expandedGroups.includes(group.label)) &&
                  group.items.map((item) => (
                    <div key={item.href}>
                      <Link to={item.href}>
                        <Button
                          variant={location.pathname === item.href ? "secondary" : "ghost"}
                          className={cn(
                            "w-full justify-start text-gray-300 font-light hover:bg-gray-700/50 hover:text-gray-100",
                            isCollapsed && "justify-center px-2",
                            item.subItems && expandedItems.includes(item.label) && "bg-gray-700/30",
                            location.pathname === item.href && "bg-gray-700/50 text-gray-100"
                          )}
                          onClick={(e) => {
                            if (item.subItems) {
                              e.preventDefault()
                              toggleItem(item.label)
                            }
                          }}
                        >
                          {item.icon && <item.icon className={cn("h-4 w-4 text-gray-400", !isCollapsed && "mr-2")} />}
                          {!isCollapsed && (
                            <>
                              {/* Every catergory menu item  */}
                              {item.label}
                              {renderBadge(item.label)}
                              {item.subItems && (
                                <ChevronRight
                                  size={16}
                                  className={cn(
                                    "ml-auto transition-transform text-gray-400",
                                    expandedItems.includes(item.label) && "rotate-90"
                                  )}
                                />
                              )}
                            </>
                          )}
                        </Button>
                      </Link>
                      {!isCollapsed && item.subItems && expandedItems.includes(item.label) && (
                        <div className="pl-6 mt-1 space-y-1">
                          {item.subItems.map((subItem) => (
                            // Each subcategory menu item
                            <Link key={subItem.href} to={subItem.href}>
                              <Button
                                variant={location.pathname === subItem.href ? "secondary" : "ghost"}
                                className={cn(
                                  "w-full justify-start text-sm font-light text-gray-400 hover:bg-gray-700/50 hover:text-gray-200",
                                  location.pathname === subItem.href && "bg-gray-700/50 text-gray-200"
                                )}
                              >
                                {subItem.label}
                              </Button>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="mt-auto border-t border-gray-700 p-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gray-700" />
          {!isCollapsed && (
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-200">Brian Wilson</p>
              <p className="text-xs text-gray-500">bwil0007@gmail.com</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 
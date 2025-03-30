import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Link, useLocation } from "react-router-dom"
import { useState } from "react"
import {
  ChevronRight,
  LayoutDashboard,
  Settings,
  History,
  Star,
  Library,
  PanelLeftClose,
  PanelLeftOpen,
  Boxes,
  Timer,
  Users,
  Plane,
  MoreHorizontal,
} from "lucide-react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

interface NavItem {
  label: string
  icon: any
  href: string
}

interface NavGroup {
  label: string
  items: NavItem[]
}

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['Platform'])

  const toggleGroup = (group: string) => {
    setExpandedGroups(current =>
      current.includes(group)
        ? current.filter(item => item !== group)
        : [...current, group]
    )
  }

  const navigationGroups: NavGroup[] = [
    {
      label: "Platform",
      items: [
        {
          label: "Dashboard",
          icon: LayoutDashboard,
          href: "/"
        },
        {
          label: "History",
          icon: History,
          href: "/history"
        },
        {
          label: "Starred",
          icon: Star,
          href: "/starred"
        }
      ]
    },
    {
      label: "Projects",
      items: [
        {
          label: "Design Engineering",
          icon: Boxes,
          href: "/design"
        },
        {
          label: "Sales & Marketing",
          icon: Users,
          href: "/sales"
        },
        {
          label: "Travel",
          icon: Plane,
          href: "/travel"
        }
      ]
    }
  ]

  const sidebarWidth = isCollapsed ? "w-16" : "w-64"

  return (
    <div className={cn("relative flex flex-col border-r", sidebarWidth, className)}>
      <div className="flex h-14 items-center justify-between px-4 border-b">
        {!isCollapsed && <span className="font-semibold">Tech Dashboard</span>}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(x => !x)}
          className="ml-auto"
        >
          {isCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-4 py-4">
          {navigationGroups.map((group) => (
            <div key={group.label} className="px-3 py-2">
              <div
                className="flex items-center justify-between mb-2 px-4 cursor-pointer"
                onClick={() => !isCollapsed && toggleGroup(group.label)}
              >
                {!isCollapsed && (
                  <>
                    <span className="text-sm font-medium text-muted-foreground">
                      {group.label}
                    </span>
                    <ChevronRight
                      size={16}
                      className={cn(
                        "text-muted-foreground transition-transform",
                        expandedGroups.includes(group.label) && "rotate-90"
                      )}
                    />
                  </>
                )}
              </div>
              <div className="space-y-1">
                {(!isCollapsed || expandedGroups.includes(group.label)) &&
                  group.items.map((item) => (
                    <Link key={item.href} to={item.href}>
                      <Button
                        variant={location.pathname === item.href ? "secondary" : "ghost"}
                        className={cn(
                          "w-full justify-start",
                          isCollapsed && "justify-center px-2"
                        )}
                      >
                        <item.icon className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
                        {!isCollapsed && item.label}
                      </Button>
                    </Link>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="mt-auto border-t p-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-muted" />
          {!isCollapsed && (
            <div className="space-y-1">
              <p className="text-sm font-medium">shadcn</p>
              <p className="text-xs text-muted-foreground">m@example.com</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 
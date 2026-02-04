import {
  LayoutDashboard,
  Briefcase,
  Calendar,
  Bell,
  BarChart3,
  CalendarDays,
  User,
  ChevronLeft,
  Menu
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Jobs", url: "/jobs", icon: Briefcase },
  { title: "Interviews", url: "/interviews", icon: Calendar },
  { title: "Reminders", url: "/reminders", icon: Bell },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Calendar", url: "/calendar", icon: CalendarDays },
];

export function AppSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-sidebar-border bg-sidebar"
    >
      <SidebarHeader className="p-4">
        <div className={cn(
          "flex items-center gap-3 transition-all duration-300",
          isCollapsed && "justify-center"
        )}>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-purple-glow">
            <Briefcase className="h-5 w-5" />
          </div>
          {!isCollapsed && (
            <div className="animate-fade-in">
              <h1 className="font-bold text-foreground">Job Tracker</h1>
              <p className="text-xs text-muted-foreground">Application Tracker</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <NavLink
                    to={item.url}
                    end={item.url === "/"}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sidebar-foreground transition-all duration-200",
                      "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:translate-x-1",
                      isCollapsed && "justify-center px-2"
                    )}
                    activeClassName="bg-primary text-primary-foreground shadow-md hover:bg-primary hover:text-primary-foreground hover:translate-x-0"
                  >
                    <item.icon className={cn("h-5 w-5 shrink-0", !isCollapsed && "mr-1")} />
                    {!isCollapsed && <span className="font-medium">{item.title}</span>}
                  </NavLink>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <NavLink
              to="/profile"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sidebar-foreground transition-all duration-200",
                "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:translate-x-1",
                isCollapsed && "justify-center px-2"
              )}
              activeClassName="bg-primary text-primary-foreground shadow-md hover:bg-primary hover:text-primary-foreground hover:translate-x-0"
            >
              <User className={cn("h-5 w-5 shrink-0", !isCollapsed && "mr-1")} />
              {!isCollapsed && <span className="font-medium">Profile</span>}
            </NavLink>
          </SidebarMenuItem>
        </SidebarMenu>

        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className={cn(
            "mt-2 w-full justify-center text-muted-foreground hover:text-foreground",
            isCollapsed && "px-0"
          )}
        >
          {isCollapsed ? (
            <Menu className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4 mr-2" />
              <span>Collapse</span>
            </>
          )}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}

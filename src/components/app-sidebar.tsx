import { useState } from "react"
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  FileText, 
  CreditCard, 
  Receipt, 
  Truck,
  LogOut,
  User
} from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

const navigationItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Stock Management", url: "/stocks", icon: Package },
  { title: "Order Management", url: "/orders", icon: ShoppingCart },
  { title: "Invoice Management", url: "/invoices", icon: FileText },
  { title: "Payment Recording", url: "/payments", icon: CreditCard },
  { title: "Receipt Management", url: "/receipts", icon: Receipt },
  { title: "Delivery Notes", url: "/delivery-notes", icon: Truck },
]

export function AppSidebar() {
  const { state } = useSidebar()
  const location = useLocation()
  const currentPath = location.pathname
  const isCollapsed = state === "collapsed"

  const isActive = (path: string) => currentPath === path
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-primary text-primary-foreground hover:bg-primary/90" : "hover:bg-accent"

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b p-4">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <Package className="h-8 w-8 text-primary" />
            <div>
              <h2 className="text-lg font-bold text-foreground">ManufacturingERP</h2>
              <p className="text-sm text-muted-foreground">Sales System</p>
            </div>
          </div>
        )}
        {isCollapsed && (
          <Package className="h-8 w-8 text-primary mx-auto" />
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        {!isCollapsed ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4" />
              <span>Admin User</span>
            </div>
            <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => {}}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <Button variant="ghost" size="sm" className="w-full p-2">
              <User className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="w-full p-2">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
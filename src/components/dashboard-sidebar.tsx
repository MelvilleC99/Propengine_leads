"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";
import {
  TrendingUp,
  Users,
  PieChart,
  Home,
  Building2,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const navigation = [
  {
    name: "Sales & Leads",
    href: "/sales",
    icon: TrendingUp,
  },
  {
    name: "Leads Analysis",
    href: "/leads",
    icon: Users,
  },
  {
    name: "Lead Spend & ROI",
    href: "/leads-marketing-roi",
    icon: PieChart,
  },
  {
    name: "Inventory Analysis",
    href: "/inventory-analysis",
    icon: Home,
  },
  {
    name: "Property Lead Insights",
    href: "/property-lead-insights",
    icon: Building2,
  },
];

interface DashboardSidebarProps {
  mobileMenuOpen: boolean;
  onMobileMenuClose: () => void;
}

export function DashboardSidebar({ mobileMenuOpen, onMobileMenuClose }: DashboardSidebarProps) {
  const pathname = usePathname();

  const SidebarContent = () => (
    <nav className="flex-1 space-y-1 px-3 py-4">
      {navigation.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            onClick={onMobileMenuClose}
            className={cn(
              "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
              isActive
                ? "bg-blue-100 text-blue-700"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            )}
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-full w-64 flex-col bg-gray-50 border-r border-gray-200">
        <div className="flex h-16 items-center px-6 border-b border-gray-200">
          <Image 
            src="/Property Engine Logo.png" 
            alt="Property Engine" 
            width={150} 
            height={40}
            className="object-contain"
          />
        </div>
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={mobileMenuOpen} onOpenChange={onMobileMenuClose}>
        <SheetContent side="left" className="w-64 p-0">
          <SheetHeader className="border-b border-gray-200 p-4">
            <SheetTitle>
              <Image 
                src="/Property Engine Logo.png" 
                alt="Property Engine" 
                width={150} 
                height={40}
                className="object-contain"
              />
            </SheetTitle>
          </SheetHeader>
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  );
}

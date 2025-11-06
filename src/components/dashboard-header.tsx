"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  onMobileMenuOpen: () => void;
}

export function DashboardHeader({ onMobileMenuOpen }: DashboardHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-4 flex items-center">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden mr-2"
        onClick={onMobileMenuOpen}
      >
        <Menu className="h-6 w-6" />
        <span className="sr-only">Open menu</span>
      </Button>
    </header>
  );
}

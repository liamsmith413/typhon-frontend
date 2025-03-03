import React, { useState } from "react";
import { SideNav } from "./side-nav";
import { NavItems } from "../constants/side-nav";
import { cn } from "../../lib/utils";
import { useSidebar } from "../hooks/useSidebar";
import { BsArrowLeftShort } from "react-icons/bs";

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const { isOpen, toggle } = useSidebar();
  const [status, setStatus] = useState(false);

  const handleToggle = () => {
    setStatus(true);
    toggle();
    setTimeout(() => setStatus(false), 500);
  };

  return (
    <nav
      className={cn(
        "relative hidden h-screen border-r pt-20 md:block bg-[black]",
        status && "duration-500",
        isOpen ? "w-72" : "w-[78px]",
        className
      )}
    >
      <BsArrowLeftShort
        className={cn(
          "absolute -right-3 top-20 cursor-pointer rounded-full border bg-background text-3xl text-foreground",
          !isOpen && "rotate-180"
        )}
        onClick={handleToggle}
      />
      <div className="relative h-[calc(100vh-5rem)] overflow-hidden">
        <div className="h-full overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-500">
          <div className="space-y-4 py-4">
            <div className="px-3 py-2">
              <div className="mt-3 space-y-1">
                <SideNav
                  className={cn(
                    "text-background transition-all duration-300",
                    isOpen
                      ? "opacity-100"
                      : "opacity-0 group-hover:z-50 group-hover:ml-4 group-hover:rounded group-hover:bg-foreground group-hover:p-2 group-hover:opacity-100"
                  )}
                  items={NavItems}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
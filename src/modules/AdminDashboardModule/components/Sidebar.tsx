import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Menu, X, LogOut } from "lucide-react";
import { NAV_ITEMS } from "../constant";
import { deleteCookie } from "cookies-next";
import { toast } from "sonner";

interface SidebarProps {
  onNavigate: (section: string) => void;
}

export const Sidebar = ({ onNavigate }: SidebarProps) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");

  const handleNavigation = (sectionId: string) => {
    setActiveSection(sectionId);
    onNavigate(sectionId);
    setIsOpen(false);
  };

  const handleLogout = () => {
    deleteCookie("token");
    toast.success("Berhasil logout");
    router.push("/admin");
  };

  return (
    <>
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <aside
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed top-0 left-0 h-screen w-64 bg-white border-r transform transition-transform duration-200 ease-in-out lg:relative lg:transform-none z-40`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6">
            <div className="relative w-20 h-20 mx-auto">
              <Image
                src="/jagajkn-logo.png"
                alt="JagaJKN Logo"
                fill
                sizes="none"
                className="object-contain"
              />
            </div>
          </div>

          <nav className="flex-1 px-4 space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    activeSection === item.id
                      ? "bg-[#F5F5FF] text-[#04A04A]"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Keluar
            </button>
          </div>
        </div>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 lg:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

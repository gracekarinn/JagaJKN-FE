"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "./components/Sidebar";
import { DashboardSection } from "./sections/DashboardSection";
import FaskesManagementSection from "./sections/FaskesManagement";
import { getCookie, deleteCookie } from "cookies-next";
import { toast } from "sonner";
import ImportCSVSection from "./sections/ImportCSV";

export const AdminDashboard = () => {
  const router = useRouter();
  const [currentSection, setCurrentSection] = useState("dashboard");

  useEffect(() => {
    const token = getCookie("token");
    if (!token) {
      router.push("/admin");
    }
  }, [router]);

  const handleLogout = () => {
    deleteCookie("token");
    toast.success("Berhasil logout");
    router.push("/admin");
  };

  const renderSection = () => {
    switch (currentSection) {
      case "dashboard":
        return <DashboardSection />;
      case "faskes":
        return <FaskesManagementSection />;
      case "migrasi":
        return <ImportCSVSection />;
      default:
        return <DashboardSection />;
    }
  };

  return (
    <div className="flex h-screen bg-[#F5F5FF] overflow-hidden">
      <div className="fixed inset-y-0 left-0 z-50 w-64 lg:relative lg:z-0">
        <Sidebar onNavigate={(section) => setCurrentSection(section)} />
      </div>

      <div className="flex-1 flex flex-col min-w-0 lg:ml-0">
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto">{renderSection()}</div>
        </main>
      </div>
    </div>
  );
};

export const FaskesManagement = FaskesManagementSection;

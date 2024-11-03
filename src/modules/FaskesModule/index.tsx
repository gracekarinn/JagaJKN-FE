"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "./components/Sidebar";
import { DashboardSection } from "./sections/DashboardSection";
import { RecordsSection } from "./sections/RecordsSection";
import { TransferSection } from "./sections/TransferSection";
import { ProfileSection } from "./sections/ProfileSection";
import { getCookie } from "cookies-next";
import { toast } from "sonner";

export const FaskesModule = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState("dashboard");

  useEffect(() => {
    const checkAuth = () => {
      const token = getCookie("token");
      if (!token) {
        toast.error("Sesi anda telah berakhir");
        router.replace("/faskes");
        return false;
      }
      return true;
    };

    const isAuthenticated = checkAuth();
    if (isAuthenticated) {
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const renderSection = () => {
    switch (currentSection) {
      case "dashboard":
        return <DashboardSection />;
      case "records":
        return <RecordsSection />;
      case "transfers":
        return <TransferSection />;
      case "profile":
        return <ProfileSection />;
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

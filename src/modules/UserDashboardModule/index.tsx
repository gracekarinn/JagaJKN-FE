"use client";
import { deleteCookie, getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { DashboardSection } from "./sections/DashboardSection";
import { DataSayaSection } from "./sections/DataSayaSection";
import { LayoutDashboard, UserCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const UserDashboardModule = () => {
  const router = useRouter();
  const [currentSection, setCurrentSection] = useState("dashboard");

  useEffect(() => {
    const token = getCookie("token");
    if (!token) {
      router.push("/");
    }
  }, [router]);

  const handleLogout = () => {
    deleteCookie("token");
    toast.success("Berhasil logout");
    router.push("/");
  };

  const renderSection = () => {
    switch (currentSection) {
      case "dashboard":
        return <DashboardSection />;
      case "data-saya":
        return <DataSayaSection />;
      default:
        return <DashboardSection />;
    }
  };

  const navigationItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      id: "data-saya",
      label: "Data Saya",
      icon: <UserCircle className="w-5 h-5" />,
    },
  ];

  return (
    <div>
      <div className="py-16">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Card className="bg-white rounded-lg shadow">{renderSection()}</Card>
        </main>
      </div>
    </div>
  );
};

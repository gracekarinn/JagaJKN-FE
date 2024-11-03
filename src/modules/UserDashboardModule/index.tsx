"use client";

import { deleteCookie, getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { DashboardSection } from "./sections/DashboardSection";
import { DataSayaSection } from "./sections/DataSayaSection";

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
  return <div></div>;
};

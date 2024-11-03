"use client";
import { deleteCookie, getCookie } from "cookies-next";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { DashboardSection } from "./sections/DashboardSection";
import { DataSayaSection } from "./sections/DataSayaSection";
import { ProfileSection } from "./sections/ProfileSection";

export const UserDashboardModule = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const section = searchParams.get("section");

  useEffect(() => {
    const token = getCookie("token");
    if (!token) {
      router.push("/");
    }
  }, [router]);

  const renderSection = () => {
    switch (section) {
      case "data-saya":
        return <DataSayaSection />;
      case "dashboard":
        return <DashboardSection />;
      case "profile":
        return <ProfileSection />;
      default:
        return <DashboardSection />;
    }
  };

  return (
    <div>
      <div className="py-16">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {renderSection()}
        </main>
      </div>
    </div>
  );
};

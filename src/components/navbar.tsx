"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export const Navbar = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const pathname = usePathname();
  const isAuthenticated = false;

  const isActivePath = (path: string) => {
    return pathname === path;
  };

  const handleProtectedRoute = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      setShowAuthModal(true);
    }
  };

  return (
    <>
      <nav className="bg-[#F5F5FF] fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 sm:px-10 lg:px-12">
          <div className="flex items-center justify-between h-20">
            <div className="relative w-[100px] h-[40px] ml-4">
              <Link href="/">
                <Image
                  src="/jagajkn-logo.png"
                  alt="JagaJKN Logo"
                  fill
                  sizes="none"
                  className="object-contain"
                />
              </Link>
            </div>
            <div className="flex items-center gap-x-12">
              <Link
                href="/"
                className={`font-medium transition-colors ${
                  isActivePath("/beranda")
                    ? "text-[#04A04A]"
                    : "text-gray-700 hover:text-[#04A04A]"
                }`}
              >
                Beranda
              </Link>
              <Link
                href="/dashboard"
                onClick={handleProtectedRoute}
                className={`font-medium transition-colors ${
                  isActivePath("/dashboard")
                    ? "text-[#04A04A]"
                    : "text-gray-700 hover:text-[#04A04A]"
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/data-saya"
                onClick={handleProtectedRoute}
                className={`font-medium transition-colors ${
                  isActivePath("/data-saya")
                    ? "text-[#04A04A]"
                    : "text-gray-700 hover:text-[#04A04A]"
                }`}
              >
                Data Saya
              </Link>
              <Link
                href="/register"
                className="bg-[#04A04A] text-white px-8 py-2 rounded-full font-medium hover:bg-[#038B3F] transition-colors"
              >
                Masuk
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              Autentikasi Diperlukan
            </DialogTitle>
            <DialogDescription className="pt-2">
              Silahkan login terlebih dahulu untuk mengakses halaman ini.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setShowAuthModal(false)}
              className="px-4"
            >
              Tutup
            </Button>
            <Link href="/register">
              <Button className="bg-[#04A04A] hover:bg-[#038B3F] px-4">
                Login Sekarang
              </Button>
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

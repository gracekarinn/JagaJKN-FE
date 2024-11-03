"use client";
import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { User } from "lucide-react";
import { deleteCookie, getCookie } from "cookies-next";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface UserProfile {
  id: number;
  nik: string;
  namaLengkap: string;
  noTelp: string;
  email?: string;
  createdAt: string;
  updatedAt: string;
}

// Separate the navigation links into a client component
const NavigationLinks = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const token = getCookie("token");
    setIsLoggedIn(!!token);
  }, []);

  const isActivePath = (path: string, section?: string) => {
    if (section) {
      return pathname === path && searchParams.get("section") === section;
    }
    return pathname === path && !searchParams.get("section");
  };

  const handleProtectedRoute = (e: React.MouseEvent) => {
    if (!isLoggedIn) {
      e.preventDefault();
      setShowAuthModal(true);
    }
  };

  return (
    <>
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
        href="/dashboard?section=data-saya"
        onClick={handleProtectedRoute}
        className={`font-medium transition-colors ${
          searchParams.get("section") === "data-saya"
            ? "text-[#04A04A]"
            : "text-gray-700 hover:text-[#04A04A]"
        }`}
      >
        Data Saya
      </Link>

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
            <Link href="/login">
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

const UserMenu = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = getCookie("token");
    setIsLoggedIn(!!token);
    if (token) {
      fetchUserInfo();
    }
  }, []);

  const fetchUserInfo = async () => {
    const token = getCookie("token");
    if (!token) return;

    try {
      const tokenToUse = token.startsWith("Bearer ")
        ? token
        : `Bearer ${token}`;
      const res = await fetch(
        "https://jagajkn-be-production.up.railway.app/api/v1/user/profile",
        {
          headers: {
            Authorization: tokenToUse,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        if (res.status === 401) {
          handleLogout();
          toast.error("Session telah berakhir. Silahkan login kembali.");
          return;
        }
        throw new Error("Failed to fetch profile");
      }

      const data = await res.json();
      if (data.status === "success" && data.user?.namaLengkap) {
        setUserName(data.user.namaLengkap);
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
      if (error instanceof Error) {
        toast.error(error.message || "Gagal memuat profil");
      }
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName(null);
    deleteCookie("token");
    toast.success("Berhasil logout");
    router.push("/");
  };

  if (!isLoggedIn) {
    return (
      <Link
        href="/login"
        className="bg-[#04A04A] text-white px-8 py-2 rounded-full font-medium hover:bg-[#038B3F] transition-colors"
      >
        Masuk
      </Link>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center bg-[#04A04A] text-white px-8 py-2 rounded-full font-medium hover:bg-[#038B3F] transition-colors"
      >
        Halo, {userName || "User"}
        <User className="ml-2 w-5 h-5" />
      </button>
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">
          <Link
            href="/dashboard?section=profile"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Profile
          </Link>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

const Navbar = () => {
  return (
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
            <Suspense fallback={<div>Loading...</div>}>
              <NavigationLinks />
            </Suspense>
            <Suspense fallback={<div>Loading...</div>}>
              <UserMenu />
            </Suspense>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

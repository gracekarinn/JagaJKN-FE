"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, LogOut, User } from "lucide-react";
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

interface ApiError {
  status: string;
  message: string;
  details?: string;
}

interface ApiResponse {
  status: string;
  user: UserProfile;
}

export const Navbar = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const fetchUserInfo = async () => {
    const token = getCookie("token");

    if (token) {
      try {
        // Debug token
        console.log("Token check:", {
          length: token.length,
          hasBearer: token.startsWith("Bearer "),
          preview: token.substring(0, 20) + "...",
        });

        const tokenToUse = token.startsWith("Bearer ")
          ? token
          : `Bearer ${token}`;

        const res = await fetch(
          "https://jagajkn-be-production.up.railway.app/api/v1/user/profile",
          {
            method: "GET",
            headers: {
              Authorization: tokenToUse,
              "Content-Type": "application/json",
            },
          }
        );

        // Log response details
        console.log("Response status:", res.status);

        const data = await res.json();
        console.log("Profile response:", data);

        if (!res.ok) {
          if (res.status === 401) {
            deleteCookie("token");
            router.push("/login");
            toast.error("Session telah berakhir. Silahkan login kembali.");
            return;
          }
          throw new Error(data.message || "Gagal memuat profil");
        }

        if (data.status === "success" && data.user?.namaLengkap) {
          setUserName(data.user.namaLengkap);
        } else {
          console.error("Unexpected response format:", data);
          toast.error("Terjadi kesalahan saat memuat profil");
        }
      } catch (error) {
        console.error("Profile fetch error:", error);
        if (
          error instanceof Error &&
          (error.message.includes("Unauthorized") ||
            error.message.includes("Invalid token"))
        ) {
          deleteCookie("token");
          router.push("/login");
          toast.error("Session telah berakhir. Silahkan login kembali.");
        }
      }
    } else {
      console.log("No token found in cookies");
    }
  };

  useEffect(() => {
    if (isClient) {
      fetchUserInfo();
    }
  }, [isClient]);

  const isActivePath = (path: string) => {
    return pathname === path;
  };

  const handleProtectedRoute = (e: React.MouseEvent) => {
    if (!isClient || !getCookie("token")) {
      e.preventDefault();
      setShowAuthModal(true);
    }
  };

  const handleLogout = () => {
    deleteCookie("token");
    toast.success("Berhasil logout");
    router.push("/login");
  };

  if (!isClient) {
    return null;
  }

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
              {getCookie("token") ? (
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
                        href="/profile"
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
              ) : (
                <Link
                  href="/login"
                  className="bg-[#04A04A] text-white px-8 py-2 rounded-full font-medium hover:bg-[#038B3F] transition-colors"
                >
                  Masuk
                </Link>
              )}
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

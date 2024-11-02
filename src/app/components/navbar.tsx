"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Navbar = () => {
  const pathname = usePathname();

  const isActivePath = (path: string) => {
    return pathname === path;
  };

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
  );
};

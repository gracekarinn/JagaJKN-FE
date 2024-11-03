"use client";
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { getCookie } from "cookies-next";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface UserProfile {
  namaLengkap: string;
  nik: string;
  tanggalLahir: string;
  jenisKelamin: string;
  noTelp: string;
  email?: string;
  alamat: string;
  noKartuJKN: string;
  faskesTingkat1: string;
  kelas: string;
}

export const ProfileSection = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const fetchProfile = async () => {
    try {
      const token = getCookie("token");
      if (!token) return;

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
        throw new Error("Failed to fetch profile");
      }

      const data = await res.json();
      if (data.status === "success" && data.user) {
        setProfile(data.user);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Gagal memuat profil");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-[#04A04A]" />
          <p className="text-sm text-gray-500">Memuat profil...</p>
        </div>
      </div>
    );
  }

  const InfoSection = ({
    title,
    items,
  }: {
    title: string;
    items: { label: string; value: string | undefined }[];
  }) => (
    <Card className="p-6 space-y-4">
      <h2 className="text-xl font-bold text-gray-800">{title}</h2>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="border-b pb-4 last:border-0 last:pb-0">
            <p className="text-sm font-medium text-gray-600">{item.label}</p>
            <p className="text-base text-gray-900">{item.value || "-"}</p>
          </div>
        ))}
      </div>
    </Card>
  );

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Profil</h1>
      <div className="space-y-6">
        <InfoSection
          title="Informasi Umum"
          items={[
            { label: "Nama Lengkap", value: profile?.namaLengkap },
            { label: "NIK", value: profile?.nik },
            { label: "Tanggal Lahir", value: profile?.tanggalLahir },
            { label: "Jenis Kelamin", value: profile?.jenisKelamin },
            { label: "Nomor Telpon", value: profile?.noTelp },
            { label: "Email", value: profile?.email },
            { label: "Alamat", value: profile?.alamat },
          ]}
        />
        <InfoSection
          title="Informasi Kesehatan"
          items={[
            { label: "No. Kartu JKN", value: profile?.noKartuJKN },
            { label: "Faskes tingkat 1", value: profile?.faskesTingkat1 },
            { label: "Kelas", value: profile?.kelas },
          ]}
        />
      </div>
    </div>
  );
};

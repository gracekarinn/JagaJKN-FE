"use client";
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Activity,
  Calendar,
  FileText,
  Hospital,
  Pill,
  User,
  Clock,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { getCookie } from "cookies-next";
import { toast } from "sonner";

interface UserProfile {
  id: number;
  nik: string;
  namaLengkap: string;
  noTelp: string;
  email?: string;
}

interface ApiResponse {
  status: string;
  user: UserProfile;
}

export const DashboardSection = () => {
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async () => {
    try {
      const token = getCookie("token");
      if (!token) return;

      const response = await fetch(
        "https://jagajkn-be-production.up.railway.app/api/v1/user/profile",
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data: ApiResponse = await response.json();
      if (data.status === "success" && data.user) {
        setUserData(data.user);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Gagal memuat data profil");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const dummyData = {
    memberStatus: "Aktif",
    lastVisit: "RSUD Dr. Soetomo - 15 Jan 2024",
    upcomingAppointment: "RS Husada Utama - 25 Jan 2024",
    healthScore: 85,
  };

  const recentRecords = [
    {
      date: "15 Jan 2024",
      hospital: "RSUD Dr. Soetomo",
      diagnosis: "Demam dan Flu",
      doctor: "dr. Sarah Johnson",
    },
    {
      date: "28 Dec 2023",
      hospital: "RS Premier Surabaya",
      diagnosis: "Medical Check-up",
      doctor: "dr. Ahmad Yani",
    },
  ];

  const medications = [
    {
      name: "Paracetamol",
      dosage: "500mg",
      frequency: "3x sehari",
      duration: "3 hari",
    },
    {
      name: "Amoxicillin",
      dosage: "250mg",
      frequency: "2x sehari",
      duration: "5 hari",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-[#04A04A]" />
          <p className="text-sm text-gray-500">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <div className="bg-gradient-to-r from-[#04A04A] to-[#038B3F] rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center space-x-4 mb-4">
          <div className="bg-white/20 p-3 rounded-full">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">
              {userData?.namaLengkap || "User"}
            </h2>
            <p className="text-sm opacity-90">NIK: {userData?.nik || "-"}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-sm opacity-80">Status Kepesertaan</p>
            <p className="font-semibold">{dummyData.memberStatus}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-sm opacity-80">Health Score</p>
            <p className="font-semibold">{dummyData.healthScore}%</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4 flex flex-col items-center justify-center space-y-2 hover:bg-gray-50 transition-colors cursor-pointer">
          <Hospital className="w-6 h-6 text-[#04A04A]" />
          <span className="text-xs text-center font-medium">Cari Faskes</span>
        </Card>
        <Card className="p-4 flex flex-col items-center justify-center space-y-2 hover:bg-gray-50 transition-colors cursor-pointer">
          <Calendar className="w-6 h-6 text-[#04A04A]" />
          <span className="text-xs text-center font-medium">Jadwal</span>
        </Card>
        <Card className="p-4 flex flex-col items-center justify-center space-y-2 hover:bg-gray-50 transition-colors cursor-pointer">
          <FileText className="w-6 h-6 text-[#04A04A]" />
          <span className="text-xs text-center font-medium">Riwayat</span>
        </Card>
        <Card className="p-4 flex flex-col items-center justify-center space-y-2 hover:bg-gray-50 transition-colors cursor-pointer">
          <Activity className="w-6 h-6 text-[#04A04A]" />
          <span className="text-xs text-center font-medium">Emergency</span>
        </Card>
      </div>

      <div className="space-y-4">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#04A04A]" />
              Jadwal Temu Berikutnya
            </h3>
          </div>
          <p className="text-sm text-gray-600">
            {dummyData.upcomingAppointment}
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#04A04A]" />
              Riwayat Kunjungan Terakhir
            </h3>
          </div>
          <div className="space-y-3">
            {recentRecords.map((record, index) => (
              <div
                key={index}
                className="border-b last:border-0 pb-2 last:pb-0"
              >
                <p className="text-sm font-medium">{record.hospital}</p>
                <p className="text-xs text-gray-500">
                  {record.date} - {record.diagnosis}
                </p>
                <p className="text-xs text-gray-500">{record.doctor}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Pill className="w-5 h-5 text-[#04A04A]" />
              Pengobatan Aktif
            </h3>
          </div>
          <div className="space-y-3">
            {medications.map((med, index) => (
              <div
                key={index}
                className="border-b last:border-0 pb-2 last:pb-0"
              >
                <p className="text-sm font-medium">{med.name}</p>
                <p className="text-xs text-gray-500">
                  {med.dosage} - {med.frequency}
                </p>
                <p className="text-xs text-gray-500">Durasi: {med.duration}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-4 bg-green-50">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="w-5 h-5 text-[#04A04A]" />
          <h3 className="font-semibold text-green-700">Tips Kesehatan</h3>
        </div>
        <p className="text-sm text-green-700">
          Jangan lupa untuk selalu menjaga kesehatan dengan berolahraga secara
          teratur dan mengonsumsi makanan bergizi seimbang.
        </p>
      </Card>
    </div>
  );
};

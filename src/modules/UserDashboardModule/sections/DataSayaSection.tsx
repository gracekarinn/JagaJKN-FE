"use client";
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Search,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { getCookie } from "cookies-next";
import { toast } from "sonner";

interface MedicalRecord {
  noSEP: string;
  diagnosisAwal: string;
  diagnosisPrimer: string;
  diagnosisSekunder: string;
  jenisRawat: string;
  statusPulang: string;
  tanggalMasuk: string;
  blockchainVerified: boolean;
}

export const DataSayaSection = () => {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchRecords = async () => {
    try {
      const token = getCookie("token");
      if (!token) return;

      const response = await fetch(
        "https://jagajkn-be-production.up.railway.app/api/v1/user/records",
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch records");
      }

      const data = await response.json();
      console.log("Fetched Records:", data.records);

      // Map the fetched data to the expected field names
      const mappedRecords = data.records.map((record: any) => ({
        noSEP: record.noSEP,
        diagnosisAwal: record.diagnosaAwal,
        diagnosisPrimer: record.diagnosaPrimer,
        diagnosisSekunder: record.diagnosaSekunder,
        jenisRawat: record.jenisRawat,
        statusPulang: record.statusPulang,
        tanggalMasuk: record.tanggalMasuk,
        blockchainVerified: record.blockchainVerified,
      }));

      setRecords(mappedRecords || []);
    } catch (error) {
      console.error("Error fetching records:", error);
      toast.error("Gagal memuat rekaman medis");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const filteredRecords = records.filter((record) =>
    Object.values(record).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-[#04A04A]" />
          <p className="text-sm text-gray-500">Memuat rekaman medis...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 min-h-screen">
      <div className="flex flex-col space-y-4">
        <h1 className="text-2xl font-bold">Rekaman Medis Saya</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
          <Input
            placeholder="Cari rekaman medis..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredRecords.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="flex flex-col items-center gap-2">
              <FileText className="w-8 h-8 text-gray-400" />
              <p className="text-gray-500">
                {searchTerm
                  ? "Tidak ada rekaman medis yang sesuai dengan pencarian"
                  : "Belum ada rekaman medis"}
              </p>
            </div>
          </Card>
        ) : (
          filteredRecords.map((record, index) => (
            <Card key={index} className="p-4">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <p className="text-xs text-gray-500">
                    {record.jenisRawat} • {record.statusPulang}
                  </p>
                </div>
                <div
                  className={`flex items-center gap-1 ${
                    record.blockchainVerified
                      ? "text-green-600"
                      : "text-orange-500"
                  }`}
                >
                  {record.blockchainVerified ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <AlertCircle className="w-4 h-4" />
                  )}
                  <span className="text-xs">
                    {record.blockchainVerified
                      ? "Terverifikasi"
                      : "Belum Terverifikasi"}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold">Diagnosis Awal</h3>
                  <p className="text-sm text-gray-600">
                    {record.diagnosisAwal || "Tidak tersedia"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-semibold">Diagnosis Primer</h3>
                    <p className="text-sm text-gray-600">
                      {record.diagnosisPrimer || "Tidak tersedia"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">
                      Diagnosis Sekunder
                    </h3>
                    <p className="text-sm text-gray-600">
                      {record.diagnosisSekunder || "Tidak tersedia"}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    No.SEP: {record.noSEP} • {record.tanggalMasuk}
                  </p>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

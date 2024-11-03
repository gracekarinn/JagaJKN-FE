import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowRight,
  RefreshCw,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { TransferStats } from "../interface";
import { getCookie } from "cookies-next";
import { toast } from "sonner";

export const DashboardSection = () => {
  const [stats, setStats] = useState<TransferStats>({
    totalTransfers: 0,
    pendingTransfers: 0,
    acceptedTransfers: 0,
    recentTransfers: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const token = getCookie("token");

      if (!token) {
        throw new Error("No authentication token found");
      }

      const pendingRes = await fetch(
        "https://jagajkn-be-production.up.railway.app/api/v1/faskes/transfers/pending",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!pendingRes.ok) {
        console.error("Pending Response Status:", pendingRes.status);
        const errorData = await pendingRes.json();
        console.error("Pending Error Data:", errorData);
        throw new Error("Failed to fetch pending transfers");
      }

      const pendingData = await pendingRes.json();
      console.log("Pending Data:", pendingData);

      const historyRes = await fetch(
        "https://jagajkn-be-production.up.railway.app/api/v1/faskes/transfers/history",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!historyRes.ok) {
        console.error("History Response Status:", historyRes.status);
        const errorData = await historyRes.json();
        console.error("History Error Data:", errorData);
        throw new Error("Failed to fetch transfer history");
      }

      const historyData = await historyRes.json();
      console.log("History Data:", historyData);

      const transfers = historyData.transfers || [];
      const pendingTransfers = pendingData.transfers || [];

      setStats({
        totalTransfers: transfers.length + pendingTransfers.length,
        pendingTransfers: pendingTransfers.length,
        acceptedTransfers: transfers.filter((t: any) => t.status === "ACCEPTED")
          .length,
        recentTransfers: [...pendingTransfers, ...transfers]
          .sort(
            (a, b) =>
              new Date(b.transferTime).getTime() -
              new Date(a.transferTime).getTime()
          )
          .slice(0, 5),
      });
    } catch (error) {
      console.error("Failed to fetch stats:", error);
      toast.error("Gagal memuat data transfer");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const statusColors = {
    PENDING: "text-yellow-500",
    ACCEPTED: "text-green-500",
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard Transfer</h2>
        <button
          onClick={fetchStats}
          className="text-sm text-gray-600 flex items-center gap-2 hover:text-green-600"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh Data
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Transfer
            </CardTitle>
            <ArrowRight className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : stats.totalTransfers}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Total keseluruhan transfer
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Transfer Pending
            </CardTitle>
            <Clock className="w-4 h-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">
              {isLoading ? "..." : stats.pendingTransfers}
            </div>
            <p className="text-xs text-gray-500 mt-1">Menunggu persetujuan</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Transfer Diterima
            </CardTitle>
            <CheckCircle className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {isLoading ? "..." : stats.acceptedTransfers}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Transfer yang telah disetujui
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transfer Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500" />
              </div>
            ) : stats.recentTransfers.length > 0 ? (
              stats.recentTransfers.map((transfer) => (
                <div
                  key={transfer.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{transfer.user.nama}</span>
                      <span
                        className={`text-sm ${
                          statusColors[
                            transfer.status as keyof typeof statusColors
                          ]
                        }`}
                      >
                        • {transfer.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {transfer.sourceFaskes} → {transfer.destinationFaskes}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {new Date(transfer.transferTime).toLocaleDateString(
                        "id-ID",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </div>
                  </div>
                  <div className="flex items-center">
                    {transfer.status === "PENDING" ? (
                      <Clock className="w-5 h-5 text-yellow-500" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                Belum ada data transfer
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

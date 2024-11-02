"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Building2 } from "lucide-react";

export const DashboardSection = () => {
  return (
    <div className="p-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-800">
          Selamat Datang di Admin Panel
        </h1>
        <p className="text-slate-600">BPJS Kesehatan Management System</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="bg-blue-50 p-4 rounded-full mr-4">
              <Building2 className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">Total Faskes</p>
              <h3 className="text-2xl font-bold text-slate-800">0</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="bg-green-50 p-4 rounded-full mr-4">
              <Building2 className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">Faskes Aktif</p>
              <h3 className="text-2xl font-bold text-slate-800">0</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="bg-orange-50 p-4 rounded-full mr-4">
              <Building2 className="h-6 w-6 text-orange-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">Pending</p>
              <h3 className="text-2xl font-bold text-slate-800">0</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">
            Quick Actions
          </h2>
          <div className="space-y-2">
            <p className="text-slate-600">
              • Kelola fasilitas kesehatan yang terdaftar
            </p>
            <p className="text-slate-600">
              • Migrasi data pengguna lama ke sistem baru
            </p>
            <p className="text-slate-600">• Monitor aktivitas sistem</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

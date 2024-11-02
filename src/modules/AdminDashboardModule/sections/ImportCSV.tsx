"use client";

import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Users, Upload, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { getCookie } from "cookies-next";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ImportResponse {
  message: string;
  details: {
    success_count: number;
    error_count: number;
    errors: string[];
  };
}

export default function ImportCSVSection() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [lastUploadResult, setLastUploadResult] =
    useState<ImportResponse | null>(null);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleUpload = async (file: File) => {
    if (!file.name.endsWith(".csv")) {
      toast.error("Please upload a CSV file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    try {
      const token = getCookie("token");
      const res = await fetch(
        "https://jagajkn-be-production.up.railway.app/api/v1/admin/users/import",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data: ImportResponse = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to import users");
      }

      setLastUploadResult(data);
      toast.success(
        `Successfully imported ${data.details.success_count} users`
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to import users"
      );
    } finally {
      setUploading(false);
      setIsDragging(false);
    }
  };

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) {
        handleUpload(file);
      }
    },
    [handleUpload]
  );

  const onFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleUpload(file);
      }
    },
    [handleUpload]
  );

  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Migrasi Pengguna Lama
        </h1>
        <p className="text-slate-600">
          Import data pengguna lama menggunakan file CSV
        </p>
      </div>

      {/* CSV Format Guide */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">
          Format CSV yang Dibutuhkan:
        </h2>
        <div className="space-y-2 text-sm text-gray-600">
          <p>Header yang diperlukan:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>NIK (16 digit)</li>
            <li>NamaLengkap</li>
            <li>NoTelp</li>
            <li>Password</li>
            <li>NoSEP (opsional)</li>
            <li>JenisRawat (opsional)</li>
            <li>DiagnosaAwal (opsional)</li>
            <li>DiagnosaPrimer (opsional)</li>
            <li>IcdX (opsional)</li>
            <li>Tindakan (opsional)</li>
          </ul>
        </div>
      </Card>

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center ${
          isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <div className="flex flex-col items-center space-y-4">
          <Users className="h-12 w-12 text-gray-400" />
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Upload File CSV Pengguna</h3>
            <p className="text-sm text-gray-500">
              Drag and drop file CSV atau klik untuk memilih file
            </p>
          </div>
          <div>
            <input
              type="file"
              accept=".csv"
              onChange={onFileSelect}
              className="hidden"
              id="csv-upload"
            />
            <Button
              disabled={uploading}
              onClick={() => document.getElementById("csv-upload")?.click()}
              className="bg-[#04A04A] hover:bg-[#038B3F]"
            >
              {uploading ? (
                <>
                  <Upload className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload CSV
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Upload Results */}
      {lastUploadResult && (
        <div className="space-y-4">
          <Alert
            variant={
              lastUploadResult.details.error_count > 0
                ? "destructive"
                : "default"
            }
          >
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Import Results</AlertTitle>
            <AlertDescription>
              Successfully imported {lastUploadResult.details.success_count}{" "}
              users
              {lastUploadResult.details.error_count > 0 && (
                <>
                  , failed to import {lastUploadResult.details.error_count}{" "}
                  users
                </>
              )}
            </AlertDescription>
          </Alert>

          {lastUploadResult.details.errors.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Error Details:</h3>
              <ul className="space-y-2 text-sm text-red-600">
                {lastUploadResult.details.errors.map((error, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

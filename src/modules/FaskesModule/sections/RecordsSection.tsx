import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Shield,
  Search,
  CheckCircle2,
  XCircle,
  Hash,
  AlertCircle,
} from "lucide-react";
import { getCookie } from "cookies-next";
import { Record } from "../interface";
import { CreateRecordModal } from "../components/CreateRecordModal";

export const RecordsSection = () => {
  const [records, setRecords] = useState<Record[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);

  const fetchRecords = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = getCookie("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(
        "https://jagajkn-be-production.up.railway.app/api/v1/faskes/records",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();

      setRecords(data.records || []);
    } catch (err) {
      console.error("Failed to fetch records:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to fetch records");
      }
      setRecords([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const filteredRecords = records.filter(
    (record) =>
      record?.noSEP?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record?.user?.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record?.userNIK?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRecordCreated = () => {
    fetchRecords();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Rekam Medis</h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Cari berdasarkan SEP, Nama, atau NIK..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-[300px]"
            />
          </div>
          <CreateRecordModal onRecordCreated={handleRecordCreated} />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            Rekam Medis Terverifikasi Blockchain
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500" />
            </div>
          ) : (
            <>
              {records.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Belum ada rekam medis yang tersedia
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>No. SEP</TableHead>
                      <TableHead>Pasien</TableHead>
                      <TableHead>Diagnosa</TableHead>
                      <TableHead>Tindakan</TableHead>
                      <TableHead>Status Blockchain</TableHead>
                      <TableHead>Hash</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRecords.map((record) => (
                      <TableRow key={record.noSEP}>
                        <TableCell className="font-medium">
                          {record.noSEP}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {record.user?.nama || "N/A"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {record.userNIK}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div>{record.diagnosaPrimer}</div>
                            <div className="text-sm text-gray-500">
                              ICD-X: {record.icdX}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{record.tindakan}</TableCell>
                        <TableCell>
                          {record.blockchainVerified ? (
                            <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              Terverifikasi
                            </Badge>
                          ) : (
                            <Badge
                              variant="destructive"
                              className="flex items-center gap-1"
                            >
                              <XCircle className="h-3 w-3" />
                              Belum Terverifikasi
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm font-mono text-gray-500">
                            <Hash className="h-3 w-3" />
                            {record.hashCurrent ? (
                              <>
                                {record.hashCurrent.substring(0, 8)}...
                                <button
                                  onClick={() =>
                                    navigator.clipboard.writeText(
                                      record.hashCurrent
                                    )
                                  }
                                  className="hover:text-green-600"
                                  title="Copy hash"
                                >
                                  📋
                                </button>
                              </>
                            ) : (
                              "N/A"
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

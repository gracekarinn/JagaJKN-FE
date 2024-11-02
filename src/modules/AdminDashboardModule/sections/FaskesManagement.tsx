"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Phone,
  Mail,
  MapPin,
  Pencil,
  Trash2,
  Plus,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import { getCookie } from "cookies-next";
import { Faskes, FaskesInput, TingkatFaskes, ApiResponse } from "../constant";

const API_URL = "https://jagajkn-be-production.up.railway.app/api/v1/admin";

export default function FaskesManagementSection() {
  const [faskes, setFaskes] = useState<Faskes[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFaskes, setSelectedFaskes] = useState<Faskes | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState<FaskesInput>({
    kodeFaskes: "",
    nama: "",
    alamat: "",
    noTelp: "",
    tingkat: TingkatFaskes.TINGKAT_1,
    email: "",
    password: "",
  });

  const filteredFaskes = faskes.filter((f) => {
    const searchTerm = filter.toLowerCase();
    return (
      f.nama.toLowerCase().includes(searchTerm) ||
      f.kodeFaskes.toLowerCase().includes(searchTerm)
    );
  });

  const fetchFaskes = async () => {
    try {
      const token = getCookie("token");
      const res = await fetch(`${API_URL}/faskes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch faskes");
      }

      const response: ApiResponse<Faskes[]> = await res.json();
      setFaskes(response.faskes || []);
    } catch (error) {
      toast.error("Gagal mengambil data faskes");
      setFaskes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaskes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = getCookie("token");
      const url = selectedFaskes
        ? `${API_URL}/faskes/${selectedFaskes.kodeFaskes}`
        : `${API_URL}/faskes`;

      const submitData: FaskesInput = {
        ...formData,
        password: formData.password || undefined,
      };

      const res = await fetch(url, {
        method: selectedFaskes ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(submitData),
      });

      const response: ApiResponse<Faskes> = await res.json();

      if (!res.ok) {
        throw new Error(response.error || "Failed to save faskes");
      }

      toast.success(response.message);
      fetchFaskes();
      setIsOpen(false);
      resetForm();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Gagal menyimpan faskes");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      kodeFaskes: "",
      nama: "",
      alamat: "",
      noTelp: "",
      tingkat: TingkatFaskes.TINGKAT_1,
      email: "",
      password: "",
    });
    setSelectedFaskes(null);
    setShowPassword(false);
  };

  const handleDelete = async (kodeFaskes: string) => {
    if (!confirm("Apakah anda yakin ingin menghapus faskes ini?")) return;

    try {
      const token = getCookie("token");
      const res = await fetch(`${API_URL}/faskes/${kodeFaskes}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const response: ApiResponse<null> = await res.json();

      if (!res.ok) {
        throw new Error(response.error || "Failed to delete faskes");
      }

      toast.success(response.message);
      fetchFaskes();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Gagal menghapus faskes");
      }
    }
  };

  return (
    <div className="space-y-6 p-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Faskes</h1>
          <p className="text-slate-600">Mengatur Fasilitas Kesehatan</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#04A04A] hover:bg-[#038B3F]">
              <Plus className="w-4 h-4 mr-2" />
              Daftarkan Faskes
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {selectedFaskes ? "Edit Faskes" : "Tambah Faskes Baru"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Kode Faskes"
                value={formData.kodeFaskes}
                onChange={(e) =>
                  setFormData({ ...formData, kodeFaskes: e.target.value })
                }
                disabled={!!selectedFaskes}
                required
              />
              <Input
                placeholder="Nama Faskes"
                value={formData.nama}
                onChange={(e) =>
                  setFormData({ ...formData, nama: e.target.value })
                }
                required
              />
              <Input
                placeholder="Nomor Telepon"
                value={formData.noTelp}
                onChange={(e) =>
                  setFormData({ ...formData, noTelp: e.target.value })
                }
                required
              />
              <Select
                value={formData.tingkat}
                onValueChange={(value: TingkatFaskes) =>
                  setFormData({ ...formData, tingkat: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tingkat" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={TingkatFaskes.TINGKAT_1}>
                    Tingkat 1
                  </SelectItem>
                  <SelectItem value={TingkatFaskes.TINGKAT_2}>
                    Tingkat 2
                  </SelectItem>
                  <SelectItem value={TingkatFaskes.TINGKAT_3}>
                    Tingkat 3
                  </SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder={
                    selectedFaskes ? "New Password (optional)" : "Password"
                  }
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required={!selectedFaskes}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </button>
              </div>
              <Input
                placeholder="Alamat"
                value={formData.alamat}
                onChange={(e) =>
                  setFormData({ ...formData, alamat: e.target.value })
                }
                required
              />
              <Button
                type="submit"
                className="w-full bg-[#04A04A] hover:bg-[#038B3F]"
              >
                {selectedFaskes ? "Update" : "Tambah"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4">
        <Input
          placeholder="Search by name or code..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-md"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-[#04A04A]" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFaskes.map((f) => (
            <Card
              key={f.kodeFaskes}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-bold">{f.nama}</div>
                    <div className="text-sm text-gray-500">{f.kodeFaskes}</div>
                  </div>
                  <span className="px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                    Tingkat {f.tingkat}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>{f.noTelp}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  <span>{f.email}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{f.alamat}</span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedFaskes(f);
                    setFormData(f);
                    setIsOpen(true);
                  }}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(f.kodeFaskes)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

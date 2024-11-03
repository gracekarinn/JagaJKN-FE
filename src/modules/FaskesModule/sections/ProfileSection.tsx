import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCookie } from "cookies-next";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Building2, Mail, Phone, MapPin, Edit2, Loader2 } from "lucide-react";

interface FaskesProfile {
  kodeFaskes: string;
  nama: string;
  alamat: string;
  noTelp: string;
  tingkat: "TINGKAT_1" | "TINGKAT_2" | "TINGKAT_3";
  email: string;
  createdAt: string;
  updatedAt: string;
}

const profileSchema = z.object({
  nama: z.string().min(1, "Nama faskes harus diisi"),
  alamat: z.string().min(1, "Alamat harus diisi"),
  noTelp: z.string().min(1, "Nomor telepon harus diisi"),
  email: z.string().email("Email tidak valid"),
});

export const ProfileSection = () => {
  const [profile, setProfile] = useState<FaskesProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
  });

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const token = getCookie("token");

      const response = await fetch(
        "https://jagajkn-be-production.up.railway.app/api/v1/faskes/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = await response.json();
      setProfile(data.faskes);

      // Pre-fill form with current data
      form.reset({
        nama: data.faskes.nama,
        alamat: data.faskes.alamat,
        noTelp: data.faskes.noTelp,
        email: data.faskes.email,
      });
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      toast.error("Gagal memuat profil");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    try {
      const token = getCookie("token");
      const response = await fetch(
        "https://jagajkn-be-production.up.railway.app/api/v1/faskes/profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(values),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      toast.success("Profil berhasil diperbarui");
      setIsEditModalOpen(false);
      fetchProfile(); // Refresh profile data
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Gagal memperbarui profil");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Profil Faskes</h2>
        <Button onClick={() => setIsEditModalOpen(true)} className="gap-2">
          <Edit2 className="h-4 w-4" />
          Edit Profil
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informasi Umum</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Building2 className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">Kode Faskes</p>
                <p className="font-medium">{profile?.kodeFaskes}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Building2 className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">Nama Faskes</p>
                <p className="font-medium">{profile?.nama}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">Alamat</p>
                <p className="font-medium">{profile?.alamat}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Kontak & Detail</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Nomor Telepon
                </p>
                <p className="font-medium">{profile?.noTelp}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="font-medium">{profile?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Building2 className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-500">Tingkat</p>
                <p className="font-medium">
                  {profile?.tingkat.replace("_", " ")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Profil Faskes</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="nama"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Faskes</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="alamat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alamat</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="noTelp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nomor Telepon</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="gap-2"
                >
                  {form.formState.isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    "Simpan"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

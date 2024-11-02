"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { CircleUser, Lock, Mail, Phone } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { RegisterSchema, registerSchema, API_ENDPOINTS } from "../constant";
import { Building2 } from "lucide-react";

export const RegisterForm = () => {
  const router = useRouter();
  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      nik: "",
      namaLengkap: "",
      noTelp: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: RegisterSchema) => {
    try {
      const res = await fetch(API_ENDPOINTS.REGISTER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const response = await res.json();

      if (!res.ok) {
        throw new Error(response.error || "Registrasi gagal");
      }

      toast.success("Registrasi berhasil! Silakan login.");
      router.push("/login");
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Terjadi kesalahan saat registrasi");
      }
    }
  };

  return (
    <div className="min-h-screen relative bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-100 via-white to-blue-50">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-200/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-300/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-400/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
      </div>

      <div className="relative flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-[420px] space-y-8">
          <div className="text-center space-y-6">
            <div className="relative inline-block group">
              <div className="absolute inset-0 bg-blue-600/20 rounded-full blur-xl transition-all duration-500 group-hover:bg-blue-600/30" />
              <div className="relative bg-white p-4 rounded-full shadow-lg transform transition-all duration-500 hover:scale-105">
                <Building2 className="h-12 w-12 text-blue-600" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 bg-clip-text text-transparent">
                BPJS Kesehatan
              </h2>
              <p className="text-sm text-gray-600">
                Sistem Informasi Rekam Medis Terintegrasi Blockchain
              </p>
            </div>
          </div>
          <Card className="w-full max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Registrasi Akun Baru</CardTitle>
              <CardDescription>
                Silakan lengkapi data diri Anda untuk membuat akun
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="nik"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>NIK</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <CircleUser className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            <Input
                              {...field}
                              className="pl-10"
                              placeholder="Masukkan 16 digit NIK"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="namaLengkap"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Lengkap</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <CircleUser className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            <Input
                              {...field}
                              className="pl-10"
                              placeholder="Masukkan nama lengkap"
                            />
                          </div>
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
                          <div className="relative">
                            <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            <Input
                              {...field}
                              className="pl-10"
                              placeholder="Contoh: 08123456789"
                            />
                          </div>
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
                        <FormLabel>Email (Opsional)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            <Input
                              {...field}
                              value={field.value || ""}
                              type="email"
                              className="pl-10"
                              placeholder="Masukkan email"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            <Input
                              {...field}
                              type="password"
                              className="pl-10"
                              placeholder="Minimal 6 karakter"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin" />
                      </div>
                    ) : (
                      "Daftar"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <div className="text-sm text-gray-600">
                Sudah punya akun?{" "}
                <Link
                  href="/login"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Login disini
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

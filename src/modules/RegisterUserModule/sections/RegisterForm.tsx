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
import {
  CircleUser,
  Lock,
  Mail,
  Phone,
  Building2,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { RegisterSchema, registerSchema, API_ENDPOINTS } from "../constant";
import Image from "next/image";

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
        <div className="flex w-full max-w-6xl justify-between items-center">
          <div className="w-full max-w-[420px] space-y-8">
            <div className="text-center space-y-6">
              <div className="relative inline-block group">
                <div className="absolute inset-0 bg-blue-600/20 rounded-full blur-xl transition-all duration-500 group-hover:bg-blue-600/30" />
              </div>
            </div>

            <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-xl">
              <CardHeader className="space-y-1 pb-4">
                <CardTitle className="text-2xl text-center font-bold">
                  Registrasi Akun Baru
                </CardTitle>
                <CardDescription className="text-center">
                  Silakan lengkapi data diri Anda untuk membuat akun
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-4">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="nik"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-sm font-medium text-gray-700">
                            NIK
                          </FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-600 to-blue-400 opacity-20 blur-sm group-focus-within:opacity-30 transition-opacity" />
                              <div className="relative">
                                <CircleUser className="absolute left-3 top-2.5 h-5 w-5 text-blue-600 transition-colors group-hover:text-blue-700" />
                                <Input
                                  {...field}
                                  className="pl-10 h-12 bg-white/80 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                  placeholder="Masukkan 16 digit NIK"
                                />
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="namaLengkap"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-sm font-medium text-gray-700">
                            Nama Lengkap
                          </FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-600 to-blue-400 opacity-20 blur-sm group-focus-within:opacity-30 transition-opacity" />
                              <div className="relative">
                                <CircleUser className="absolute left-3 top-2.5 h-5 w-5 text-blue-600 transition-colors group-hover:text-blue-700" />
                                <Input
                                  {...field}
                                  className="pl-10 h-12 bg-white/80 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                  placeholder="Masukkan nama lengkap"
                                />
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="noTelp"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-sm font-medium text-gray-700">
                            Nomor Telepon
                          </FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-600 to-blue-400 opacity-20 blur-sm group-focus-within:opacity-30 transition-opacity" />
                              <div className="relative">
                                <Phone className="absolute left-3 top-2.5 h-5 w-5 text-blue-600 transition-colors group-hover:text-blue-700" />
                                <Input
                                  {...field}
                                  className="pl-10 h-12 bg-white/80 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                  placeholder="Contoh: 08123456789"
                                />
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-sm font-medium text-gray-700">
                            Email (Opsional)
                          </FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-600 to-blue-400 opacity-20 blur-sm group-focus-within:opacity-30 transition-opacity" />
                              <div className="relative">
                                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-blue-600 transition-colors group-hover:text-blue-700" />
                                <Input
                                  {...field}
                                  value={field.value || ""}
                                  type="email"
                                  className="pl-10 h-12 bg-white/80 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                  placeholder="Masukkan email"
                                />
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-sm font-medium text-gray-700">
                            Password
                          </FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-600 to-blue-400 opacity-20 blur-sm group-focus-within:opacity-30 transition-opacity" />
                              <div className="relative">
                                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-blue-600 transition-colors group-hover:text-blue-700" />
                                <Input
                                  {...field}
                                  type="password"
                                  className="pl-10 h-12 bg-white/80 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                  placeholder="Minimal 6 karakter"
                                />
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full h-12 bg-[#04A04A] hover:from-blue-700 hover:to-blue-600 text-white rounded-lg font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-600/40 transition-all duration-300"
                      disabled={form.formState.isSubmitting}
                    >
                      {form.formState.isSubmitting ? (
                        <div className="flex items-center justify-center space-x-2">
                          <Loader2 className="h-5 w-5 animate-spin" />
                          <span>Memproses...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-2 transition-transform duration-300 hover:scale-105">
                          <span>Daftar</span>
                        </div>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>

              <CardFooter className="flex flex-col space-y-4 pt-0">
                <div className="text-sm text-center text-gray-600">
                  Sudah punya akun?{" "}
                  <Link
                    href="/login"
                    className="font-medium text-blue-600 hover:text-blue-700 transition-colors underline-offset-4 hover:underline"
                  >
                    Login disini
                  </Link>
                </div>
              </CardFooter>
            </Card>
          </div>
          <div className="hidden lg:block w-[600px] h-[600px] relative">
            <Image
              alt="contoh"
              src="/meja.png"
              fill
              sizes="none"
              className="object-contain"
              quality={100}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

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
import { Hospital, Lock, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { setCookie } from "cookies-next";
import {
  FaskesLoginSchema,
  faskesLoginSchema,
  API_ENDPOINTS,
  FaskesLoginResponse,
} from "../constant";

export const LoginFormFaskes = () => {
  const router = useRouter();
  const form = useForm<FaskesLoginSchema>({
    resolver: zodResolver(faskesLoginSchema),
    defaultValues: {
      kodeFaskes: "",
      password: "",
    },
  });

  const onSubmit = async (data: FaskesLoginSchema) => {
    try {
      const res = await fetch(API_ENDPOINTS.FASKES_LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Login gagal");
      }

      const { token, faskes } = (await res.json()) as FaskesLoginResponse;

      setCookie("token", token);

      toast.success("Login faskes berhasil", {
        description: `Selamat datang, ${faskes.namaFaskes}`,
      });

      router.push("/faskes/dashboard");
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Terjadi kesalahan saat login");
      }
    }
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-green-50 via-white to-green-50">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-green-200/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-green-300/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
      </div>

      <div className="relative flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-[420px] space-y-8">
          <div className="text-center space-y-6">
            <div className="relative inline-block group">
              <div className="absolute inset-0 bg-green-600/20 rounded-full blur-xl transition-all duration-500 group-hover:bg-green-600/30" />
              <div className="relative bg-white p-4 rounded-full shadow-lg transform transition-all duration-500 hover:scale-105">
                <Hospital className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-green-700 via-green-600 to-green-500 bg-clip-text text-transparent">
                Fasilitas Kesehatan
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                BPJS Kesehatan Provider Portal
              </p>
            </div>
          </div>

          <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-xl">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-2xl text-center font-bold">
                Login Faskes
              </CardTitle>
              <CardDescription className="text-center">
                Masukkan kredensial faskes Anda
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
                    name="kodeFaskes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kode Faskes</FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-green-600 to-green-400 opacity-20 blur-sm group-focus-within:opacity-30 transition-opacity" />
                            <div className="relative">
                              <Hospital className="absolute left-3 top-2.5 h-5 w-5 text-green-600" />
                              <Input
                                {...field}
                                className="pl-10 h-12 bg-white/80 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="Masukkan kode faskes"
                              />
                            </div>
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
                          <div className="relative group">
                            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-green-600 to-green-400 opacity-20 blur-sm group-focus-within:opacity-30 transition-opacity" />
                            <div className="relative">
                              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-green-600" />
                              <Input
                                {...field}
                                type="password"
                                className="pl-10 h-12 bg-white/80 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="••••••••"
                              />
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white rounded-lg font-semibold shadow-lg shadow-green-500/30 hover:shadow-green-600/40 transition-all duration-300"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        <span>Memproses...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <ShieldCheck className="h-5 w-5" />
                        <span>Login Faskes</span>
                      </div>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <Hospital className="h-4 w-4" />
                <span>BPJS Kesehatan Provider © 2024</span>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle, Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { getCookie } from "cookies-next";

const createRecordSchema = z.object({
  noSEP: z.string().min(1, "No SEP harus diisi"),
  userNIK: z.string().min(16, "NIK harus 16 digit").max(16),
  jenisRawat: z.enum(["RAWAT_JALAN", "RAWAT_INAP"]),
  diagnosaAwal: z.string().min(1, "Diagnosa awal harus diisi"),
  diagnosaPrimer: z.string().min(1, "Diagnosa primer harus diisi"),
  icdX: z.string().min(1, "ICD-X harus diisi"),
  tindakan: z.string().min(1, "Tindakan harus diisi"),
});

type CreateRecordInput = z.infer<typeof createRecordSchema>;

export const CreateRecordModal = ({
  onRecordCreated,
}: {
  onRecordCreated: () => void;
}) => {
  const [open, setOpen] = useState(false);

  const form = useForm<CreateRecordInput>({
    resolver: zodResolver(createRecordSchema),
    defaultValues: {
      noSEP: "",
      userNIK: "",
      jenisRawat: "RAWAT_JALAN",
      diagnosaAwal: "",
      diagnosaPrimer: "",
      icdX: "",
      tindakan: "",
    },
  });

  const onSubmit = async (data: CreateRecordInput) => {
    try {
      const token = getCookie("token");

      const response = await fetch(
        "https://jagajkn-be-production.up.railway.app/api/v1/faskes/records",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Gagal membuat rekam medis");
      }

      toast.success("Rekam medis berhasil dibuat");
      setOpen(false);
      form.reset();
      onRecordCreated();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal membuat rekam medis"
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2" variant="default">
          <PlusCircle className="h-4 w-4" />
          Tambah Rekam Medis
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Tambah Rekam Medis Baru</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="noSEP"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>No. SEP</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan nomor SEP" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="userNIK"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NIK Pasien</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan NIK pasien" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="jenisRawat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jenis Rawat</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih jenis rawat" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="RAWAT_JALAN">Rawat Jalan</SelectItem>
                      <SelectItem value="RAWAT_INAP">Rawat Inap</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="diagnosaAwal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Diagnosa Awal</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Masukkan diagnosa awal"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="diagnosaPrimer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Diagnosa Primer</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Masukkan diagnosa primer"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="icdX"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ICD-X</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan kode ICD-X" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tindakan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tindakan</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Masukkan tindakan yang dilakukan"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Batal
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
  );
};

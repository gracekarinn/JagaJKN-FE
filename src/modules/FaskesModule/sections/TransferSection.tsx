import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { getCookie } from "cookies-next";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  RefreshCw,
  ArrowLeftRight,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import { AcceptTransferModal } from "../components/AcceptTransferModal";

interface Transfer {
  id: string;
  noSEP: string;
  sourceFaskes: string;
  destinationFaskes: string;
  transferReason: string;
  transferTime: string;
  status: string;
  recordKesehatan: {
    noSEP: string;
    diagnosaAwal: string;
  };
  user: {
    nama: string;
    nik: string;
  };
}

const transferSchema = z.object({
  noSEP: z.string().min(1, "No SEP harus diisi"),
  destinationCode: z.string().min(1, "Kode faskes tujuan harus diisi"),
  reason: z.string().min(1, "Alasan rujukan harus diisi"),
});

export const TransferSection = () => {
  const [pendingTransfers, setPendingTransfers] = useState<Transfer[]>([]);
  const [transferHistory, setTransferHistory] = useState<Transfer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState<Transfer | null>(
    null
  );
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);

  const form = useForm<z.infer<typeof transferSchema>>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      noSEP: "",
      destinationCode: "",
      reason: "",
    },
  });

  const fetchTransfers = async () => {
    try {
      setIsLoading(true);
      const token = getCookie("token");
      console.log("[Debug] Token:", token?.substring(0, 20) + "...");

      const pendingRes = await fetch(
        "https://jagajkn-be-production.up.railway.app/api/v1/faskes/transfers/pending",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("[Debug] Pending transfers status:", pendingRes.status);
      const pendingData = await pendingRes.json();
      console.log("[Debug] Pending transfers data:", pendingData);

      const historyRes = await fetch(
        "https://jagajkn-be-production.up.railway.app/api/v1/faskes/transfers/history",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const historyData = await historyRes.json();
      console.log("[Debug] History transfers data:", historyData);

      setPendingTransfers(pendingData.transfers || []);
      setTransferHistory(historyData.transfers || []);
    } catch (error) {
      console.error("[Error] Fetch error:", error);
      toast.error("Gagal memuat data transfer");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptTransfer = async (transferId: string) => {
    try {
      setIsAccepting(true);
      const token = getCookie("token");

      const response = await fetch(
        `https://jagajkn-be-production.up.railway.app/api/v1/faskes/transfers/${transferId}/accept`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to accept transfer");
      }

      toast.success("Transfer berhasil diterima");
      setIsAcceptModalOpen(false);
      setSelectedTransfer(null);
      fetchTransfers();
    } catch (error) {
      console.error("[Error] Accept transfer error:", error);
      toast.error("Gagal menerima transfer");
    } finally {
      setIsAccepting(false);
    }
  };
  useEffect(() => {
    fetchTransfers();
  }, []);

  const handleAcceptClick = (transfer: Transfer) => {
    setSelectedTransfer(transfer);
    setIsAcceptModalOpen(true);
  };

  const onSubmitTransfer = async (values: z.infer<typeof transferSchema>) => {
    try {
      const token = getCookie("token");
      const response = await fetch(
        "https://jagajkn-be-production.up.railway.app/api/v1/faskes/transfer",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(values),
        }
      );

      if (!response.ok) throw new Error("Failed to initiate transfer");

      toast.success("Transfer berhasil diinisiasi");
      setIsModalOpen(false);
      form.reset();
      fetchTransfers();
    } catch (error) {
      toast.error("Gagal menginisiasi transfer");
    }
  };

  const renderPendingTransfers = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>No. SEP</TableHead>
          <TableHead>Pasien</TableHead>
          <TableHead>Faskes Asal</TableHead>
          <TableHead>Alasan</TableHead>
          <TableHead>Waktu</TableHead>
          <TableHead>Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pendingTransfers.map((transfer) => (
          <TableRow key={transfer.id}>
            <TableCell>{transfer.noSEP}</TableCell>
            <TableCell>
              <div>
                <div className="font-medium">{transfer.user.nama}</div>
                <div className="text-sm text-gray-500">{transfer.user.nik}</div>
              </div>
            </TableCell>
            <TableCell>{transfer.sourceFaskes}</TableCell>
            <TableCell>{transfer.transferReason}</TableCell>
            <TableCell>
              {new Date(transfer.transferTime).toLocaleDateString("id-ID")}
            </TableCell>
            <TableCell>
              <Button
                size="sm"
                onClick={() => handleAcceptClick(transfer)}
                className="gap-2"
              >
                <CheckCircle2 className="h-4 w-4" />
                Terima
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Transfer Pasien</h2>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <ArrowLeftRight className="h-4 w-4" />
              Inisiasi Transfer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Inisiasi Transfer Pasien</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmitTransfer)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="noSEP"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>No. SEP</FormLabel>
                      <FormControl>
                        <Input placeholder="Masukkan No. SEP" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="destinationCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kode Faskes Tujuan</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Masukkan kode faskes tujuan"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alasan Rujukan</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Masukkan alasan rujukan"
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
                    onClick={() => setIsModalOpen(false)}
                  >
                    Batal
                  </Button>
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Memproses
                      </>
                    ) : (
                      "Kirim"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending" className="gap-2">
            <Clock className="h-4 w-4" />
            Pending
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Riwayat
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Transfer Pending</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500" />
                </div>
              ) : pendingTransfers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Tidak ada transfer pending
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>No. SEP</TableHead>
                      <TableHead>Pasien</TableHead>
                      <TableHead>Faskes Asal</TableHead>
                      <TableHead>Alasan</TableHead>
                      <TableHead>Waktu</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingTransfers.map((transfer) => (
                      <TableRow key={transfer.id}>
                        <TableCell>{transfer.noSEP}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {transfer.user.nama}
                            </div>
                            <div className="text-sm text-gray-500">
                              {transfer.user.nik}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{transfer.sourceFaskes}</TableCell>
                        <TableCell>{transfer.transferReason}</TableCell>
                        <TableCell>
                          {new Date(transfer.transferTime).toLocaleDateString(
                            "id-ID"
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            onClick={() => handleAcceptTransfer(transfer.id)}
                          >
                            Terima
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Riwayat Transfer</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500" />
                </div>
              ) : transferHistory.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Tidak ada riwayat transfer
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>No. SEP</TableHead>
                      <TableHead>Pasien</TableHead>
                      <TableHead>Asal</TableHead>
                      <TableHead>Tujuan</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Waktu</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transferHistory.map((transfer) => (
                      <TableRow key={transfer.id}>
                        <TableCell>{transfer.noSEP}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {transfer.user.nama}
                            </div>
                            <div className="text-sm text-gray-500">
                              {transfer.user.nik}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{transfer.sourceFaskes}</TableCell>
                        <TableCell>{transfer.destinationFaskes}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              transfer.status === "ACCEPTED"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }
                          >
                            {transfer.status === "ACCEPTED" ? (
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                            ) : (
                              <Clock className="h-3 w-3 mr-1" />
                            )}
                            {transfer.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(transfer.transferTime).toLocaleDateString(
                            "id-ID"
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <AcceptTransferModal
        isOpen={isAcceptModalOpen}
        onClose={() => {
          setIsAcceptModalOpen(false);
          setSelectedTransfer(null);
        }}
        transfer={selectedTransfer}
        onAccept={handleAcceptTransfer}
        isLoading={isAccepting}
      />
    </div>
  );
};
